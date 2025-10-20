import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import FundraisingFooter from './FundraisingFooter';
import { stravaAPI } from './services/apiService';

function LandingPage() {
  const [stravaActivities, setStravaActivities] = useState([]);
  const [totalDistance, setTotalDistance] = useState({ running: 0, cycling: 0, total: 0 });

  const calculateTotalDistance = (activities) => {
    let runningTotal = 0;
    let cyclingTotal = 0;
    let runCount = 0;
    let rideCount = 0;

    // console.log('=== DISTANCE CALCULATION DEBUG ===');
    // console.log('Total activities to process:', activities.length);

    activities.forEach((activity, index) => {
      if (activity.type === 'Run' && activity.distance_km) {
        runningTotal += activity.distance_km;
        runCount++;
        // console.log(`Run ${runCount}: ${activity.name} - ${activity.distance_km}km (${activity.date})`);
      } else if (activity.type === 'Ride' && activity.distance_km) {
        cyclingTotal += activity.distance_km;
        rideCount++;
        // console.log(`Ride ${rideCount}: ${activity.name} - ${activity.distance_km}km (${activity.date})`);
      }
    });

    // console.log('Running total:', runningTotal, 'km from', runCount, 'runs');
    // console.log('Cycling total:', cyclingTotal, 'km from', rideCount, 'rides');
    // console.log('Grand total:', runningTotal + cyclingTotal, 'km');
    // console.log('=== END DISTANCE CALCULATION DEBUG ===');

    setTotalDistance({
      running: runningTotal,
      cycling: cyclingTotal,
      total: runningTotal + cyclingTotal
    });
  };

  const fetchStravaActivities = useCallback(async () => {
    try {
      // Fetch all activities to get accurate totals
      const data = await stravaAPI.getFeed();
      setStravaActivities(data.activities || []);
      calculateTotalDistance(data.activities || []);
    } catch (err) {
      console.error('Error fetching Strava activities:', err);
    }
  }, []);

  useEffect(() => {
    fetchStravaActivities();
  }, [fetchStravaActivities]);

  const formatDistance = (distance) => {
    return distance.toFixed(1);
  };

  const formatActivityTitle = (activity) => {
    const distance = activity.distance_km ? activity.distance_km.toFixed(1) : '0.0';
    return `${activity.name} - ${distance} km`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Run': return '🏃‍♂️';
      case 'Ride':
      case 'VirtualRide': return '🚴‍♂️';
      default: return '🏃‍♂️';
    }
  };

  const getActivityTime = (activity) => {
    const now = new Date();
    // Try different date fields that might exist
    const dateString = activity.start_time || activity.date || activity.start_date;
    
    // console.log('=== DATE PARSING DEBUG ===');
    // console.log('Activity:', activity.name);
    // console.log('Available date fields:', {
    //   start_time: activity.start_time,
    //   date: activity.date,
    //   start_date: activity.start_date
    // });
    // console.log('Selected dateString:', dateString);
    
    if (!dateString) {
      // console.warn('No date found for activity:', activity);
      return 'Unknown date';
    }
    
    // Try to parse the date string
    let activityDate;
    
    // Handle different date formats
    if (dateString.includes('th of') || dateString.includes('st of') || dateString.includes('nd of') || dateString.includes('rd of')) {
      // Format like "27th of September 2025 at 09:05"
      const parts = dateString.split(' at ');
      const datePart = parts[0];
      const timePart = parts[1] || '00:00';
      
      // Convert "27th of September 2025" to "27 September 2025"
      const cleanDate = datePart.replace(/(\d+)(st|nd|rd|th) of /, '$1 ');
      activityDate = new Date(`${cleanDate} ${timePart}`);
    } else {
      // Try standard date parsing
      activityDate = new Date(dateString);
    }
    
    // console.log('Parsed activityDate:', activityDate);
    // console.log('Is valid date:', !isNaN(activityDate.getTime()));
    // console.log('=== END DATE PARSING DEBUG ===');
    
    if (isNaN(activityDate.getTime())) {
      // console.warn('Invalid date for activity:', activity, 'dateString:', dateString);
      return 'Invalid date';
    }
    
    const diffTime = Math.abs(now - activityDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays - 1} days ago`;
  };

  // Get the 3 most recent activities for display
  const recentActivities = stravaActivities.slice(0, 3);

  return (
    <>
      {/* Header Section */}
      <header className="header">
        <h1 className="main-title">Ready & Raising</h1>
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
            <span className="distance-value">{formatDistance(totalDistance.total)} km</span>
            <span className="distance-breakdown">(Running: {formatDistance(totalDistance.running)} km • Cycling: {formatDistance(totalDistance.cycling)} km)</span>
          </div>
          <div className="section-content">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-text">
                  <p>{formatActivityTitle(activity)}</p>
                  <span className="activity-time">{getActivityTime(activity)}</span>
                </div>
              </div>
            ))}
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
