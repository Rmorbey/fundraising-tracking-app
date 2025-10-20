import React, { useState, useCallback, memo } from 'react';

// Deezer Widget Refresh and Error Handling
const useDeezerWidgetRefresh = (activity) => {
  const [widgetKey, setWidgetKey] = useState(0);

  const refreshWidget = useCallback(() => {
    console.log('Refreshing Deezer widget for activity:', activity.name);
    setWidgetKey(prev => prev + 1);
  }, [activity.name]);

  // Debug widget state for specific activities
  React.useEffect(() => {
    if (activity.name === 'Morning Run' && activity.date === '2025-09-27') {
      console.log('DEBUG - Deezer widget hook for Morning Run');
      console.log('DEBUG - Music data:', activity.music);
      console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
    }
    if (activity.name === '5K - 10K Runs') {
      console.log('DEBUG - Deezer widget hook for 5K - 10K Runs');
      console.log('DEBUG - Music data:', activity.music);
      console.log('DEBUG - Widget HTML exists:', !!activity.music?.widget_html);
    }
  }, [activity]);

  return { widgetKey, refreshWidget };
};

const ActivityMusic = memo(function ActivityMusic({ activity }) {
  const musicWidgetRef = React.useRef(null);
  const { widgetKey, refreshWidget } = useDeezerWidgetRefresh(activity);

  if (!activity.music?.widget_html) {
    return null;
  }

  return (
    <div className="music-widget-container">
      <div 
        ref={musicWidgetRef}
        className="deezer-widget"
        key={widgetKey}
      >
        <div dangerouslySetInnerHTML={{ __html: activity.music.widget_html }} />
      </div>
      <button 
        className="deezer-refresh-btn" 
        onClick={refreshWidget}
      >
        If I stop working, press to refresh.
      </button>
    </div>
  );
});

export default ActivityMusic;
