import { COOKIE_NAMES } from '../../types';

/**
 * Parses cookies from cookie header string.
 *
 * @param {string} cookieHeader - Cookie header string
 * @returns {Record<string, string>} Parsed cookies object
 * @internal
 */
const parseCookies = (cookieHeader: string): Record<string, string> => {
  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Extracts Strava OAuth tokens from request cookies.
 *
 * @param {Request} request - Request object to read cookies from
 * @returns {{ accessToken: string; refreshToken: string; expiresAt: number } | null} Tokens if found, null otherwise
 */
const getTokens = (
  request: Request
): { accessToken: string; refreshToken: string; expiresAt: number } | null => {
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) {
    return null;
  } else {
    const cookies = parseCookies(cookieHeader);
    const accessToken = cookies[COOKIE_NAMES.ACCESS_TOKEN];
    const refreshToken = cookies[COOKIE_NAMES.REFRESH_TOKEN];
    const expiresAtStr = cookies[COOKIE_NAMES.TOKEN_EXPIRES_AT];

    if (!accessToken || !refreshToken || !expiresAtStr) {
      return null;
    } else {
      const expiresAt = Number.parseInt(expiresAtStr, 10);
      if (Number.isNaN(expiresAt)) {
        return null;
      } else {
        return {
          accessToken,
          refreshToken,
          expiresAt,
        };
      }
    }
  }
};

export default getTokens;
