import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import FundraisingFooter from './FundraisingFooter';

function LandingPage() {
  return (
    <>
      {/* Header Section */}
      <header className="header">
        <h1 className="main-title">Fundraising Tracking App</h1>
        <p className="description">
          The aim of this app is to allow people who have donated or are thinking of donating to see the training progress as well as the current fundraising total all in one place.
        </p>
      </header>

      {/* Main Content Section */}
      <main className="main-content">
        {/* Recent Activities Section */}
        <section className="activities-section">
          <h2 className="section-title">Recent Activities</h2>
          <div className="total-distance">
            <span className="distance-label">Total Distance:</span>
            <span className="distance-value">76.8 km</span>
            <span className="distance-breakdown">(Running: 34.3 km • Cycling: 42.5 km)</span>
          </div>
          <div className="section-content">
            <div className="activity-item">
              <div className="activity-icon">🏃‍♂️</div>
              <div className="activity-text">
                <p>Long Distance Training - 15.8 km</p>
                <span className="activity-time">Today</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🏃‍♂️</div>
              <div className="activity-text">
                <p>Half Marathon Prep - 18.5 km</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🚴‍♂️</div>
              <div className="activity-text">
                <p>Road Cycling Session - 42.5 km</p>
                <span className="activity-time">Today</span>
              </div>
            </div>
            <div className="view-more">
              <Link to="/recent-activities" className="view-more-button">
                View All Activities →
              </Link>
            </div>
          </div>
        </section>


      </main>

      {/* Footer Section */}
      <FundraisingFooter />
    </>
  );
}

export default LandingPage;
