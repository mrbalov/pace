import generateStravaActivityImage from '@torq/generate-strava-activity-image';
import type { GenerateImageOutput } from '@torq/generate-strava-activity-image/types';
import checkForbiddenContent from '@torq/check-forbidden-content';
import { STRAVA_ACTIVITY_IMAGE_GENERATION_PROMPT_DEFAULT } from '@torq/get-strava-activity-image-generation-prompt';

import env from '../../env';
import { ERROR_MESSAGES, STATUS_CODES } from './constants';

/**
 * Creates error response for missing prompt parameter.
 *
 * @returns {Response} 400 Bad Request response.
 * @internal
 */
const createPromptRequiredResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: ERROR_MESSAGES.PROMPT_REQUIRED,
    }),
    {
      status: STATUS_CODES.BAD_REQUEST,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Creates error response for forbidden content in prompt.
 *
 * @returns {Response} 400 Bad Request response.
 * @internal
 */
const createForbiddenContentResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: ERROR_MESSAGES.FORBIDDEN_CONTENT,
    }),
    {
      status: STATUS_CODES.BAD_REQUEST,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Creates error response for missing activity ID.
 *
 * @returns {Response} 400 Bad Request response.
 * @internal
 */
const createBadRequestResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: ERROR_MESSAGES.ACTIVITY_ID_REQUIRED,
    }),
    {
      status: STATUS_CODES.BAD_REQUEST,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );



/**
 * Generates image using provided prompt.
 *
 * @param {string} prompt - Prompt for image generation.
 * @returns {Promise<GenerateImageOutput | null>} Generated image data or null on failure.
 * @internal
 */
const generateImage = async (prompt: string): Promise<GenerateImageOutput | null> => {
  try {
    return await generateStravaActivityImage({
      defaultPrompt: STRAVA_ACTIVITY_IMAGE_GENERATION_PROMPT_DEFAULT,
      providerApiKeys: env.imageGenerationProviderApiKeys,
      provider: 'pollinations',
      prompt,
    });
  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
};

/**
 * Generates image with provided prompt and creates success response.
 *
 * @param {string} prompt - Image generation prompt.
 * @returns {Promise<Response>} Success response with image data.
 * @internal
 */
const processImageGenerationAndCreateResponse = async (
  prompt: string,
): Promise<Response> => {
  const image = await generateImage(prompt);
  const provider = 'pollinations';

  return new Response(
    JSON.stringify({
      image,
      provider,
      prompt,
    }),
    {
      status: STATUS_CODES.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

/**
 * Handles GET /strava/activities/:activityId/image-generator?prompt=:prompt - Generates image with custom prompt.
 *
 * Generates an image using the provided prompt parameter via Pollinations.ai.
 * Returns the generated image as base64 data. Validates prompt for forbidden content.
 * Prompt parameter is required.
 *
 * @param {Request} request - HTTP request with activity ID in path and prompt in query.
 * @returns {Promise<Response>} JSON response with image data or error.
 */
const activityImageGenerator = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/').filter((part) => part !== '');
  
  const stravaIndex = pathParts.indexOf('strava');
  const activitiesIndex = stravaIndex !== -1 ? stravaIndex + 1 : -1;
  const activityIdIndex = activitiesIndex !== -1 && pathParts[activitiesIndex] === 'activities' ? activitiesIndex + 1 : -1;
  const imageGeneratorIndex = activityIdIndex !== -1 ? activityIdIndex + 1 : -1;
  
  const hasValidPath = 
    stravaIndex !== -1 &&
    activitiesIndex !== -1 &&
    activityIdIndex !== -1 &&
    imageGeneratorIndex !== -1 &&
    pathParts[activitiesIndex] === 'activities' &&
    pathParts[imageGeneratorIndex] === 'image-generator';

  if (!hasValidPath) {
    return createBadRequestResponse();
  } else {
    const prompt = url.searchParams.get('prompt');

    if (!prompt) {
      return createPromptRequiredResponse();
    } else {
      const hasForbiddenContent = checkForbiddenContent(prompt);

      if (hasForbiddenContent) {
        return createForbiddenContentResponse();
      } else {
        return await processImageGenerationAndCreateResponse(prompt);
      }
    }
  }
};

export default activityImageGenerator;
