import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecentActivities.css';
import FundraisingFooter from './FundraisingFooter';
import Activity from './Activity';
import { stravaAPI } from './services/apiService';

function RecentActivities() {
  const [stravaActivities, setStravaActivities] = useState([]);

  useEffect(() => {
    fetchStravaActivities();
  }, []);

  const fetchStravaActivities = async () => {
    try {
      const data = await stravaAPI.getFeed(100);
      setStravaActivities(data.activities || []);
    } catch (err) {
      console.error('Error fetching Strava activities:', err);
    }
  };

  const categorizeActivities = (activities) => {
    const runs5k10k = [];
    const runs10kPlus = [];
    const bikeRides = [];

    activities.forEach(activity => {
      // Use the same distance field as the conversion function
      const distance = activity.distance_km || (activity.distance / 1000); // Use distance_km if available, otherwise convert from meters
      
      if (activity.type === 'Run') {
        if (distance >= 5 && distance < 10) {
          runs5k10k.push(activity);
        } else if (distance >= 10) {
          runs10kPlus.push(activity);
        }
      } else if (activity.type === 'Ride' || activity.type === 'VirtualRide') {
        bikeRides.push(activity);
      }
    });
    
    return { runs5k10k, runs10kPlus, bikeRides };
  };

  const convertStravaToActivity = (stravaActivity) => {
    // Use the correct field names from the API response
    const distance = stravaActivity.distance_km ? stravaActivity.distance_km.toFixed(1) : '0.0';
    const time = stravaActivity.time || formatDuration(stravaActivity.duration_minutes * 60);
    const pace = formatPace(stravaActivity);
    
    return {
      // Original Strava data for maps, photos, comments, etc.
      ...stravaActivity,
      // Formatted data for display
      title: stravaActivity.name || 'Untitled Activity',
      date: stravaActivity.date || 'Unknown Date',
      distance: `${distance} km`,
      time: time,
      pace: pace,
      type: getActivityType(stravaActivity.type),
      mediaType: stravaActivity.photos && Object.keys(stravaActivity.photos).length > 0 ? "photo" : "video",
      mediaIcon: stravaActivity.photos && Object.keys(stravaActivity.photos).length > 0 ? "📸" : "🎥",
      mediaText: stravaActivity.photos && Object.keys(stravaActivity.photos).length > 0 ? "Photo" : "Video",
      encouragement: generateEncouragement(stravaActivity),
      spotify: generateSpotifyData(stravaActivity)
    };
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (activity) => {
    if (activity.type === 'Ride' || activity.type === 'VirtualRide') {
      const avgSpeed = activity.distance_km / (activity.duration_minutes / 60);
      return `${avgSpeed.toFixed(1)} km/h avg speed`;
    }
    
    const paceSeconds = (activity.duration_minutes * 60) / activity.distance_km;
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = Math.floor(paceSeconds % 60);
    return `${paceMinutes}:${paceSecs.toString().padStart(2, '0')}/km`;
  };

  const getActivityType = (type) => {
    switch (type) {
      case 'Run': return 'Run';
      case 'Ride': return 'Road Ride';
      case 'VirtualRide': return 'Virtual Ride';
      default: return type;
    }
  };

  const generateEncouragement = (activity) => {
    // Only show encouragement if there are real comments
    if (activity.comments && activity.comments.length > 0) {
      return activity.comments.slice(0, 3).map(comment => comment.text);
    }
    return [];
  };

  const generateSpotifyData = (activity) => {
    // Only return Spotify data if there's no real music data
    if (!activity.music || !activity.music.widget_html) {
      return null;
    }
    return null; // We have real music data, no need for Spotify fallback
  };

  const { runs5k10k, runs10kPlus, bikeRides } = categorizeActivities(stravaActivities);

  return (
    <div className="recent-activities-page">
      {/* Navigation Header */}
      <nav className="activities-nav">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <h1 className="nav-title">Recent Activities</h1>
      </nav>

      {/* Main Content - Three Columns */}
      <main className="activities-main">
        {/* Column 1 - 5k to 10k Runs */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">5K - 10K Runs</h2>
            <span className="activity-count">({runs5k10k.length})</span>
          </div>

          <div className="column-content">
            {runs5k10k.map((activity, index) => (
              <Activity 
                key={index}
                activity={convertStravaToActivity(activity)}
              />
            ))}
            {runs5k10k.length === 0 && (
              <div className="no-activities">
                <p>No 5K-10K runs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2 - 10k+ Runs */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">10K+ Runs</h2>
            <span className="activity-count">({runs10kPlus.length})</span>
          </div>

          <div className="column-content">
            {runs10kPlus.map((activity, index) => (
              <Activity 
                key={index}
                activity={convertStravaToActivity(activity)}
              />
            ))}
            {runs10kPlus.length === 0 && (
              <div className="no-activities">
                <p>No 10K+ runs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3 - Bike Rides */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">Bike Rides</h2>
            <span className="activity-count">({bikeRides.length})</span>
          </div>

          <div className="column-content">
            {bikeRides.map((activity, index) => (
              <Activity 
                key={index}
                activity={convertStravaToActivity(activity)}
              />
            ))}
            {bikeRides.length === 0 && (
              <div className="no-activities">
                <p>No bike rides found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <FundraisingFooter />
    </div>
  );
}

export default RecentActivities;
