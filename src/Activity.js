import React from 'react';
import './Activity.css';

function Activity({ activity }) {
  return (
    <div className="activity-item">
      <div className="activity-header">
        <h3 className="activity-title">{activity.title}</h3>
        <span className="activity-date">{activity.date}</span>
      </div>

      {/* Run Map Section */}
      <div className="run-map-section">
        <h4 className="section-label">Run map</h4>
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Interactive route map</p>
        </div>
      </div>

      {/* Run Data Section */}
      <div className="run-data-section">
        <h4 className="section-label">Run data</h4>
        <div className="data-content">
          <div className="data-item">
            <span className="data-label">Distance:</span>
            <span className="data-value">{activity.distance}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Time:</span>
            <span className="data-value">{activity.time}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Pace:</span>
            <span className="data-value">{activity.pace}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Type:</span>
            <span className="data-value">{activity.type}</span>
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="message-section">
        <h4 className="section-label">Activity Media</h4>
        <div className="media-content">
          <div className="media-placeholder">
            <span className="media-icon">{activity.mediaIcon}</span>
            <span className="media-text">{activity.mediaText}</span>
          </div>
        </div>
      </div>

      {/* Words of Encouragement */}
      <div className="encouragement-section">
        <h4 className="section-label">Words of encouragement</h4>
        <div className="encouragement-content">
          {activity.encouragement.map((message, index) => (
            <p key={index}>"{message}"</p>
          ))}
        </div>
      </div>

      {/* Spotify Album Section */}
      <div className="spotify-section">
        <h4 className="section-label">🎵 Training Vibes</h4>
        <div className="spotify-content">
          <div className="album-cover">
            <div className="album-placeholder">💿</div>
          </div>
          <div className="album-info">
            <h5 className="album-title">"{activity.spotify.albumTitle}"</h5>
            <p className="artist-name">{activity.spotify.artist}</p>
            <p className="album-description">{activity.spotify.description}</p>
          </div>
          <div className="spotify-actions">
            <button className="spotify-play-btn">▶️ Play</button>
            <button className="spotify-save-btn">💚 Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity;
