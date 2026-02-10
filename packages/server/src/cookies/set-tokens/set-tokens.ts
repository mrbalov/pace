import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';

/**
 * Sets Strava OAuth tokens as HTTP-only cookies in the response.
 *
 * @param {Response} response - Response object to set cookies on
 * @param {string} accessToken - OAuth2 access token
 * @param {string} refreshToken - OAuth2 refresh token
 * @param {number} expiresAt - Token expiration timestamp (Unix time)
 * @param {ServerConfig['cookies']} cookieConfig - Cookie configuration
 * @returns {Response} Response with Set-Cookie headers added
 */
const setTokens = (
  response: Response,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  cookieConfig: ServerConfig['cookies'],
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

  // Set Max-Age based on expiration time
  const maxAge = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
  cookieOptions.push(`Max-Age=${maxAge}`);

  const cookieOptionsString = cookieOptions.join('; ');

  // Clone response to add headers
  const newResponse = response.clone();
  newResponse.headers.append(
    'Set-Cookie',
    `${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}; ${cookieOptionsString}`,
  );
  newResponse.headers.append(
    'Set-Cookie',
    `${COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}; ${cookieOptionsString}`,
  );
  newResponse.headers.append(
    'Set-Cookie',
    `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=${expiresAt}; ${cookieOptionsString}`,
  );

  return newResponse;
};

export default setTokens;
