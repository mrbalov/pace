import { fetchStravaActivity, type StravaApiConfig } from '@pace/strava-api';
import { getTokens } from '../../cookies';
import type { ServerConfig, ServerTokenResult } from '../../types';

/**
 * Creates StravaApiConfig from server tokens and config.
 *
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {StravaApiConfig} Strava API configuration
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
 * @returns {Response} 401 Unauthorized response
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
 * @param {string | undefined} code - Activity error code
 * @param {string | undefined} message - Error message from activity error
 * @returns {{ statusCode: number; errorMessage: string }} Status code and error message
 * @internal
 */
const determineErrorDetails = (
  code: string | undefined,
  message: string | undefined,
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
      errorMessage: message ?? 'Failed to fetch activity',
    };
  }
};

/**
 * Creates error response for activity fetch failures.
 *
 * @param {Error} error - Error object
 * @returns {Response} Error response with appropriate status code
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
    },
  );
};

/**
 * Fetches activity data and creates success response.
 *
 * @param {string} activityId - Activity ID from URL
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success response with activity data
 * @internal
 */
const fetchActivityAndCreateResponse = async (
  activityId: string,
  tokens: ServerTokenResult,
  config: ServerConfig,
): Promise<Response> => {
  const activityConfig = createActivityConfig(tokens, config);
  const activity = await fetchStravaActivity(activityId, activityConfig);

  return new Response(JSON.stringify(activity), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
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
      message: 'Activity ID is required',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Handles activity fetch with error handling.
 *
 * @param {string} activityId - Activity ID from URL
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success or error response
 * @internal
 */
const handleActivityFetch = async (
  activityId: string,
  tokens: ServerTokenResult,
  config: ServerConfig,
): Promise<Response> => {
  try {
    return await fetchActivityAndCreateResponse(activityId, tokens, config);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

/**
 * Handles GET /strava/activity/:id - Fetches Strava activity data.
 *
 * Retrieves activity data from Strava API using the activity ID from the URL path.
 * Requires authentication via cookies containing Strava OAuth tokens.
 *
 * @param {Request} request - HTTP request with activity ID in path
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} JSON response with activity data or error
 */
const stravaActivity = async (request: Request, config: ServerConfig): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/').filter((part) => part !== '');
  const activityIdIndex = pathParts.indexOf('activity');
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
      return await handleActivityFetch(activityId, tokens, config);
    }
  }
};

export default stravaActivity;
