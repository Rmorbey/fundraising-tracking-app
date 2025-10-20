import React, { useState, useEffect } from 'react';
import { fundraisingAPI, apiUtils } from './services/apiService';
import './FundraisingFooter.css';

const FundraisingFooter = () => {
  const [fundraisingData, setFundraisingData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Temporarily disabled auto-refresh due to CORS issues
    // const interval = setInterval(fetchData, 30000);
    // return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch both fundraising data and donations
      const [fundraisingResponse, donationsResponse] = await Promise.allSettled([
        fundraisingAPI.getData(),
        fundraisingAPI.getDonations()
      ]);

              if (fundraisingResponse.status === 'fulfilled') {
                setFundraisingData(fundraisingResponse.value);
              }

              if (donationsResponse.status === 'fulfilled') {
                setDonations(donationsResponse.value.donations || []);
              }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching fundraising data:', err);
      setError(apiUtils.formatError(err));
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) {
      return '£0';
    }
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = () => {
    if (!fundraisingData) return 0; // Default to 0 if no data
    return Math.min((fundraisingData.total_raised / fundraisingData.target_amount) * 100, 100);
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 100) return '#4CAF50';
    if (progress >= 75) return '#FF9800';
    return '#F25C05';
  };

  const formatDonationMessage = (donation) => {
    if (!donation.message || donation.message.trim() === '') return null;
    return donation.message.length > 30 
      ? `${donation.message.substring(0, 30)}...` 
      : donation.message;
  };

  const generateScrollingText = () => {
    if (!donations || donations.length === 0) {
      return 'No recent donations yet. Be the first to donate!';
    }

    // Take the first 6 donations and reverse so oldest appears first, newest appears last
    const displayDonations = donations.slice(0, 6).reverse();

    const donationTexts = displayDonations.map((donation, index) => {
      const amount = formatCurrency(donation.amount);
      const donor = donation.donor_name || 'Anonymous';
      const message = formatDonationMessage(donation);
      const isMostRecent = index === displayDonations.length - 1; // Last donation gets sparkle
      
      // Only show message if it exists
      const messageText = message ? `: "${message}"` : '';
      
      if (isMostRecent) {
        return `<span class="latest-donation sparkle">✨ ${amount} ${donor}${messageText} ✨</span>`;
      }
      return `${amount} ${donor}${messageText}`;
    });

    return donationTexts.join(' • ');
  };

  const data = fundraisingData; // Only use real API data

  if (loading) {
    return (
      <footer className="activities-footer">
        <div className="footer-loading">
          <span className="loading-dot">•</span> Loading fundraising data...
        </div>
      </footer>
    );
  }

  if (error || !data) {
    return (
      <footer className="activities-footer">
        <div className="footer-error">
          <span className="error-indicator">⚠️</span> 
          <div>
            <strong>CORS Error:</strong> API server needs to allow requests from localhost:3000
            <br />
            <small>Contact your server administrator to fix CORS configuration</small>
          </div>
        </div>
      </footer>
    );
  }

  const progress = calculateProgress();

  return (
    <footer className="activities-footer">
      {/* Scrolling Donations */}
      <div className="donations-scroll">
        <div 
          className="scrolling-text"
          dangerouslySetInnerHTML={{ __html: generateScrollingText() }}
        />
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
                <div className="progress-labels">
                  <span className="progress-label">£0</span>
                  <span className="progress-label">£{Math.floor(data.target_amount * 0.25)}</span>
                  <span className="progress-label">£{Math.floor(data.target_amount * 0.5)}</span>
                  <span className="progress-label">£{Math.floor(data.target_amount * 0.75)}</span>
                  <span className="progress-label">£{data.target_amount}</span>
                </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>
                <div className="progress-summary">
                  <span className="raised-amount">{formatCurrency(data.total_raised)} raised</span>
                  <span className="target-amount">of {formatCurrency(data.target_amount)} target</span>
                </div>
        <div className="progress-source">
          <a 
            href={data.justgiving_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="justgiving-link"
          >
            <span className="justgiving-logo">JustGiving</span>
            <span className="justgiving-text">GOSH Fundraising</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FundraisingFooter;
