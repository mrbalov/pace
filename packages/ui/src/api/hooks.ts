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
 * @returns {UseActivitiesResult} Object containing activities, loading state, error, and refetch function
 */
export function useActivities(): UseActivitiesResult {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    const mountedRef = { current: true };

    /**
     * Loads activities from the API.
     * @returns {Promise<void>} Promise that resolves when loading is complete
     */
    const loadActivities = async () => {
      setLoading(true);
      setError(null);
      setIsUnauthorized(false);
      const startTime = Date.now();
      const MIN_LOADING_TIME = 400; // Minimum 400ms for smooth transition
      
      try {
        const data = await fetchActivities();
        if (mountedRef.current) {
          setActivities(data);
          setIsUnauthorized(false);
        }
      } catch (err) {
        if (mountedRef.current) {
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
        if (mountedRef.current) {
          // Ensure minimum loading time for smooth transition
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
          setTimeout(() => {
            setLoading(false);
          }, remaining);
        }
      }
    };

    void loadActivities();

    return () => {
      mountedRef.current = false;
    };
  }, [refetchCount]);

  /**
   * Triggers a refetch of activities.
   * @returns {void}
   */
  const refetch = () => setRefetchCount((c) => c + 1);

  return { activities, loading, error, isUnauthorized, refetch };
}
