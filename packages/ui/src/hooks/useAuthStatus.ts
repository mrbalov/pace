import { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { APIError } from '../api/client';

export interface UseAuthStatusResult {
  isAuthenticated: boolean;
  loading: boolean;
}

/**
 * Hook to check authentication status without loading activities.
 * Uses the /strava/auth/status endpoint to check if user is authenticated.
 *
 * @returns {UseAuthStatusResult} Authentication status and loading state
 */
export const useAuthStatus = (): UseAuthStatusResult => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        await apiRequest<{ authenticated: boolean }>('/strava/auth/status');
        setIsAuthenticated(true);
      } catch (err) {
        if (err instanceof APIError && err.status === 401) {
          setIsAuthenticated(false);
        } else {
          // Network errors - assume not authenticated
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};
