import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Activity.css';
import * as polyline from 'polyline-encoded';

// Global active widget state
let globalActiveWidget = null;

// Single Active Deezer Widget Management
const useSingleActiveDeezerWidget = () => {
  const activeWidgetRef = useRef(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handleWidgetClick = (event) => {
      // Check if click is on a Deezer widget iframe or its container
      const iframe = event.target.closest('iframe[src*="widget.deezer.com"]');
      const widgetContainer = event.target.closest('.deezer-widget');
      
      if (iframe || widgetContainer) {
        
        // Find the iframe if we clicked on the container
        const targetIframe = iframe || widgetContainer?.querySelector('iframe[src*="widget.deezer.com"]');
        
        if (targetIframe) {
          // Pause the previously active widget
          if (globalActiveWidget && globalActiveWidget !== targetIframe) {
            try {
              globalActiveWidget.contentWindow?.postMessage('pause', '*');
            } catch (error) {
              console.warn('Could not pause previous widget:', error);
            }
          }
          
          // Set new active widget (store both iframe and container)
          globalActiveWidget = targetIframe;
          activeWidgetRef.current = widgetContainer;
          
          // Force re-render to update CSS classes
          forceUpdate(prev => prev + 1);
        }
      }
    };

    // Listen for clicks on Deezer widgets
    document.addEventListener('click', handleWidgetClick);

    return () => {
      document.removeEventListener('click', handleWidgetClick);
    };
  }, []);

  return activeWidgetRef.current;
};


// Deezer Widget Refresh and Error Handling
const useDeezerWidgetRefresh = (activity) => {
  const [widgetKey, setWidgetKey] = useState(0);

  const refreshWidget = useCallback(() => {
    console.log('Refreshing Deezer widget for activity:', activity.name);
    setWidgetKey(prev => prev + 1);
  }, [activity.name]);

  // Debug widget state for specific activities
  useEffect(() => {
    if (activity.name === 'Morning Run' && activity.date === '2025-09-27') {
      console.log('DEBUG - Deezer widget hook for Morning Run');
      console.log('DEBUG - Music data:', activity.music);
      console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
    }
    if (activity.name === '5K - 10K Runs') {
      console.log('DEBUG - Deezer widget hook for 5K - 10K Runs');
      console.log('DEBUG - Music data:', activity.music);
      console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
    }
  }, [activity]);

  return { widgetKey, refreshWidget };
};

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

