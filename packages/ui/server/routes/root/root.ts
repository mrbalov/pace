import rootTemplate from '../templates/root.html';
import type { ServerConfig } from '../../../types';

/**
 * Handles GET / - Root path handler.
 *
 * Catches OAuth callbacks that Strava redirects to the root domain
 * (when Authorization Callback Domain is set to just the domain).
 * If OAuth parameters are present, redirects to the proper callback handler.
 * Otherwise, returns the root page HTML.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Redirect response to callback handler or HTML page
 */
const handleRoot = (request: Request, config: ServerConfig): Response => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  // If OAuth callback parameters are present, redirect to the callback handler
  if (code || error) {
    const callbackUrl = new URL('/strava/auth/callback', request.url);
    // Preserve all query parameters
    url.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: callbackUrl.toString(),
      },
    });
  }

  // Otherwise, return the root page HTML
  return new Response(rootTemplate(), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
};

export default handleRoot;
