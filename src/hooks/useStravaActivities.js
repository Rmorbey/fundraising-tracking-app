import { useState, useEffect, useCallback } from 'react';
import { stravaAPI } from '../services/apiService';

export const useStravaActivities = (limit = null) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stravaAPI.getFeed(limit);
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Error fetching Strava activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
};
