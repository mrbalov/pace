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
    /**
     * Checks authentication status with the API.
     * @returns {Promise<void>}
     */
    const checkAuth = async () => {
      setLoading(true);
      const startTime = Date.now();
      const MIN_LOADING_TIME = 400; // Minimum 400ms for smooth transition
      
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
        // Ensure minimum loading time for smooth transition
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
        setTimeout(() => {
          setLoading(false);
        }, remaining);
      }
    };

    void checkAuth();
  }, []);

  return { isAuthenticated, loading };
};
