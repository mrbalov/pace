'use client';

import { useState, useEffect } from 'react';

import generateStravaActivityImage from './generateStravaActivityImage';
import { Input, ResponseImage } from './types';

/**
 * Generates a Strava activity image.
 * @param {string} [activityId] - The ID of the activity to generate an image for.
 * @returns {object} An object containing the loading state, loaded state, and the generated image data.
 */
const useGenerateStravaActivityImage = ({
  activityId,
  prompt,
}: Partial<Input>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [data, setData] = useState<ResponseImage | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoaded && activityId && prompt) {
      setIsLoading(true);

      generateStravaActivityImage({ activityId, prompt })
        .then((response) => {
          setData(response);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Error generating Strava activity image:', error);
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
          setIsLoaded(true);
        });
    }
  }, [activityId, prompt]);

  return {
    isLoading,
    isLoaded,
    data,
  };
};

export default useGenerateStravaActivityImage;
