import { ActivityConfig, ActivityError } from '../types';

/**
 * Creates an ActivityError wrapped in an Error object.
 *
 * @param {ActivityError['code']} code - Error code from ActivityErrorCode union type
 * @param {string} message - User-friendly error message
 * @returns {Error} Error object with JSON-stringified ActivityError in message
 * @internal
 */
const createActivityError = (code: ActivityError['code'], message: string): Error => {
  const error: ActivityError = {
    code,
    message,
    retryable: false,
  };
  return new Error(JSON.stringify(error));
};

/**
 * Refreshes an expired OAuth2 access token using refresh token.
 *
 * Calls the Strava OAuth token refresh endpoint to obtain a new access token
 * when the current one has expired. Requires refresh token, client ID, and
 * client secret to be present in the configuration.
 *
 * @param {ActivityConfig} config - Activity module configuration containing refresh token and OAuth credentials
 * @returns {Promise<string>} Promise resolving to the new access token string
 * @throws {Error} Throws an error with ActivityError structure for various failure scenarios:
 *   - 'UNAUTHORIZED' (not retryable): Refresh token missing or invalid credentials
 *   - 'NETWORK_ERROR' (not retryable): Network connection failure
 *   - 'UNAUTHORIZED' (not retryable): Token refresh request failed
 *   - 'MALFORMED_RESPONSE' (not retryable): Invalid JSON response or missing access_token
 *
 * @see {@link https://developers.strava.com/docs/authentication/#refreshingexpiredaccesstokens | Strava Token Refresh}
 * @see {@link https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/ | OAuth2 Token Refresh}
 *
 * @example
 * ```typescript
 * const newToken = await refreshToken({
 *   accessToken: 'expired-token',
 *   refreshToken: 'refresh-token-123',
 *   clientId: 'client-id',
 *   clientSecret: 'client-secret'
 * });
 * ```
 */
const refreshToken = async (config: ActivityConfig): Promise<string> => {
  if (config.refreshToken === undefined) {
    throw createActivityError('UNAUTHORIZED', 'Refresh token is not available');
  }

  if (config.clientId === undefined || config.clientSecret === undefined) {
    throw createActivityError('UNAUTHORIZED', 'Client ID and client secret are required for token refresh');
  }

  const url = 'https://www.strava.com/oauth/token';
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken,
  });

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
  } catch (error) {
    throw createActivityError('NETWORK_ERROR', 'Failed to connect to Strava OAuth endpoint');
  }

  if (!response.ok) {
    throw createActivityError('UNAUTHORIZED', 'Token refresh failed');
  }

  // Clone response to avoid consuming the body stream
  const clonedResponse = response.clone();
  let jsonData: { access_token?: string; refresh_token?: string };

  try {
    jsonData = (await clonedResponse.json()) as { access_token?: string; refresh_token?: string };
  } catch (error) {
    throw createActivityError('MALFORMED_RESPONSE', 'Invalid response format from token refresh endpoint');
  }

  if (jsonData.access_token === undefined || jsonData.access_token === null) {
    throw createActivityError('MALFORMED_RESPONSE', 'Access token not found in refresh response');
  }

  return jsonData.access_token;
};

export default refreshToken;
