import type { ServerConfig } from '../types';

/**
 * Extracts hostname from URL environment variable.
 *
 * @returns {string} Hostname from URL or 'localhost' if extraction fails
 * @internal
 */
const extractHostnameFromUrl = (): string => {
  try {
    const urlObj = new URL(process.env.URL!);
    return urlObj.hostname;
  } catch {
    return 'localhost';
  }
};

/**
 * Gets the server hostname from environment variables.
 *
 * Priority order:
 * 1. HOSTNAME environment variable (explicit override)
 * 2. Netlify URL environment variable (extracts hostname from URL)
 * 3. Defaults to 'localhost' for local development
 *
 * @returns {string} Server hostname
 * @internal
 */
const getHostname = (): string => {
  const hasHostname = process.env.HOSTNAME !== undefined;
  const hasUrl = process.env.URL !== undefined;

  if (hasHostname) {
    return process.env.HOSTNAME!;
  } else if (hasUrl) {
    return extractHostnameFromUrl();
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
  const hasClientId = clientId !== undefined;
  const hasClientSecret = clientSecret !== undefined;

  if (!hasClientId || !hasClientSecret) {
    throw new Error(
      'Missing required environment variables: STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET are required'
    );
  }

  const config: ServerConfig = {
    hostname: getHostname(),
    strava: {
      clientId,
      clientSecret,
      redirectUri: String(process.env.STRAVA_REDIRECT_URI),
      scope: 'activity:read',
    },
    cookies: {
      secure: true,
      sameSite: 'lax',
    },
    successRedirect: process.env.UI_ORIGIN,
    errorRedirect: '/',
  };

  return config;
};

export default getConfig;
