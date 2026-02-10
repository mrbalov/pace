import { useState, useEffect } from 'react';
import { useActivities } from '../api/hooks';

/**
 * Hook to determine if user is authenticated.
 * Checks if activities can be fetched successfully.
 * @returns {{ isAuthenticated: boolean, loading: boolean }} Authentication status
 */
export function useAuth() {
  const { activities, loading, error } = useActivities();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      // Still checking
      return;
    }

    if (error) {
      // Check if it's an auth error
      const isAuthError =
        error.includes('Unauthorized') || error.includes('Authentication') || error.includes('401');
      setIsAuthenticated(!isAuthError && activities !== null);
    } else {
      // No error and activities loaded = authenticated
      setIsAuthenticated(activities !== null);
    }
  }, [activities, loading, error]);

  return {
    isAuthenticated: isAuthenticated ?? false,
    loading,
  };
}
