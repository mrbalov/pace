import getStravaActivityImageGenerationPrompt from '@torq/get-strava-activity-image-generation-prompt';
import checkForbiddenContent from '@torq/check-forbidden-content';
import type { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import type { ServerConfig } from '../../types';

/**
 * Creates error response for missing signals query parameter.
 * @returns {Response} 400 Bad Request response.
 * @internal
 */
const createMissingSignalsResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: 'Signals query parameter is required',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Creates error response for invalid base64-encoded signals.
 * @returns {Response} 400 Bad Request response.
 * @internal
 */
const createInvalidSignalsResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: 'Invalid base64-encoded signals',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Creates error response for invalid JSON in decoded signals.
 * @returns {Response} 400 Bad Request response.
 * @internal
 */
const createInvalidJsonResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Bad Request',
      message: 'Invalid JSON in decoded signals',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Creates error response for internal server errors.
 * @returns {Response} 500 Internal Server Error response.
 * @internal
 */
const createInternalErrorResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while generating the prompt',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

/**
 * Handles GET /strava/activities/:activityId/image-generator/prompt - Generates image prompt from activity signals.
 *
 * Accepts base64-encoded Strava activity signals as a query parameter and returns
 * the generated image prompt. No authentication required as signals are self-contained.
 *
 * @param {Request} request - HTTP request with base64-encoded signals in query parameter.
 * @param {ServerConfig} config - Server configuration (unused but required for handler signature).
 * @returns {Promise<Response>} JSON response with generated prompt or error.
 */
const stravaActivityImageGenerationPrompt = async (
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ServerConfig,
): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const signalsParam = url.searchParams.get('signals');

    if (signalsParam) {
      // eslint-disable-next-line no-restricted-syntax
      let decodedSignals: string;
      try {
        decodedSignals = atob(signalsParam);
      } catch {
        return createInvalidSignalsResponse();
      }

      // eslint-disable-next-line no-restricted-syntax
      let signals: StravaActivitySignals;
      try {
        signals = JSON.parse(decodedSignals) as StravaActivitySignals;
      } catch {
        return createInvalidJsonResponse();
      }

      return new Response(
        JSON.stringify({
          prompt: getStravaActivityImageGenerationPrompt(signals, checkForbiddenContent),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } else {
      return createMissingSignalsResponse();
    }
  } catch (error) {
    console.error('Error generating activity image prompt:', error);
    return createInternalErrorResponse();
  }
};

export default stravaActivityImageGenerationPrompt;
