import { useState, useEffect } from 'react';
import { fetchActivities, type Activity } from './strava';
import { APIError } from './client';

export interface UseActivitiesResult {
  activities: Activity[] | null;
  loading: boolean;
  error: string | null;
  isUnauthorized: boolean;
  refetch: () => void;
}

/**
 * Hook to fetch and manage Strava activities.
 */
export function useActivities(): UseActivitiesResult {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadActivities = async () => {
      setLoading(true);
      setError(null);
      setIsUnauthorized(false);
      
      try {
        const data = await fetchActivities();
        if (mounted) {
          setActivities(data);
          setIsUnauthorized(false);
        }
      } catch (err) {
        if (mounted) {
          // Check if it's an APIError with 401 status
          if (err instanceof APIError && err.status === 401) {
            // 401 Unauthorized - treat as not logged in
            setError(null);
            setIsUnauthorized(true);
            setActivities(null);
          } else {
            // Other errors - set error message for display
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
            setError(errorMessage);
            setIsUnauthorized(false);
            setActivities(null);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      mounted = false;
    };
  }, [refetchCount]);

  const refetch = () => setRefetchCount((c) => c + 1);

  return { activities, loading, error, isUnauthorized, refetch };
}
