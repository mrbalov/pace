import { getAuthorizationUrl } from '@pace/strava-auth';
import type { ServerConfig } from '../../types';

/**
 * Handles GET /strava/auth - Initiates Strava OAuth flow.
 *
 * Redirects user to Strava authorization page.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to Strava authorization URL
 */
const handleStravaAuth = (request: Request, config: ServerConfig): Response => {
  try {
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
  } catch (error) {
    // If authorization URL generation fails, redirect to error page
    console.error('Failed to generate authorization URL:', error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: config.errorRedirect || '/',
      },
    });
  }
};

export default handleStravaAuth;
