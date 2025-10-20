import React, { memo } from 'react';

const ActivityStats = memo(function ActivityStats({ activity }) {
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

  return (
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
  );
});

export default ActivityStats;
