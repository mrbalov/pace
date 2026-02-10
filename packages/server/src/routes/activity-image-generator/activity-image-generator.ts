import { fetchStravaActivity, type StravaApiConfig } from '@pace/strava-api';
import {
  getActivitySignals,
  createActivityImageGenerationPrompt,
  generateImage,
} from '@pace/activity-image-generator';
import { getTokens } from '../../cookies';
import type { ServerConfig, ServerTokenResult } from '../../types';
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from './constants';
import env from '../../env';

/**
 * Creates StravaApiConfig from server tokens and config.
 *
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies.
 * @param {ServerConfig} config - Server configuration.
 * @returns {StravaApiConfig} Strava API configuration.
 * @internal
 */
const createActivityConfig = (
  tokens: ServerTokenResult,
  config: ServerConfig,
): StravaApiConfig => ({
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  clientId: config.strava.clientId,
  clientSecret: config.strava.clientSecret,
});

/**
 * Creates error response for unauthorized requests.
 *
 * @returns {Response} 401 Unauthorized response.
 * @internal
 */
const createUnauthorizedResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Unauthorized',
      message: 'Authentication required. Please authenticate with Strava.',
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Determines status code and error message from activity error code.
 *
 * @param {string | undefined} code - Activity error code.
 * @param {string | undefined} message - Error message from activity error.
 * @returns {{ statusCode: number; errorMessage: string }} Status code and error message.
 * @internal
 */
const determineErrorDetails = (
  code: string | undefined,
  message: string | undefined,
): { statusCode: number; errorMessage: string } => {
  switch (code) {
    case ERROR_CODES.NOT_FOUND:
      return {
        statusCode: STATUS_CODES.NOT_FOUND,
        errorMessage: message ?? ERROR_MESSAGES.ACTIVITY_NOT_FOUND,
      };
    case ERROR_CODES.UNAUTHORIZED:
      return {
        statusCode: STATUS_CODES.UNAUTHORIZED,
        errorMessage: message ?? ERROR_MESSAGES.AUTHENTICATION_FAILED,
      };
    case ERROR_CODES.FORBIDDEN:
      return {
        statusCode: STATUS_CODES.FORBIDDEN,
        errorMessage: message ?? ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
      };
    case ERROR_CODES.INVALID_ID:
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        errorMessage: message ?? ERROR_MESSAGES.INVALID_ACTIVITY_ID,
      };
    default:
      return {
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        errorMessage: message ?? ERROR_MESSAGES.ACTIVITY_PROCESSING_FAILED,
      };
  }
};

/**
 * Creates error response for activity processing failures.
 *
 * @param {Error} error - Error object.
 * @returns {Response} Error response with appropriate status code.
 * @internal
 */
const createErrorResponse = (error: Error): Response => {
  const details = (() => {
    try {
      const activityError = JSON.parse(error.message) as {
        code?: string;
        message?: string;
      };

      return determineErrorDetails(activityError.code, activityError.message);
    } catch {
      return {
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        errorMessage: error.message ?? ERROR_MESSAGES.ACTIVITY_PROCESSING_FAILED,
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
    },
  );
};

/**
 * Fetches activity, extracts signals, generates prompt, generates image and creates success response.
 *
 * @param {string} activityId - Activity ID from URL.
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies.
 * @param {ServerConfig} config - Server configuration.
 * @returns {Promise<Response>} Success response with activity, signals, prompt, and image data.
 * @internal
 */
const processActivityAndCreateResponse = async (
  activityId: string,
  tokens: ServerTokenResult,
  config: ServerConfig,
): Promise<Response> => {
  const provider = 'pollinations';
  const activityConfig = createActivityConfig(tokens, config);
  const activity = await fetchStravaActivity(activityId, activityConfig);
  const signals = activity ? getActivitySignals(activity) : null;
  const prompt = signals ? createActivityImageGenerationPrompt(signals) : null;
  const image = await (async () => {
    if (prompt) {
      try {
        return await generateImage({
          providerApiKeys: env.imageGenerationProviderApiKeys,
          provider,
          prompt,
        });
      } catch (error) {
        console.error('Image generation failed:', error);
        return null;
      }
    } else {
      return null;
    }
  })();

  return new Response(
    JSON.stringify({
      activity,
      signals,
      prompt,
      image,
      provider,
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
 * Creates bad request response for missing activity ID.
 *
 * @returns {Response} 400 Bad Request response
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
 * Handles activity processing with error handling.
 *
 * @param {string} activityId - Activity ID from URL
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success or error response
 * @internal
 */
const handleActivityProcessing = async (
  activityId: string,
  tokens: ServerTokenResult,
  config: ServerConfig,
): Promise<Response> => {
  try {
    return await processActivityAndCreateResponse(activityId, tokens, config);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

/**
 * Handles GET /activity-image-generator/:activityId - Fetches activity, extracts signals, generates prompt, and generates image.
 *
 * Retrieves activity data from Strava API, extracts semantic signals, generates
 * an image generation prompt, and generates an image using Pollinations.ai. Returns activity data,
 * extracted signals, the generated prompt, and the generated image as base64 data.
 * Requires authentication via cookies containing Strava OAuth tokens.
 *
 * @param {Request} request - HTTP request with activity ID in path.
 * @param {ServerConfig} config - Server configuration.
 * @returns {Promise<Response>} JSON response with activity, signals, prompt, and image data or error.
 */
const activityImageGenerator = async (
  request: Request,
  config: ServerConfig,
): Promise<Response> => {
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
      return await handleActivityProcessing(activityId, tokens, config);
    }
  }
};

export default activityImageGenerator;
