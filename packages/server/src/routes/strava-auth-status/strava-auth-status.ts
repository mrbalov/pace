import { getTokens } from '../../cookies';
import type { ServerConfig } from '../../types';

/**
 * Handles GET /strava/auth/status - Checks authentication status.
 *
 * Returns whether the user is authenticated based on presence of valid auth cookies.
 * Does not fetch activities or make external API calls - lightweight auth check only.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} _config - Server configuration (unused)
 * @returns {Response} JSON response with authentication status
 */
const stravaAuthStatus = (request: Request, _config: ServerConfig): Response => {
  // Explicitly mark parameter as intentionally unused
  void _config;

  const tokens = getTokens(request);
  const hasTokens = tokens !== null;

  if (!hasTokens) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export default stravaAuthStatus;
