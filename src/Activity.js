import React, { memo } from 'react';
import './Activity.css';
import ActivityMap from './components/ActivityMap';
import ActivityPhotos from './components/ActivityPhotos';
import ActivityMusic from './components/ActivityMusic';
import ActivityStats from './components/ActivityStats';
import ActivityComments from './components/ActivityComments';
import ErrorBoundary from './components/ErrorBoundary';



// Utility function for formatting descriptions
const formatDescription = (description) => {
  if (!description) return null;
  
  return description
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

const Activity = memo(function Activity({ activity, isRealData = false, apiKey }) {

  return (
    <ErrorBoundary>
      <div className="activity-item">
        <div className="activity-header-container">
          <h3 className="activity-title">{activity.title || activity.name}</h3>
          <span className="activity-date">{activity.date}</span>
        </div>

        {/* Description Section */}
        {(activity.description || activity.spotify?.description) && (
          <div className="description-container">
            <div 
              className="description-item"
              dangerouslySetInnerHTML={{ 
                __html: formatDescription(activity.description || activity.spotify?.description) 
              }}
            />
          </div>
        )}

        {/* Map Section */}
        <ActivityMap activity={activity} apiKey={apiKey} />

        {/* Activity Stats */}
        <ActivityStats activity={activity} />

        {/* Photos Section */}
        <ActivityPhotos photos={activity.photos} />

        {/* Comments Section */}
        <ActivityComments comments={activity.comments} />

        {/* Music Widget */}
        <ActivityMusic activity={activity} />
      </div>
    </ErrorBoundary>
  );
});

export default Activity;
