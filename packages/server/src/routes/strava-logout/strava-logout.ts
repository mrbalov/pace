import type { ServerConfig } from '../../types';
import clearTokens from '../../cookies/clear-tokens';

/**
 * Handles POST /strava/logout - Logs out user by clearing authentication cookies.
 *
 * Clears all Strava OAuth token cookies and returns success response.
 *
 * @param {Request} request - HTTP request
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Success response with cookies cleared
 */
const stravaLogout = (request: Request, config: ServerConfig): Response => {
  // Create success response
  const response = new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Clear all token cookies
  return clearTokens(response, config.cookies);
};

export default stravaLogout;
