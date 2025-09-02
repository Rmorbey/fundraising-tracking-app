import React from 'react';
import './FundraisingFooter.css';

const FundraisingFooter = () => {
  return (
    <footer className="activities-footer">
      {/* Scrolling Donations */}
      <div className="donations-scroll">
        <div className="scrolling-text">
          £30 Russell: "Good luck with the run!" • £5 Mum: "Well done!" • £35 None: "Keep it up!" • £20 Sarah: "Amazing effort!" • £15 Tom: "You've got this!" • <span className="latest-donation">£25 Emma: "Inspiring work!"</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-labels">
          <span className="progress-label">£0</span>
          <span className="progress-label">£100</span>
          <span className="progress-label">£200</span>
          <span className="progress-label">£300</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '5%' }}></div>
        </div>
        <div className="progress-summary">
          <span className="raised-amount">£15 raised</span>
          <span className="target-amount">of £300 target</span>
        </div>
        <div className="progress-source">
          <a href="https://www.justgiving.com/fundraising/RussellMorbey-HackneyHalf?utm_medium=FR&utm_source=CL&utm_campaign=015" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="justgiving-link">
            <span className="justgiving-logo">JustGiving</span>
            <span className="justgiving-text">GOSH Fundraising</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FundraisingFooter;
