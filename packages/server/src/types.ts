/**
 * Server configuration for server package.
 */
export interface ServerConfig {
  /**
   * Server hostname (default: 'localhost').
   */
  hostname?: string;
  /**
   * Strava OAuth configuration.
   */
  strava: {
    /**
     * OAuth2 client ID.
     */
    clientId: string;
    /**
     * OAuth2 client secret.
     */
    clientSecret: string;
    /**
     * OAuth2 redirect URI (must match Strava app settings).
     */
    redirectUri: string;
    /**
     * OAuth2 scope (default: 'activity:read').
     */
    scope?: string;
  };
  /**
   * Cookie configuration.
   */
  cookies: {
    /**
     * Cookie domain (default: undefined, uses current domain).
     */
    domain?: string;
    /**
     * Whether cookies are secure (HTTPS only, default: false in dev, true in production).
     */
    secure?: boolean;
    /**
     * SameSite cookie attribute (default: 'lax').
     */
    sameSite?: 'strict' | 'lax' | 'none';
  };
  /**
   * Redirect URL after successful authorization (default: '/').
   */
  successRedirect?: string;
  /**
   * Redirect URL after authorization failure (default: '/').
   */
  errorRedirect?: string;
}

/**
 * Token result from cookie parsing.
 */
export interface ServerTokenResult {
  /**
   * OAuth2 access token.
   */
  accessToken: string;
  /**
   * OAuth2 refresh token.
   */
  refreshToken: string;
  /**
   * Token expiration timestamp (Unix time).
   */
  expiresAt: number;
}

/**
 * Cookie names for token storage.
 */
export const COOKIE_NAMES = {
  /**
   * Access token cookie name.
   */
  ACCESS_TOKEN: 'strava_access_token',
  /**
   * Refresh token cookie name.
   */
  REFRESH_TOKEN: 'strava_refresh_token',
  /**
   * Token expiration timestamp cookie name.
   */
  TOKEN_EXPIRES_AT: 'strava_token_expires_at',
} as const;
