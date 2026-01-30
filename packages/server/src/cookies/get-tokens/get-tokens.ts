import { COOKIE_NAMES, type ServerTokenResult } from '../../types';

/**
 * Parses cookies from cookie header string.
 *
 * @param {string} cookieHeader - Cookie header string
 * @returns {Record<string, string>} Parsed cookies object
 * @internal
 */
const parseCookies = (cookieHeader: string): Record<string, string> => cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);

/**
 * Extracts tokens from parsed cookies.
 *
 * @param {Record<string, string>} cookies - Parsed cookies object
 * @returns {ServerTokenResult | null} Tokens if found, null otherwise
 * @internal
 */
const extractTokensFromCookies = (cookies: Record<string, string>): ServerTokenResult | null => {
  const accessToken = cookies[COOKIE_NAMES.ACCESS_TOKEN];
  const refreshToken = cookies[COOKIE_NAMES.REFRESH_TOKEN];
  const expiresAtStr = cookies[COOKIE_NAMES.TOKEN_EXPIRES_AT];
  const hasAllTokens = accessToken !== undefined && refreshToken !== undefined && expiresAtStr !== undefined;

  if (!hasAllTokens) {
    return null;
  } else {
    const expiresAt = Number.parseInt(expiresAtStr, 10);
    const isValidExpiresAt = !Number.isNaN(expiresAt);

    if (!isValidExpiresAt) {
      return null;
    } else {
      return {
        accessToken,
        refreshToken,
        expiresAt,
      };
    }
  }
};

/**
 * Extracts Strava OAuth tokens from request cookies.
 *
 * @param {Request} request - Request object to read cookies from
 * @returns {ServerTokenResult | null} Tokens if found, null otherwise
 */
const getTokens = (request: Request): ServerTokenResult | null => {
  const cookieHeader = request.headers.get('Cookie');
  const hasCookieHeader = cookieHeader !== null;

  if (!hasCookieHeader) {
    return null;
  } else {
    const cookies = parseCookies(cookieHeader);
    return extractTokensFromCookies(cookies);
  }
};

export default getTokens;
