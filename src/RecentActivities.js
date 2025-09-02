import React from 'react';
import { Link } from 'react-router-dom';
import './RecentActivities.css';
import FundraisingFooter from './FundraisingFooter';

function RecentActivities() {
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
          </div>

          <div className="column-content">
            {/* Activity 1 */}
            <div className="activity-item">
              <div className="activity-header">
                <h3 className="activity-title">Morning Tempo Run</h3>
                <span className="activity-date">Today</span>
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
                    <span className="data-value">7.2 km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Time:</span>
                    <span className="data-value">35:18</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Pace:</span>
                    <span className="data-value">4:54/km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Type:</span>
                    <span className="data-value">Tempo Run</span>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="message-section">
                <h4 className="section-label">Activity Media</h4>
                <div className="media-content">
                  <div className="media-placeholder">
                    <span className="media-icon">📸</span>
                    <span className="media-text">Photo/Video</span>
                  </div>
                </div>
              </div>

              {/* Words of Encouragement */}
              <div className="encouragement-section">
                <h4 className="section-label">Words of encouragement</h4>
                <div className="encouragement-content">
                  <p>"Great pace today! Keep pushing!"</p>
                  <p>"You're getting stronger every run"</p>
                  <p>"Amazing progress this week!"</p>
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
                    <h5 className="album-title">"Midnight Runners"</h5>
                    <p className="artist-name">The Pace Setters</p>
                    <p className="album-description">Perfect for 5K-10K runs</p>
                  </div>
                  <div className="spotify-actions">
                    <button className="spotify-play-btn">▶️ Play</button>
                    <button className="spotify-save-btn">💚 Save</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="activity-item">
              <div className="activity-header">
                <h3 className="activity-title">Evening Recovery Run</h3>
                <span className="activity-date">Yesterday</span>
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
                    <span className="data-value">5.8 km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Time:</span>
                    <span className="data-value">32:45</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Pace:</span>
                    <span className="data-value">5:38/km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Type:</span>
                    <span className="data-value">Recovery Run</span>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="message-section">
                <h4 className="section-label">Activity Media</h4>
                <div className="media-content">
                  <div className="media-placeholder">
                    <span className="media-icon">🎥</span>
                    <span className="media-text">Video</span>
                  </div>
                </div>
              </div>

              {/* Words of Encouragement */}
              <div className="encouragement-section">
                <h4 className="section-label">Words of encouragement</h4>
                <div className="encouragement-content">
                  <p>"Recovery runs are just as important!"</p>
                  <p>"Listen to your body, great job!"</p>
                  <p>"Consistency is key!"</p>
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
                    <h5 className="album-title">"Chill Vibes"</h5>
                    <p className="artist-name">Relaxation Station</p>
                    <p className="album-description">Perfect for recovery runs</p>
                  </div>
                  <div className="spotify-actions">
                    <button className="spotify-play-btn">▶️ Play</button>
                    <button className="spotify-save-btn">💚 Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 - 10k+ Runs */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">10K+ Runs</h2>
          </div>

          <div className="column-content">
            {/* Activity 1 */}
            <div className="activity-item">
              <div className="activity-header">
                <h3 className="activity-title">Long Distance Training</h3>
                <span className="activity-date">Today</span>
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
                    <span className="data-value">15.8 km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Time:</span>
                    <span className="data-value">1:18:42</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Pace:</span>
                    <span className="data-value">4:59/km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Type:</span>
                    <span className="data-value">Long Run</span>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="message-section">
                <h4 className="section-label">Activity Media</h4>
                <div className="media-content">
                  <div className="media-placeholder">
                    <span className="media-icon">📸</span>
                    <span className="media-text">Photo</span>
                  </div>
                </div>
              </div>

              {/* Words of Encouragement */}
              <div className="encouragement-section">
                <h4 className="section-label">Words of encouragement</h4>
                <div className="encouragement-content">
                  <p>"Fantastic endurance today!"</p>
                  <p>"Your stamina is improving!"</p>
                  <p>"Keep up the great work!"</p>
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
                    <h5 className="album-title">"Endurance Beats"</h5>
                    <p className="artist-name">Stamina Collective</p>
                    <p className="album-description">High-energy long run mix</p>
                  </div>
                  <div className="spotify-actions">
                    <button className="spotify-play-btn">▶️ Play</button>
                    <button className="spotify-save-btn">💚 Save</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="activity-item">
              <div className="activity-header">
                <h3 className="activity-title">Half Marathon Prep</h3>
                <span className="activity-date">2 days ago</span>
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
                    <span className="data-value">18.5 km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Time:</span>
                    <span className="data-value">1:32:15</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Pace:</span>
                    <span className="data-value">4:59/km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Type:</span>
                    <span className="data-value">Race Pace</span>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="message-section">
                <h4 className="section-label">Activity Media</h4>
                <div className="media-content">
                  <div className="media-placeholder">
                    <span className="media-icon">🎥</span>
                    <span className="media-text">Video</span>
                  </div>
                </div>
              </div>

              {/* Words of Encouragement */}
              <div className="encouragement-section">
                <h4 className="section-label">Words of encouragement</h4>
                <div className="encouragement-content">
                  <p>"Half marathon ready!"</p>
                  <p>"Your pace is spot on!"</p>
                  <p>"You're going to crush it!"</p>
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
                    <h5 className="album-title">"Race Day Anthems"</h5>
                    <p className="artist-name">Motivation Masters</p>
                    <p className="album-description">Perfect for race preparation</p>
                  </div>
                  <div className="spotify-actions">
                    <button className="spotify-play-btn">▶️ Play</button>
                    <button className="spotify-save-btn">💚 Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 - Bike Rides */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">Bike Rides</h2>
          </div>

          <div className="column-content">
            {/* Activity 1 */}
            <div className="activity-item">
              <div className="activity-header">
                <h3 className="activity-title">Road Cycling Session</h3>
                <span className="activity-date">Today</span>
              </div>

              {/* Run Map Section */}
              <div className="run-map-section">
                <h4 className="section-label">Route map</h4>
                <div className="map-placeholder">
                  <div className="map-icon">🗺️</div>
                  <p>Interactive route map</p>
                </div>
              </div>

              {/* Run Data Section */}
              <div className="run-data-section">
                <h4 className="section-label">Ride data</h4>
                <div className="data-content">
                  <div className="data-item">
                    <span className="data-label">Distance:</span>
                    <span className="data-value">42.5 km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Time:</span>
                    <span className="data-value">1:45:30</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Avg Speed:</span>
                    <span className="data-value">24.2 km/h</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Type:</span>
                    <span className="data-value">Road Ride</span>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="message-section">
                <h4 className="section-label">Activity Media</h4>
                <div className="media-content">
                  <div className="media-placeholder">
                    <span className="media-icon">📸</span>
                    <span className="media-text">Photo</span>
                  </div>
                </div>
              </div>

              {/* Words of Encouragement */}
              <div className="encouragement-section">
                <h4 className="section-label">Words of encouragement</h4>
                <div className="encouragement-content">
                  <p>"Excellent speed work!"</p>
                  <p>"You're flying today!"</p>
                  <p>"Incredible performance!"</p>
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
                    <h5 className="album-title">"Speed Demon"</h5>
                    <p className="artist-name">Fast Lane</p>
                    <p className="album-description">Perfect for cycling tempo</p>
                  </div>
                  <div className="spotify-actions">
                    <button className="spotify-play-btn">▶️ Play</button>
                    <button className="spotify-save-btn">💚 Save</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="activity-item">
              <div className="activity-header">
                <h3 className="activity-title">Mountain Trail Ride</h3>
                <span className="activity-date">3 days ago</span>
              </div>

              {/* Run Map Section */}
              <div className="run-map-section">
                <h4 className="section-label">Route map</h4>
                <div className="map-placeholder">
                  <div className="map-icon">🗺️</div>
                  <p>Interactive route map</p>
                </div>
              </div>

              {/* Run Data Section */}
              <div className="run-data-section">
                <h4 className="section-label">Ride data</h4>
                <div className="data-content">
                  <div className="data-item">
                    <span className="data-label">Distance:</span>
                    <span className="data-value">28.3 km</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Time:</span>
                    <span className="data-value">2:15:45</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Avg Speed:</span>
                    <span className="data-value">12.5 km/h</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Type:</span>
                    <span className="data-value">Mountain Trail</span>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="message-section">
                <h4 className="section-label">Activity Media</h4>
                <div className="media-content">
                  <div className="media-placeholder">
                    <span className="media-icon">🎥</span>
                    <span className="media-text">Video</span>
                  </div>
                </div>
              </div>

              {/* Words of Encouragement */}
              <div className="encouragement-section">
                <h4 className="section-label">Words of encouragement</h4>
                <div className="encouragement-content">
                  <p>"Trail riding is the best!"</p>
                  <p>"Great technical skills!"</p>
                  <p>"Nature therapy at its finest!"</p>
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
                    <h5 className="album-title">"Nature Sounds"</h5>
                    <p className="artist-name">Trail Mix</p>
                    <p className="album-description">Perfect for mountain biking</p>
                  </div>
                  <div className="spotify-actions">
                    <button className="spotify-play-btn">▶️ Play</button>
                    <button className="spotify-save-btn">💚 Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FundraisingFooter />
    </div>
  );
}

export default RecentActivities;
