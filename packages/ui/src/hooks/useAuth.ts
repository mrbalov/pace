'use client';

import { useState, useEffect } from 'react';

import { useActivities } from '@/api/hooks';

interface Output {
  isAuthenticated: boolean;
  loading: boolean;
};

/**
 * Hook to determine if user is authenticated.
 * Checks if activities can be fetched successfully.
 * @returns {Output} Authentication status.
 */
export function useAuth(): Output {
  const { activities, loading, error } = useActivities();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (error) {
        const isAuthError = (
          error.includes('Unauthorized')
          || error.includes('Authentication')
          || error.includes('401')
        );

        setIsAuthenticated(!isAuthError && Boolean(activities));
      } else {
        setIsAuthenticated(Boolean(activities));
      }
    }
  }, [activities, loading, error]);

  return {
    isAuthenticated: isAuthenticated ?? false,
    loading,
  };
}
