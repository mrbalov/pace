'use client';

import { useEffect, useState } from 'react';

import fetchStravaActivityImageGenerationPrompt from './fetchStravaActivityImageGenerationPrompt';
import { Input } from './types';

/**
 * Fetches Strava activity image generation prompt.
 * @param {Input} input - Input parameters.
 * @param {string} [input.activityId] - Activity ID.
 * @param {StravaActivitySignals} [input.activitySignals] - Activity signals.
 * @returns {object} Object containing loading state and activity image generation prompt data.
 */
const useStravaActivityImageGenerationPrompt = ({
  activityId,
  activitySignals,
}: Partial<Input>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoaded && activityId && activitySignals) {
      setIsLoading(true);

      fetchStravaActivityImageGenerationPrompt({ activityId, activitySignals })
        .then((response) => {
          setData(response);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Error fetching Strava activity image generation prompt:', error);
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
          setIsLoaded(true);
        });
    }
  }, [activityId, activitySignals]);

  return {
    isLoading,
    isLoaded,
    data,
  };
};

export default useStravaActivityImageGenerationPrompt;
