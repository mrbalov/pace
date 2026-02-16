import { getStravaAuthUrl } from '@pace/strava-api';

import type { ServerConfig } from '../../types';

/**
 * Creates success response with authorization URL redirect.
 *
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to Strava authorization URL
 * @internal
 */
const createAuthSuccessResponse = (config: ServerConfig): Response => {
  const authUrl = getStravaAuthUrl({
    clientId: config.strava.clientId,
    clientSecret: config.strava.clientSecret,
    redirectUri: config.strava.redirectUri,
    scope: config.strava.scope,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
    },
  });
};

/**
 * Creates error response redirecting to error page.
 *
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Error redirect response
 * @internal
 */
const createAuthErrorResponse = (config: ServerConfig): Response => {
  const errorRedirect = config.errorRedirect ?? '/';
  return new Response(null, {
    status: 302,
    headers: {
      Location: errorRedirect,
    },
  });
};

/**
 * Attempts to create auth success response, falls back to error response on failure.
 *
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Success or error response
 * @internal
 */
const attemptAuthResponse = (config: ServerConfig): Response =>
  (() => {
    try {
      return createAuthSuccessResponse(config);
    } catch (error) {
      console.error('Failed to generate authorization URL:', error);
      return createAuthErrorResponse(config);
    }
  })();

/**
 * Handles GET /strava/auth - Initiates Strava OAuth flow.
 *
 * Redirects user to Strava authorization page.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to Strava authorization URL
 */
const stravaAuth = (request: Request, config: ServerConfig): Response =>
  attemptAuthResponse(config);

export default stravaAuth;
