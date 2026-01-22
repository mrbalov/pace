import type { ServerConfig } from '../../types';

/**
 * Gets the server hostname from environment variables.
 *
 * Priority order:
 * 1. HOSTNAME environment variable (explicit override)
 * 2. Netlify URL environment variable (extracts hostname from URL)
 * 3. Defaults to 'localhost' for local development
 *
 * @returns {string} Server hostname
 */
const getHostname = (): string => {
  if (process.env.HOSTNAME) {
    return process.env.HOSTNAME;
  } else if (process.env.URL) {
    try {
      const { hostname } = new URL(process.env.URL);

      return hostname;
    } catch {
      return 'localhost';
    }
  } else {
    return 'localhost';
  }
};

/**
 * Gets server configuration from environment variables.
 *
 * @returns {ServerConfig} Server configuration
 * @throws {Error} Throws if required environment variables are missing
 */
const getConfig = (): ServerConfig => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const redirectUri = process.env.STRAVA_REDIRECT_URI || 'http://localhost:3000/strava/auth/callback';

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing required environment variables: STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET are required'
    );
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    hostname: getHostname(),
    strava: {
      clientId,
      clientSecret,
      redirectUri,
      scope: process.env.STRAVA_SCOPE || 'activity:read',
    },
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      secure: process.env.COOKIE_SECURE === 'true' || isProduction,
      sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
    },
    successRedirect: process.env.SUCCESS_REDIRECT || '/',
    errorRedirect: process.env.ERROR_REDIRECT || '/',
  };
};

export default getConfig;
