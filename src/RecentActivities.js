import React from 'react';
import { Link } from 'react-router-dom';
import './RecentActivities.css';
import FundraisingFooter from './FundraisingFooter';
import Activity from './Activity';

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
            <Activity 
              activity={{
                title: "Morning Tempo Run",
                date: "Today",
                distance: "7.2 km",
                time: "35:18",
                pace: "4:54/km",
                type: "Tempo Run",
                mediaType: "photo",
                mediaIcon: "📸",
                mediaText: "Photo/Video",
                encouragement: [
                  "Great pace today! Keep pushing!",
                  "You're getting stronger every run",
                  "Amazing progress this week!"
                ],
                spotify: {
                  albumTitle: "Midnight Runners",
                  artist: "The Pace Setters",
                  description: "Perfect for 5K-10K runs"
                }
              }}
            />

            <Activity 
              activity={{
                title: "Evening Recovery Run",
                date: "Yesterday",
                distance: "5.8 km",
                time: "32:45",
                pace: "5:38/km",
                type: "Recovery Run",
                mediaType: "video",
                mediaIcon: "🎥",
                mediaText: "Video",
                encouragement: [
                  "Recovery runs are just as important!",
                  "Listen to your body, great job!",
                  "Consistency is key!"
                ],
                spotify: {
                  albumTitle: "Chill Vibes",
                  artist: "Relaxation Station",
                  description: "Perfect for recovery runs"
                }
              }}
            />
          </div>
        </div>

        {/* Column 2 - 10k+ Runs */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">10K+ Runs</h2>
          </div>

          <div className="column-content">
            <Activity 
              activity={{
                title: "Long Distance Training",
                date: "Today",
                distance: "15.8 km",
                time: "1:18:42",
                pace: "4:59/km",
                type: "Long Run",
                mediaType: "photo",
                mediaIcon: "📸",
                mediaText: "Photo",
                encouragement: [
                  "Fantastic endurance today!",
                  "Your stamina is improving!",
                  "Keep up the great work!"
                ],
                spotify: {
                  albumTitle: "Endurance Beats",
                  artist: "Stamina Collective",
                  description: "High-energy long run mix"
                }
              }}
            />

            <Activity 
              activity={{
                title: "Half Marathon Prep",
                date: "2 days ago",
                distance: "18.5 km",
                time: "1:32:15",
                pace: "4:59/km",
                type: "Race Pace",
                mediaType: "video",
                mediaIcon: "🎥",
                mediaText: "Video",
                encouragement: [
                  "Half marathon ready!",
                  "Your pace is spot on!",
                  "You're going to crush it!"
                ],
                spotify: {
                  albumTitle: "Race Day Anthems",
                  artist: "Motivation Masters",
                  description: "Perfect for race preparation"
                }
              }}
            />
          </div>
        </div>

        {/* Column 3 - Bike Rides */}
        <div className="activity-column">
          <div className="column-header">
            <h2 className="column-title">Bike Rides</h2>
          </div>

          <div className="column-content">
            <Activity 
              activity={{
                title: "Road Cycling Session",
                date: "Today",
                distance: "42.5 km",
                time: "1:45:30",
                pace: "24.2 km/h avg speed",
                type: "Road Ride",
                mediaType: "photo",
                mediaIcon: "📸",
                mediaText: "Photo",
                encouragement: [
                  "Excellent speed work!",
                  "You're flying today!",
                  "Incredible performance!"
                ],
                spotify: {
                  albumTitle: "Speed Demon",
                  artist: "Fast Lane",
                  description: "Perfect for cycling tempo"
                }
              }}
            />

            <Activity 
              activity={{
                title: "Mountain Trail Ride",
                date: "3 days ago",
                distance: "28.3 km",
                time: "2:15:45",
                pace: "12.5 km/h avg speed",
                type: "Mountain Trail",
                mediaType: "video",
                mediaIcon: "🎥",
                mediaText: "Video",
                encouragement: [
                  "Trail riding is the best!",
                  "Great technical skills!",
                  "Nature therapy at its finest!"
                ],
                spotify: {
                  albumTitle: "Nature Sounds",
                  artist: "Trail Mix",
                  description: "Perfect for mountain biking"
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <FundraisingFooter />
    </div>
  );
}

export default RecentActivities;
