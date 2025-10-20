import React, { useState, useEffect } from 'react';
import { fundraisingAPI, apiUtils } from '../services/apiService';
import './FundraisingData.css';

const FundraisingData = ({ showHeader = true, compact = false }) => {
  const [fundraisingData, setFundraisingData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    fetchFundraisingData();
    fetchDonations();
    checkApiHealth();
  }, []);

  const fetchFundraisingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fundraisingAPI.getData();
      setFundraisingData(data);
    } catch (err) {
      console.error('Error fetching fundraising data:', err);
      setError(apiUtils.formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const data = await fundraisingAPI.getDonations();
      setDonations(data.donations || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
      // Don't set error for donations as it's not critical
    }
  };

  const checkApiHealth = async () => {
    try {
      const health = await fundraisingAPI.healthCheck();
      setApiHealth(health);
    } catch (err) {
      console.error('Error checking fundraising API health:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = () => {
    if (!fundraisingData) return 0;
    return Math.min((fundraisingData.raised / fundraisingData.target) * 100, 100);
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 100) return '#4CAF50'; // Green
    if (progress >= 75) return '#FF9800'; // Orange
    if (progress >= 50) return '#F25C05'; // Brand orange
    return '#F44336'; // Red
  };

  const getLatestDonation = () => {
    if (!donations || donations.length === 0) return null;
    return donations[0]; // Assuming donations are sorted by date descending
  };

  const formatDonationMessage = (donation) => {
    if (!donation.message) return 'Thank you for your support!';
    return donation.message.length > 50 
      ? `${donation.message.substring(0, 50)}...` 
      : donation.message;
  };

  if (loading) {
    return (
      <div className={`fundraising-data ${compact ? 'compact' : ''}`}>
        {showHeader && (
          <div className="fundraising-header">
            <h2>Fundraising Progress</h2>
            <div className="api-status">
              <span className="status-indicator loading">🔄</span>
              <span>Loading...</span>
            </div>
          </div>
        )}
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching fundraising data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`fundraising-data ${compact ? 'compact' : ''}`}>
        {showHeader && (
          <div className="fundraising-header">
            <h2>Fundraising Progress</h2>
            <div className="api-status">
              <span className="status-indicator error">❌</span>
              <span>Connection Error</span>
            </div>
          </div>
        )}
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Fundraising Data</h3>
          <p>{error}</p>
          <button onClick={fetchFundraisingData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!fundraisingData) {
    return (
      <div className={`fundraising-data ${compact ? 'compact' : ''}`}>
        <div className="no-data">
          <div className="no-data-icon">💰</div>
          <h3>No Fundraising Data</h3>
          <p>Fundraising data will appear here once available.</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const latestDonation = getLatestDonation();

  return (
    <div className={`fundraising-data ${compact ? 'compact' : ''}`}>
      {showHeader && (
        <div className="fundraising-header">
          <h2>Fundraising Progress</h2>
          <div className="api-status">
            <span className="status-indicator success">✅</span>
            <span>Live Data</span>
            {apiHealth && (
              <span className="api-version">v{apiHealth.version}</span>
            )}
          </div>
        </div>
      )}

      <div className="fundraising-content">
        {/* Progress Summary */}
        <div className="progress-summary">
          <div className="raised-amount">
            {formatCurrency(fundraisingData.raised)}
          </div>
          <div className="target-amount">
            of {formatCurrency(fundraisingData.target)} target
          </div>
          <div className="progress-percentage">
            {progress.toFixed(1)}% complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${progress}%`,
                backgroundColor: getProgressColor()
              }}
            ></div>
          </div>
          <div className="progress-labels">
            <span className="progress-label">£0</span>
            <span className="progress-label">£{Math.floor(fundraisingData.target * 0.25)}</span>
            <span className="progress-label">£{Math.floor(fundraisingData.target * 0.5)}</span>
            <span className="progress-label">£{Math.floor(fundraisingData.target * 0.75)}</span>
            <span className="progress-label">£{fundraisingData.target}</span>
          </div>
        </div>

        {/* Latest Donation */}
        {latestDonation && !compact && (
          <div className="latest-donation">
            <div className="donation-header">
              <span className="donation-amount">{formatCurrency(latestDonation.amount)}</span>
              <span className="donation-donor">{latestDonation.donor_name || 'Anonymous'}</span>
            </div>
            <div className="donation-message">
              "{formatDonationMessage(latestDonation)}"
            </div>
            <div className="donation-date">
              {new Date(latestDonation.date).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Donation Count */}
        <div className="donation-stats">
          <div className="stat">
            <span className="stat-value">{donations.length}</span>
            <span className="stat-label">Donations</span>
          </div>
          <div className="stat">
            <span className="stat-value">{formatCurrency(fundraisingData.average_donation || 0)}</span>
            <span className="stat-label">Average</span>
          </div>
          <div className="stat">
            <span className="stat-value">{fundraisingData.days_remaining || 0}</span>
            <span className="stat-label">Days Left</span>
          </div>
        </div>

        {/* JustGiving Link */}
        {fundraisingData.justgiving_url && (
          <div className="justgiving-section">
            <a 
              href={fundraisingData.justgiving_url}
              target="_blank"
              rel="noopener noreferrer"
              className="justgiving-link"
            >
              <span className="justgiving-logo">JustGiving</span>
              <span className="justgiving-text">Support My Fundraising</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundraisingData;

