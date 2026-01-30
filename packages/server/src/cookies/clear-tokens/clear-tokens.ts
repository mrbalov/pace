import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';

/**
 * Clears Strava OAuth token cookies by setting them to expire immediately.
 *
 * @param {Response} response - Response object to set cookie clearing headers on
 * @param {ServerConfig['cookies']} cookieConfig - Cookie configuration
 * @returns {Response} Response with Set-Cookie headers to clear cookies
 */
const clearTokens = (
  response: Response,
  cookieConfig: ServerConfig['cookies']
): Response => {
  const cookieOptions: string[] = [];

  if (cookieConfig.domain) {
    cookieOptions.push(`Domain=${cookieConfig.domain}`);
  }

  cookieOptions.push(`Path=/`);
  cookieOptions.push(`HttpOnly`);
  cookieOptions.push(`SameSite=${cookieConfig.sameSite ?? 'lax'}`);

  if (cookieConfig.secure) {
    cookieOptions.push('Secure');
  }

  // Set Max-Age to 0 to expire immediately
  cookieOptions.push('Max-Age=0');
  // Also set expires to past date for older browsers
  cookieOptions.push('expires=Thu, 01 Jan 1970 00:00:00 GMT');

  const cookieOptionsString = cookieOptions.join('; ');

  // Clone response to add headers
  const newResponse = response.clone();
  
  // Clear all three token cookies
  newResponse.headers.append('Set-Cookie', `${COOKIE_NAMES.ACCESS_TOKEN}=; ${cookieOptionsString}`);
  newResponse.headers.append('Set-Cookie', `${COOKIE_NAMES.REFRESH_TOKEN}=; ${cookieOptionsString}`);
  newResponse.headers.append('Set-Cookie', `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=; ${cookieOptionsString}`);

  return newResponse;
};

export default clearTokens;
