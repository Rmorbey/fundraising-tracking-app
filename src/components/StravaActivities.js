import React, { useState, useEffect } from 'react';
import { stravaAPI, apiUtils } from '../services/apiService';
import './StravaActivities.css';

const StravaActivities = ({ limit = 20, showHeader = true }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    fetchActivities();
    checkApiHealth();
  }, [limit]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await stravaAPI.getFeed(limit);
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Error fetching Strava activities:', err);
      setError(apiUtils.formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const checkApiHealth = async () => {
    try {
      const health = await stravaAPI.healthCheck();
      setApiHealth(health);
    } catch (err) {
      console.error('Error checking API health:', err);
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
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
      const avgSpeed = activity.distance / (activity.moving_time / 3600);
      return `${avgSpeed.toFixed(1)} km/h`;
    }
    
    const paceSeconds = activity.moving_time / (activity.distance / 1000);
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = Math.floor(paceSeconds % 60);
    return `${paceMinutes}:${paceSecs.toString().padStart(2, '0')}/km`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Run':
        return '🏃‍♂️';
      case 'Ride':
      case 'VirtualRide':
        return '🚴‍♂️';
      case 'Walk':
        return '🚶‍♂️';
      case 'Swim':
        return '🏊‍♂️';
      case 'Workout':
        return '💪';
      default:
        return '🏃‍♂️';
    }
  };

  const getActivityType = (type) => {
    switch (type) {
      case 'Run':
        return 'Run';
      case 'Ride':
        return 'Road Ride';
      case 'VirtualRide':
        return 'Virtual Ride';
      case 'Walk':
        return 'Walk';
      case 'Swim':
        return 'Swim';
      case 'Workout':
        return 'Workout';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="strava-activities">
        {showHeader && (
          <div className="activities-header">
            <h2>Recent Activities</h2>
            <div className="api-status">
              <span className="status-indicator loading">🔄</span>
              <span>Loading activities...</span>
            </div>
          </div>
        )}
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching your latest activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="strava-activities">
        {showHeader && (
          <div className="activities-header">
            <h2>Recent Activities</h2>
            <div className="api-status">
              <span className="status-indicator error">❌</span>
              <span>Connection Error</span>
            </div>
          </div>
        )}
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Activities</h3>
          <p>{error}</p>
          <button onClick={fetchActivities} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="strava-activities">
      {showHeader && (
        <div className="activities-header">
          <h2>Recent Activities ({activities.length})</h2>
          <div className="api-status">
            <span className="status-indicator success">✅</span>
            <span>Live Data</span>
            {apiHealth && (
              <span className="api-version">v{apiHealth.version}</span>
            )}
          </div>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="no-activities">
          <div className="no-activities-icon">🏃‍♂️</div>
          <h3>No Activities Found</h3>
          <p>Start your first activity to see it here!</p>
        </div>
      ) : (
        <div className="activities-grid">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-info">
                  <h3 className="activity-name">{activity.name}</h3>
                  <span className="activity-type">{getActivityType(activity.type)}</span>
                </div>
                <div className="activity-date">
                  {new Date(activity.start_date).toLocaleDateString()}
                </div>
              </div>

              <div className="activity-stats">
                <div className="stat">
                  <span className="stat-value">{formatDistance(activity.distance)}</span>
                  <span className="stat-label">Distance</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatDuration(activity.moving_time)}</span>
                  <span className="stat-label">Time</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatPace(activity)}</span>
                  <span className="stat-label">Pace</span>
                </div>
              </div>

              {activity.elevation_gain > 0 && (
                <div className="activity-elevation">
                  <span className="elevation-label">Elevation Gain:</span>
                  <span className="elevation-value">{activity.elevation_gain}m</span>
                </div>
              )}

              {activity.description && (
                <div className="activity-description">
                  <p>{activity.description}</p>
                </div>
              )}

              {activity.photos && activity.photos.length > 0 && (
                <div className="activity-photos">
                  <span className="photos-label">📸 {activity.photos.length} photo(s)</span>
                </div>
              )}

              {activity.map && (
                <div className="activity-map">
                  <span className="map-label">🗺️ Route Map Available</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StravaActivities;

