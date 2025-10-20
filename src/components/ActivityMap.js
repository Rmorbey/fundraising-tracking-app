import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import * as polyline from 'polyline-encoded';

// Robust polyline decoder using polyline-encoded library
function decodePolyline(encoded) {
  try {
    // Use polyline-encoded library for proper decoding
    const coordinates = polyline.decode(encoded);
    if (coordinates && coordinates.length > 0) {
      return coordinates.map(coord => [coord[0], coord[1]]);
    }
  } catch (error) {
    console.warn('polyline-encoded library failed, using fallback decoder:', error.message);
  }
  
  // Use our reliable fallback decoder
  return decodePolylineFallback(encoded);
}

// Fallback custom decoder (kept as backup)
function decodePolylineFallback(encoded) {
  const points = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  
  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// Calculate proper bounds from route coordinates
function calculateBounds(points) {
  if (points.length === 0) return null;
  
  const lats = points.map(p => p[0]);
  const lngs = points.map(p => p[1]);
  
  return {
    south: Math.min(...lats),
    west: Math.min(...lngs),
    north: Math.max(...lats),
    east: Math.max(...lngs)
  };
}

// Animation function with proper error handling and cleanup
function animateRoute(routePoints, mapData, map, animationRef) {
    if (routePoints.length < 2) {
        return;
    }
    
    // Comprehensive map readiness check
    if (!map || 
        typeof map.addLayer !== 'function' || 
        typeof map.getContainer !== 'function' ||
        !map.getContainer() ||
        !map._loaded) {
        return;
    }
    
    // Clean up any existing animation for THIS specific map
    if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
    }
    
    // Remove any existing animation layers from the map
    map.eachLayer((layer) => {
        if (layer.options && (
            (layer.options.color === '#ff6b35' && layer.options.dashArray === '15, 10') ||
            (layer.options.fillColor === '#ff6b35' && layer.options.radius === 10)
        )) {
            map.removeLayer(layer);
        }
    });
    
    try {
        // Create an animated polyline that will grow
        const animatedRoute = window.L.polyline([], {
            color: '#ff6b35',
            weight: 6,
            opacity: 1.0,
            dashArray: '15, 10'
        });
        
        // Create a moving dot
        const movingDot = window.L.circleMarker(routePoints[0], {
            radius: 10,
            fillColor: '#ff6b35',
            color: '#fff',
            weight: 4,
            opacity: 1,
            fillOpacity: 0.9
        });
        
        // Add layers to map with comprehensive error handling
        try {
            if (map && typeof map.addLayer === 'function' && map._loaded) {
                map.addLayer(animatedRoute);
                map.addLayer(movingDot);
            } else {
                console.warn('Map not ready for layer addition, skipping animation');
                return;
            }
        } catch (layerError) {
            console.error('Error adding layers to map:', layerError);
            return;
        }
        
        // Animation controls with performance optimization
        let currentIndex = 0;
        const totalPoints = routePoints.length;
        // Optimize animation speed based on route complexity
        const animationSpeed = Math.max(15, Math.min(50, Math.floor(totalPoints / 80)));
        
        // For very long routes, sample points to improve performance
        const shouldSample = totalPoints > 1000;
        const sampleRate = shouldSample ? Math.ceil(totalPoints / 500) : 1;
        
        // Animation function with performance optimizations
        function animateStep() {
            try {
                if (currentIndex < totalPoints) {
                    // For performance, only update every few frames for long routes
                    if (currentIndex % sampleRate === 0 || !shouldSample) {
                        // Add next point to animated route
                        const currentPoints = routePoints.slice(0, currentIndex + 1);
                        animatedRoute.setLatLngs(currentPoints);
                    }
                    
                    // Always move the dot for smooth animation
                    movingDot.setLatLng(routePoints[currentIndex]);
                    
                    currentIndex++;
                } else {
                    // Animation complete - restart the loop
                    currentIndex = 0;
                    animatedRoute.setLatLngs([]);
                    movingDot.setLatLng(routePoints[0]);
                }
            } catch (stepError) {
                console.error('Error in animation step:', stepError);
                if (animationRef.current) {
                    clearInterval(animationRef.current);
                    animationRef.current = null;
                }
            }
        }
        
        // Start animation immediately - no delay
        if (map && typeof map.addLayer === 'function') {
            animationRef.current = setInterval(animateStep, animationSpeed);
        }
    } catch (error) {
        console.error('Error creating route animation:', error);
    }
}

