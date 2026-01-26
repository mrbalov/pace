import { getAuthorizationUrl } from '@pace/strava-auth';
import type { ServerConfig } from '../../types';

/**
 * Creates success response with authorization URL redirect.
 *
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to Strava authorization URL
 * @internal
 */
const createAuthSuccessResponse = (config: ServerConfig): Response => {
  // Log the redirect URI being used for debugging
  console.log(`🔐 Initiating Strava OAuth`);
  console.log(`   Client ID: ${config.strava.clientId}`);
  console.log(`   Redirect URI: ${config.strava.redirectUri}`);
  console.log(`   Scope: ${config.strava.scope}`);
  console.log(`⚠️  Make sure the redirect URI matches your Strava app's registered callback URL!`);

  const authUrl = getAuthorizationUrl({
    clientId: config.strava.clientId,
    clientSecret: config.strava.clientSecret,
    redirectUri: config.strava.redirectUri,
    scope: config.strava.scope,
  });

  console.log(`   Authorization URL: ${authUrl}`);

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
  const errorRedirect = config.errorRedirect || '/';
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
const attemptAuthResponse = (config: ServerConfig): Response => {
  return (() => {
    try {
      return createAuthSuccessResponse(config);
    } catch (error) {
      console.error('Failed to generate authorization URL:', error);
      return createAuthErrorResponse(config);
    }
  })();
};

/**
 * Handles GET /strava/auth - Initiates Strava OAuth flow.
 *
 * Redirects user to Strava authorization page.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to Strava authorization URL
 */
const stravaAuth = (request: Request, config: ServerConfig): Response => {
  return attemptAuthResponse(config);
};

export default stravaAuth;
