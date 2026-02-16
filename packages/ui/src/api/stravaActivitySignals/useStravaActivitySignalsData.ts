import { useEffect, useState } from 'react';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';
import fetchStravaActivitySignals from './fetchStravaActivitySignals';

/**
 * Fetches Strava activity signals.
 * @param {string} [activityId] - Strava activity ID to fetch signals for.
 * @returns {object} Object containing loading state and activity signals data.
 */
const useStravaActivitySignalsData = (activityId?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [data, setData] = useState<StravaActivitySignals | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoaded && activityId) {
      setIsLoading(true);

      fetchStravaActivitySignals(activityId)
        .then((response) => {
          setData(response);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Error fetching Strava activity signals:', error);
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
          setIsLoaded(true);
        });
    }
  }, [activityId]);

  return {
    isLoading,
    isLoaded,
    data,
  };
};

export default useStravaActivitySignalsData;