const ActivityMap = memo(function ActivityMap({ activity, apiKey }) {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const animationRef = useRef(null);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current || mapInitialized || !window.L || (!apiKey && !process.env.REACT_APP_STRAVA_API_KEY)) return;

    try {
      // Validate map container
      if (!mapRef.current || mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
        console.warn('Map container not ready, retrying...');
        setTimeout(initializeMap, 100);
        return;
      }
      // Clear any existing map instance
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      
      // Get GPS data from activity data
      const mapData = activity.map || {};
      
      // Check for polyline data first, then GPS points
      let routePoints = [];
      if (mapData.polyline) {
        try {
          routePoints = decodePolyline(mapData.polyline);
          if (!routePoints || routePoints.length === 0) {
            console.warn('Polyline decoding returned empty points, falling back to GPS points');
            if (mapData.gps_points && mapData.gps_points.length > 0) {
              routePoints = mapData.gps_points.map(point => [point.lat, point.lng]);
            }
          }
        } catch (error) {
          console.error('Error decoding polyline:', error);
          if (mapData.gps_points && mapData.gps_points.length > 0) {
            routePoints = mapData.gps_points.map(point => [point.lat, point.lng]);
          }
        }
      } else if (mapData.gps_points && mapData.gps_points.length > 0) {
        routePoints = mapData.gps_points.map(point => [point.lat, point.lng]);
      }
      
      // Filter out invalid coordinates
      routePoints = routePoints.filter(point => 
        point && 
        Array.isArray(point) && 
        point.length === 2 && 
        typeof point[0] === 'number' && 
        typeof point[1] === 'number' &&
        !isNaN(point[0]) && 
        !isNaN(point[1]) &&
        point[0] >= -90 && point[0] <= 90 &&  // Valid latitude
        point[1] >= -180 && point[1] <= 180   // Valid longitude
      );
      
      if (routePoints.length > 0) {
        // Create map
        const map = window.L.map(mapRef.current, {
          zoomControl: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false
        });
        
        // Try Jawg Dark tiles first, fallback to CartoDB
        let tileLayerAdded = false;
        // Create custom tile layer that properly handles API key authentication
        const customTileLayer = window.L.tileLayer('', {
          attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 0,
          maxZoom: 22
        });
        
        // Override createTile to handle authentication properly
        customTileLayer.createTile = function(coords, done) {
          const tile = document.createElement('img');
          const stravaApiKey = apiKey || process.env.REACT_APP_STRAVA_API_KEY;
          
          // Set up error handling
          tile.onerror = () => {
            console.error('Tile load error for coords:', coords);
            done(new Error('Tile load error'), tile);
          };
          
          tile.onload = () => {
            done(null, tile);
          };
          
          // Set tile dimensions
          tile.style.display = 'block';
          tile.style.width = '256px';
          tile.style.height = '256px';
          
          // Fetch tile with proper authentication
          const tileUrl = `https://api.russellmorbey.co.uk/api/strava-integration/map-tiles/${coords.z}/${coords.x}/${coords.y}?style=dark`;
          
          fetch(tileUrl, {
            headers: {
              'X-API-Key': stravaApiKey
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            tile.src = objectUrl;
            
            // Clean up object URL after tile loads
            tile.addEventListener('load', () => {
              URL.revokeObjectURL(objectUrl);
            });
          })
          .catch(error => {
            // Fallback to a placeholder or error tile
            tile.style.backgroundColor = '#333';
            tile.style.display = 'flex';
            tile.style.alignItems = 'center';
            tile.style.justifyContent = 'center';
            tile.style.color = '#fff';
            tile.style.fontSize = '12px';
            tile.textContent = '❌';
            done(error, tile);
          });
          
          return tile;
        };
        
        // Add the custom tile layer to the map
        try {
          map.addLayer(customTileLayer);
          tileLayerAdded = true;
        } catch (error) {
          console.error('Error adding custom tile layer:', error);
        }
        
        
        // Fallback to CartoDB Dark if Jawg failed
        if (!tileLayerAdded) {
          try {
            const fallbackLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 20
            });
            map.addLayer(fallbackLayer);
          } catch (error) {
            console.error('Error adding fallback tile layer:', error);
          }
        }
        
        // Add route with error handling
        let routeLine = null;
        // Add static route line for reference
        if (routePoints.length > 0) {
          try {
            const routePolyline = window.L.polyline(routePoints, {
              color: '#ff6b35',
              weight: 4,
              opacity: 0.9
            });
            map.addLayer(routePolyline);
            routeLine = routePolyline;
          } catch (error) {
            console.error('Error creating route line:', error);
          }
        }
        
        // Fit map to route with improved bounds calculation and error handling
        try {
          const calculatedBounds = calculateBounds(routePoints);
          if (calculatedBounds) {
            const bounds = [
              [calculatedBounds.south, calculatedBounds.west],
              [calculatedBounds.north, calculatedBounds.east]
            ];
            map.fitBounds(bounds, {padding: [10, 10]});
          } else if (mapData.bounds) {
            // Fallback to backend-provided bounds
            const bounds = [
              [mapData.bounds.south, mapData.bounds.west],
              [mapData.bounds.north, mapData.bounds.east]
            ];
            map.fitBounds(bounds, {padding: [10, 10]});
          } else if (routeLine) {
            // Final fallback to Leaflet's automatic bounds
            map.fitBounds(routeLine.getBounds(), {padding: [10, 10]});
          } else {
            // Ultimate fallback - center on a default location
            map.setView([51.5074, -0.1278], 10); // London coordinates
          }
        } catch (error) {
          console.error('Error fitting map bounds:', error);
          // Fallback to default view
          map.setView([51.5074, -0.1278], 10);
        }
        
        // Start route animation after map is ready
        map.whenReady(() => {
          if (map && typeof map.addLayer === 'function' && typeof map.getContainer === 'function' && map.getContainer()) {
            try {
              animateRoute(routePoints, mapData, map, animationRef);
            } catch (error) {
              console.error('Error starting route animation:', error);
            }
          }
        });
        
      } else {
        // No GPS data - show placeholder
        mapRef.current.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 14px;">
            🗺️ No GPS Data
            <div style="font-size: 12px; color: #999; margin-top: 5px;">This activity was recorded without GPS</div>
          </div>
        `;
      }
      
      setMapInitialized(true);
    } catch (error) {
      console.error('Map creation error:', error);
      mapRef.current.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #c33; font-size: 14px;">
          ❌ Map Error
          <div style="font-size: 12px; color: #999; margin-top: 5px;">Failed to load map: ${error.message}</div>
        </div>
      `;
    }
  }, [mapInitialized, activity.map, apiKey]);

  // Initialize map when component mounts and has real data
  useEffect(() => {
    // Wait for Leaflet to be available
    const checkLeaflet = () => {
      if (window.L && activity.map?.polyline && !mapInitialized && (apiKey || process.env.REACT_APP_STRAVA_API_KEY)) {
        initializeMap();
      } else if (!window.L) {
        // Retry after a short delay if Leaflet isn't loaded yet
        setTimeout(checkLeaflet, 100);
      }
    };
    
    checkLeaflet();
  }, [activity.map, mapInitialized, initializeMap, apiKey]);

  // Cleanup animation when component unmounts
  useEffect(() => {
    return () => {
      // Clean up local animation ref
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  if (!activity.map?.polyline) {
    return (
      <div className="map-placeholder" style={{
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        color: '#666'
      }}>
        <div className="map-icon" style={{ fontSize: '2rem', marginBottom: '10px' }}>🗺️</div>
        <p>No GPS data available for this activity</p>
      </div>
    );
  }

  if (!window.L) {
    return (
      <div className="map-placeholder" style={{
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        color: '#666'
      }}>
        <div className="map-icon" style={{ fontSize: '2rem', marginBottom: '10px' }}>🗺️</div>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div 
      className="map-container" 
      style={{ 
        height: '300px', 
        width: '100%',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={mapRef} 
        className="activity-map"
        style={{ 
          height: '100%', 
          width: '100%',
          minHeight: '300px'
        }}
      ></div>
    </div>
  );
});

export default ActivityMap;
