'use client';

import {
  useGenerateStravaActivityImage,
  useStravaActivityImageGenerationPrompt,
  useStravaActivitySignals,
} from '@/api';

/**
 * Generates Strava activity image.
 * @param {string} activityId - Strava activity ID.
 * @returns {object} Image generation state and data.
 */
const useGenerateImage = (activityId?: string) => {
  const signalsData = useStravaActivitySignals(activityId);
  const promptData = useStravaActivityImageGenerationPrompt({
    activitySignals: signalsData.data ?? undefined,
    activityId: activityId ?? undefined,
  });
  const imageData = useGenerateStravaActivityImage({
    activityId: activityId ?? undefined,
    prompt: promptData.data ?? undefined,
  });

  return {
    isLoading: signalsData.isLoading || promptData.isLoading || imageData.isLoading,
    isLoaded: signalsData.isLoaded && promptData.isLoaded && imageData.isLoaded,
    signals: signalsData.data,
    prompt: promptData.data,
    image: imageData.data?.imageData,
    isSignalsLoading: signalsData.isLoading,
    isPromptLoading: promptData.isLoading,
    isImageLoading: imageData.isLoading,
    isSignalsLoaded: signalsData.isLoaded,
    isPromptLoaded: promptData.isLoaded,
    isImageLoaded: imageData.isLoaded,
  };
};

export default useGenerateImage;
