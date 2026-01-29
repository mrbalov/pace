import { fetchStravaActivity, type StravaApiConfig } from '@pace/strava-api';
import { getActivitySignals, createActivityImageGenerationPrompt, generateImage } from '@pace/activity-image-generator';
import { getTokens } from '../../cookies';
import type { ServerConfig, ServerTokenResult } from '../../types';
import { join } from 'node:path';

/**
 * Creates StravaApiConfig from server tokens and config.
 *
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {StravaApiConfig} Strava API configuration
 * @internal
 */
const createActivityConfig = (tokens: ServerTokenResult, config: ServerConfig): StravaApiConfig => {
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    clientId: config.strava.clientId,
    clientSecret: config.strava.clientSecret,
  };
};

/**
 * Creates error response for unauthorized requests.
 *
 * @returns {Response} 401 Unauthorized response
 * @internal
 */
const createUnauthorizedResponse = (): Response => {
  return new Response(
    JSON.stringify({
      error: 'Unauthorized',
      message: 'Authentication required. Please authenticate with Strava.',
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Determines status code and error message from activity error code.
 *
 * @param {string | undefined} code - Activity error code
 * @param {string | undefined} message - Error message from activity error
 * @returns {{ statusCode: number; errorMessage: string }} Status code and error message
 * @internal
 */
const determineErrorDetails = (
  code: string | undefined,
  message: string | undefined
): { statusCode: number; errorMessage: string } => {
  if (code === 'NOT_FOUND') {
    return {
      statusCode: 404,
      errorMessage: message ?? 'Activity not found',
    };
  } else if (code === 'UNAUTHORIZED') {
    return {
      statusCode: 401,
      errorMessage: message ?? 'Authentication failed',
    };
  } else if (code === 'FORBIDDEN') {
    return {
      statusCode: 403,
      errorMessage: message ?? 'Insufficient permissions',
    };
  } else if (code === 'INVALID_ID') {
    return {
      statusCode: 400,
      errorMessage: message ?? 'Invalid activity ID',
    };
  } else {
    return {
      statusCode: 500,
      errorMessage: message ?? 'Failed to process activity',
    };
  }
};

/**
 * Creates error response for activity processing failures.
 *
 * @param {Error} error - Error object
 * @returns {Response} Error response with appropriate status code
 * @internal
 */
const createErrorResponse = (error: Error): Response => {
  const defaultDetails = {
    statusCode: 500,
    errorMessage: 'Internal server error',
  };

  const details = (() => {
    try {
      const activityError = JSON.parse(error.message) as {
        code?: string;
        message?: string;
      };
      return determineErrorDetails(activityError.code, activityError.message);
    } catch {
      return {
        statusCode: 500,
        errorMessage: error.message ?? 'Internal server error',
      };
    }
  })();

  return new Response(
    JSON.stringify({
      error: details.errorMessage,
    }),
    {
      status: details.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Gets the directory path for saving generated images.
 *
 * @returns {string} Images directory path
 * @internal
 */
const getImagesDirectory = (): string => {
  const customDir = process.env.IMAGES_DIRECTORY;
  if (customDir) {
    return customDir;
  } else {
    return join(process.cwd(), 'images');
  }
};

/**
 * Extracts base URL from request.
 *
 * @param {Request} request - HTTP request
 * @returns {string} Base URL (e.g., 'http://localhost:3000')
 * @internal
 */
const getBaseUrl = (request: Request): string => {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
};

/**
 * Fetches activity, extracts signals, generates prompt, generates image and creates success response.
 *
 * @param {string} activityId - Activity ID from URL
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @param {Request} request - HTTP request for extracting base URL
 * @returns {Promise<Response>} Success response with activity, signals, prompt, and image data
 * @internal
 */
const processActivityAndCreateResponse = async (
  activityId: string,
  tokens: ServerTokenResult,
  config: ServerConfig,
  request: Request
): Promise<Response> => {
  const activityConfig = createActivityConfig(tokens, config);
  const activity = await fetchStravaActivity(activityId, activityConfig);
  const signals = activity ? await getActivitySignals(activity) : null;
  const prompt = signals ? createActivityImageGenerationPrompt(signals) : null;

  const imagesDirectory = getImagesDirectory();
  const baseUrl = getBaseUrl(request);

  const image = await (async () => {
    if (!prompt) {
      return null;
    }
    try {
      return await generateImage({ prompt }, imagesDirectory, baseUrl);
    } catch (error) {
      console.error('Image generation failed:', error);
      return null;
    }
  })();

  return new Response(
    JSON.stringify({
      activity,
      signals,
      prompt,
      image,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Creates bad request response for missing activity ID.
 *
 * @returns {Response} 400 Bad Request response
 * @internal
 */
const createBadRequestResponse = (): Response => {
  return new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: 'Activity ID is required',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Handles activity processing with error handling.
 *
 * @param {string} activityId - Activity ID from URL
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @param {Request} request - HTTP request for extracting base URL
 * @returns {Promise<Response>} Success or error response
 * @internal
 */
const handleActivityProcessing = async (
  activityId: string,
  tokens: ServerTokenResult,
  config: ServerConfig,
  request: Request
): Promise<Response> => {
  try {
    return await processActivityAndCreateResponse(activityId, tokens, config, request);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

/**
 * Handles GET /activity-image-generator/:activityId - Fetches activity, extracts signals, generates prompt, and generates image.
 *
 * Retrieves activity data from Strava API, extracts semantic signals, generates
 * an image generation prompt, and generates an image using DIAL service. Returns activity data,
 * extracted signals, the generated prompt, and the generated image URL.
 * Requires authentication via cookies containing Strava OAuth tokens.
 *
 * @param {Request} request - HTTP request with activity ID in path
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} JSON response with activity, signals, prompt, and image data or error
 */
const activityImageGenerator = async (request: Request, config: ServerConfig): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/').filter((part) => part !== '');
  const activityIdIndex = pathParts.indexOf('activity-image-generator');
  const hasActivityId = activityIdIndex !== -1 && activityIdIndex < pathParts.length - 1;

  if (!hasActivityId) {
    return createBadRequestResponse();
  } else {
    const activityId = pathParts[activityIdIndex + 1];
    const tokens = getTokens(request);
    const hasTokens = tokens !== null;

    if (!hasTokens) {
      return createUnauthorizedResponse();
    } else {
      return await handleActivityProcessing(activityId, tokens, config, request);
    }
  }
};

export default activityImageGenerator;
