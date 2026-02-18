import { apiRequest } from '../client';
import { Input, Response, ResponseImage } from './types';

/**
 * Generates a Strava activity image.
 * @param {Input} input - The input parameters for generating the image.
 * @param {string} input.activityId - The ID of the activity to generate an image for.
 * @param {string} input.prompt - The prompt to use for image generation.
 * @returns {Promise<ResponseImage | null>} The generated image data or null if not available.
 */
const generateStravaActivityImage = async ({
  activityId,
  prompt,
}: Input): Promise<ResponseImage | null> => {
  const { image } = await apiRequest<Response>(
    `/strava/activities/${activityId}/image-generator?prompt=${encodeURIComponent(prompt)}`,
  );

  return image ?? null;
}

export default generateStravaActivityImage;
