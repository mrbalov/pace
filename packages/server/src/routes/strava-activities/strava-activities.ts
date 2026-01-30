import { fetchStravaActivities, type StravaApiConfig } from '@pace/strava-api';
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
const createActivityConfig = (tokens: ServerTokenResult, config: ServerConfig): StravaApiConfig => ({
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
const createUnauthorizedResponse = (): Response => new Response(
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
  if (code === 'UNAUTHORIZED') {
    return {
      statusCode: 401,
      errorMessage: message ?? 'Authentication failed. Token may be expired or invalid.',
    };
  } else if (code === 'FORBIDDEN') {
    return {
      statusCode: 403,
      errorMessage: message ?? 'Insufficient permissions to access activities',
    };
  } else if (code === 'RATE_LIMITED') {
    return {
      statusCode: 429,
      errorMessage: message ?? 'Rate limit exceeded. Please try again later.',
    };
  } else if (code === 'SERVER_ERROR' || code === 'NETWORK_ERROR') {
    return {
      statusCode: 500,
      errorMessage: message ?? 'Failed to fetch activities',
    };
  } else {
    return {
      statusCode: 500,
      errorMessage: message ?? 'Failed to fetch activities',
    };
  }
};

/**
 * Creates error response for activities fetch failures.
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
        errorMessage: error.message ?? 'Failed to fetch activities',
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
 * Fetches activities data and creates success response.
 *
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success response with activities data
 * @internal
 */
const fetchActivitiesAndCreateResponse = async (
  tokens: ServerTokenResult,
  config: ServerConfig
): Promise<Response> => {
  const activityConfig = createActivityConfig(tokens, config);
  const activities = await fetchStravaActivities(activityConfig);

  return new Response(JSON.stringify(activities), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Handles activities fetch with error handling.
 *
 * @param {ServerTokenResult} tokens - OAuth tokens from cookies
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success or error response
 * @internal
 */
const handleActivitiesFetch = async (
  tokens: ServerTokenResult,
  config: ServerConfig
): Promise<Response> => {
  try {
    return await fetchActivitiesAndCreateResponse(tokens, config);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

/**
 * Handles GET /strava/activities - Fetches list of Strava activities.
 *
 * Retrieves a list of activities for the authenticated athlete from Strava API.
 * Returns default pagination (30 activities per request) in raw Strava API format.
 * Requires authentication via cookies containing Strava OAuth tokens.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} JSON response with activities list or error
 */
const stravaActivities = async (request: Request, config: ServerConfig): Promise<Response> => {
  const tokens = getTokens(request);
  const hasTokens = tokens !== null;

  if (!hasTokens) {
    return createUnauthorizedResponse();
  } else {
    return await handleActivitiesFetch(tokens, config);
  }
};

export default stravaActivities;
