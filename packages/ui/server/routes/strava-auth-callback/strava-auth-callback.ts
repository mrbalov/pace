import { exchangeToken } from '@pace/strava-auth';
import { setTokens } from '../../cookies';
import type { ServerConfig } from '../../../types';

/**
 * Handles GET /strava/auth/callback - OAuth callback handler.
 *
 * Exchanges authorization code for tokens and saves them to cookies.
 *
 * @param {Request} request - HTTP request with authorization code in query params
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response with cookies set
 */
const handleStravaAuthCallback = async (request: Request, config: ServerConfig): Promise<Response> => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    const errorDescription = url.searchParams.get('error_description') || 'Authorization failed';
    console.error('Strava OAuth error:', error, errorDescription);
    return new Response(null, {
      status: 302,
      headers: {
        Location: config.errorRedirect || '/',
      },
    });
  } else if (!code) {
    // Validate authorization code
    console.error('Missing authorization code in callback');
    return new Response(null, {
      status: 302,
      headers: {
        Location: config.errorRedirect || '/',
      },
    });
  } else {
    try {
      // Exchange authorization code for tokens
      const tokens = await exchangeToken(code, {
        clientId: config.strava.clientId,
        clientSecret: config.strava.clientSecret,
        redirectUri: config.strava.redirectUri,
        scope: config.strava.scope,
      });

      // Create redirect response
      const redirectResponse = new Response(null, {
        status: 302,
        headers: {
          Location: config.successRedirect || '/',
        },
      });

      // Set tokens as cookies
      const responseWithCookies = setTokens(
        redirectResponse,
        tokens.access_token,
        tokens.refresh_token,
        tokens.expires_at,
        config.cookies
      );

      return responseWithCookies;
    } catch (error) {
      console.error('Token exchange failed:', error);
      return new Response(null, {
        status: 302,
        headers: {
          Location: config.errorRedirect || '/',
        },
      });
    }
  }
};

export default handleStravaAuthCallback;
