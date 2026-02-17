import { fetchStravaActivity } from '@pace/strava-api';
import getStravaActivitySignals from '@pace/get-strava-activity-signals';
import checkForbiddenContent from '@pace/check-forbidden-content';

import { getTokens } from '../../cookies';
import type { ServerConfig } from '../../types';

/**
 * Creates error response for unauthorized requests.
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
 * Creates bad request response for missing activity ID.
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
 * Handles GET /strava/activities/:id/signals - Fetches Strava activity signals.
 *
 * Retrieves activity data from Strava API using the activity ID from the URL path.
 * Requires authentication via cookies containing Strava OAuth tokens.
 *
 * @param {Request} request - HTTP request with activity ID in path
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} JSON response with activity data or error
 */
const stravaActivitySignals = async (request: Request, config: ServerConfig): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathParts = pathname.split('/').filter((part) => part !== '');
  const activityIdIndex = pathParts.indexOf('activities');
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
      const activity = await fetchStravaActivity(activityId, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        clientId: config.strava.clientId,
        clientSecret: config.strava.clientSecret,
      });
      const signals = activity
        ? await getStravaActivitySignals(activity, checkForbiddenContent)
        : null;

      if (signals) {
        return new Response(JSON.stringify(signals), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        return new Response(
          JSON.stringify({
            error: 'Not Found',
            message: 'Activity not found or inaccessible.',
          }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }
    }
  }
};

export default stravaActivitySignals;