// Calculate centroid for map centering
// eslint-disable-next-line no-unused-vars
function calculateCentroid(points) {
  if (points.length === 0) return null;
  
  const lats = points.map(p => p[0]);
  const lngs = points.map(p => p[1]);
  
  const centroidLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centroidLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  
  return [centroidLat, centroidLng];
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
        
        // Animation controls
        let currentIndex = 0;
        const totalPoints = routePoints.length;
        const animationSpeed = Math.max(10, Math.floor(totalPoints / 100));
        
        // Animation function
        function animateStep() {
            try {
                if (currentIndex < totalPoints) {
                    // Add next point to animated route
                    const currentPoints = routePoints.slice(0, currentIndex + 1);
                    animatedRoute.setLatLngs(currentPoints);
                    
                    // Move the dot to current position
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

function Activity({ activity, isRealData = false, apiKey }) {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const animationRef = useRef(null);
  const musicWidgetRef = useRef(null);

  // Single active Deezer widget management
  const activeWidget = useSingleActiveDeezerWidget();
  
  // Deezer widget refresh and error handling
  const { widgetKey, refreshWidget } = useDeezerWidgetRefresh(activity);

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
    if (activity.map?.polyline && !mapInitialized && window.L && (apiKey || process.env.REACT_APP_STRAVA_API_KEY)) {
      initializeMap();
    }
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

  // Remove duplicate animateRoute function - using the global one instead


  const formatDistance = (distance) => {
    if (typeof distance === 'number') {
      return distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`;
    }
    if (typeof distance === 'string' && distance.includes('km')) {
      return distance; // Already formatted
    }
    return distance || '0.0 km';
  };

  const formatDuration = (seconds) => {
    if (typeof seconds === 'number' && !isNaN(seconds)) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    if (typeof seconds === 'string') {
      return seconds; // Already formatted
    }
    return '0:00';
  };

  const formatPace = (activity) => {
    if (activity.type === 'Ride') {
      const avgSpeed = activity.distance_km / (activity.duration_minutes / 60);
      return `${avgSpeed.toFixed(1)} km/h avg speed`;
    }
    
    if (activity.duration_minutes && activity.distance_km) {
      const paceSeconds = (activity.duration_minutes * 60) / activity.distance_km;
      const paceMinutes = Math.floor(paceSeconds / 60);
      const paceSecs = Math.floor(paceSeconds % 60);
      return `${paceMinutes}:${paceSecs.toString().padStart(2, '0')}/km`;
    }
    
    return activity.pace;
  };

  const detectMusic = (description) => {
    if (!description) return null;
    
    const musicPatterns = {
      track: /Track:\s*(.+?)(?:\s+by\s+(.+?))?(?:\s*$|\s*[,\n])/i,
      album: /Album:\s*(.+?)(?:\s+by\s+(.+?))?(?:\s*$|\s*[,\n])/i,
      playlist: /Playlist:\s*(.+?)(?:\s*$|\s*[,\n])/i,
      russellRadio: /Russell Radio:\s*(.+?)(?:\s+by\s+(.+?))?(?:\s*$|\s*[,\n])/i
    };
    
    for (const [type, pattern] of Object.entries(musicPatterns)) {
      const match = description.match(pattern);
      if (match) {
        return {
          type: type,
          title: match[1]?.trim(),
          artist: match[2]?.trim() || null
        };
    }
    }
    return null;
  };

  const formatDescription = (description) => {
    if (!description) return null;
    
    return description
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  // eslint-disable-next-line no-unused-vars
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
  };

  // eslint-disable-next-line no-unused-vars
  const musicInfo = detectMusic(activity.description || activity.spotify?.description);

  // Debug Deezer widget data for specific activities
  if (activity.name === 'Morning Run' && activity.date === '2025-09-27') {
    console.log('DEBUG - Morning Run activity:', activity.name, activity.date);
    console.log('DEBUG - Activity description:', activity.description);
    console.log('DEBUG - Activity start_time:', activity.start_time);
    console.log('DEBUG - Music data:', activity.music);
    console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
    console.log('DEBUG - Widget HTML content:', activity.music?.widget_html);
    console.log('DEBUG - Widget HTML length:', activity.music?.widget_html?.length);
    console.log('DEBUG - Music object keys:', activity.music ? Object.keys(activity.music) : 'No music object');
    console.log('DEBUG - Photos data:', activity.photos);
    console.log('DEBUG - Photos array:', activity.photos?.photos);
  }
  if (activity.name === '5K - 10K Runs') {
    console.log('DEBUG - 5K - 10K Runs activity:', activity.name, activity.date);
    console.log('DEBUG - Music data:', activity.music);
    console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
    console.log('DEBUG - Photos data:', activity.photos);
    console.log('DEBUG - Photos array:', activity.photos?.photos);
  }
  
  // Debug any activity with Enter Shikari music
  if (activity.description?.toLowerCase().includes('enter shikari') ||
      activity.music?.title?.toLowerCase().includes('enter shikari') ||
      activity.music?.artist?.toLowerCase().includes('enter shikari')) {
    console.log('DEBUG - Enter Shikari activity found:', activity.name, activity.date);
    console.log('DEBUG - Music data:', activity.music);
    console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
  }

  return (
    <div className="activity-item">
      <div className="activity-header-container">
        <h3 className="activity-title">{activity.title || activity.name}</h3>
        <span className="activity-date">{activity.date}</span>
      </div>

      {/* Description Section */}
      {(activity.description || activity.spotify?.description) && (
        <div className="description-container">
          <div 
            className="description-item"
            dangerouslySetInnerHTML={{ 
              __html: formatDescription(activity.description || activity.spotify?.description) 
            }}
          />
        </div>
      )}

      {/* Map Section */}
      {activity.map?.polyline ? (
        <div className="map-container">
          <div ref={mapRef} className="activity-map"></div>
        </div>
      ) : (
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Interactive route map</p>
        </div>
      )}

      {/* Run Data Section */}
      <div className="run-data-section">
        <div className="data-content">
          <div className="data-item">
            <span className="data-label">Distance:</span>
            <span className="data-value">{formatDistance(activity.distance)}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Time:</span>
            <span className="data-value">{formatDuration(activity.time || activity.moving_time)}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Pace:</span>
            <span className="data-value">{formatPace(activity)}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Type:</span>
            <span className="data-value">{activity.type}</span>
          </div>
          {activity.total_elevation_gain > 0 && (
            <div className="data-item">
              <span className="data-label">Elevation:</span>
              <span className="data-value">{activity.total_elevation_gain}m</span>
            </div>
          )}
        </div>
      </div>


      {/* Photos Section - Display photos directly without container */}
      {activity.photos && (activity.photos.photos || activity.photos).length > 0 && (
        (activity.photos.photos || activity.photos).map((photo, index) => {
          // Use highest quality photo URL (size=5000) for all display sizes
          let photoUrl = null;
          if (photo.urls) {
            // Prefer high-quality URL, fallback to available sizes
            photoUrl = photo.urls['1200'] || photo.urls['600'] || photo.urls['300'];
          } else if (photo.url) {
            photoUrl = photo.url;
          } else if (typeof photo === 'string') {
            photoUrl = photo;
          }
          
          if (!photoUrl) {
            console.warn('No valid photo URL found for photo:', photo);
            return null;
          }
          
          return (
            <img
              key={index}
              src={photoUrl}
              alt={`Activity ${index + 1}`}
              onClick={() => {
                setSelectedPhoto(photoUrl);
                setShowPhotoModal(true);
              }}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
          );
        })
      )}

      {/* Comments Section */}
      {activity.comments && activity.comments.length > 0 && (
        <div className="comments-container">
          {activity.comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header">
                <strong className="comment-author">
                  {comment.athlete?.firstname} {comment.athlete?.lastname}
                </strong>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

        {/* Music Widget - Only show if there's real music data */}
        {activity.music?.widget_html && (
          <div className="music-widget-container">
            <div 
              ref={musicWidgetRef}
              className={`deezer-widget ${activeWidget === musicWidgetRef.current ? 'active' : ''}`}
              key={widgetKey}
            >
              <div dangerouslySetInnerHTML={{ __html: activity.music.widget_html }} />
            </div>
            <button 
              className="deezer-refresh-btn" 
              onClick={refreshWidget}
            >
              If I stop working, press to refresh.
            </button>
          </div>
        )}


      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="photo-modal-overlay" onClick={closePhotoModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={closePhotoModal}>×</button>
            <img 
              src={
                selectedPhoto.urls?.['1200'] || 
                selectedPhoto.urls?.['600'] || 
                selectedPhoto.urls?.['300'] ||
                selectedPhoto.url || 
                selectedPhoto
              } 
              alt="Full size view"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Activity;
