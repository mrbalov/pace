import { exchangeStravaAuthToken } from '@pace/strava-api';
import { setTokens } from '../../cookies';
import type { ServerConfig } from '../../types';

/**
 * Creates error response for OAuth callback errors.
 *
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Error redirect response
 * @internal
 */
const createCallbackErrorResponse = (config: ServerConfig): Response => {
  const errorRedirect = config.errorRedirect ?? '/';
  return new Response(null, {
    status: 302,
    headers: {
      Location: errorRedirect,
    },
  });
};

/**
 * Exchanges authorization code for tokens and creates success response.
 *
 * @param {string} code - Authorization code
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success response with cookies set
 * @internal
 */
const exchangeCodeAndCreateSuccessResponse = async (
  code: string,
  config: ServerConfig
): Promise<Response> => {
  const tokens = await exchangeStravaAuthToken(code, {
    clientId: config.strava.clientId,
    clientSecret: config.strava.clientSecret,
    redirectUri: config.strava.redirectUri,
    scope: config.strava.scope,
  });

  if (tokens) {
    // Ensure redirect URL is clean (no query parameters) to prevent exposing OAuth details
    const successRedirect = config.successRedirect ?? '/';
    const cleanRedirect = successRedirect.split('?')[0]; // Remove any existing query params
    
    const redirectResponse = new Response(null, {
      status: 302,
      headers: {
        Location: cleanRedirect,
      },
    });
  
    return setTokens(
      redirectResponse,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_at,
      config.cookies
    );
  } else {
    throw new Error('Token exchange returned null');
  }
};

/**
 * Handles token exchange with error handling.
 *
 * @param {string} code - Authorization code
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Response with tokens or error redirect
 * @internal
 */
const handleTokenExchange = async (code: string, config: ServerConfig): Promise<Response> => await exchangeCodeAndCreateSuccessResponse(code, config).catch((error) => {
    console.error('Token exchange failed:', error);
    return createCallbackErrorResponse(config);
  });

/**
 * Creates error response for OAuth parameter errors.
 *
 * @param {URL} url - Parsed request URL
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Error redirect response
 * @internal
 */
const createParameterErrorResponse = (url: URL, config: ServerConfig): Response => {
  const error = url.searchParams.get('error');
  const hasError = error !== null;

  if (hasError) {
    const errorDescription = url.searchParams.get('error_description') ?? 'Authorization failed';
    console.error('Strava OAuth error:', error, errorDescription);
  } else {
    console.error('Missing authorization code in callback');
  }

  return createCallbackErrorResponse(config);
};

/**
 * Gets error response for callback parameter errors.
 *
 * @param {URL} url - Parsed request URL
 * @param {ServerConfig} config - Server configuration
 * @returns {Response} Error response
 * @internal
 */
const getCallbackErrorResponse = (url: URL, config: ServerConfig): Response => createParameterErrorResponse(url, config);

/**
 * Gets success response after token exchange.
 *
 * @param {string} code - Authorization code
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Success response with tokens
 * @internal
 */
const getCallbackSuccessResponse = async (code: string, config: ServerConfig): Promise<Response> => await handleTokenExchange(code, config);

/**
 * Gets the promise to await for callback response.
 *
 * @param {URL} url - Parsed request URL
 * @param {string | null} code - Authorization code
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Promise resolving to appropriate response
 * @internal
 */
const getCallbackResponsePromise = (
  url: URL,
  code: string | null,
  config: ServerConfig
): Promise<Response> => {
  const hasCode = code !== null;
  const promise = hasCode
    ? getCallbackSuccessResponse(code, config)
    : Promise.resolve(getCallbackErrorResponse(url, config));

  return promise;
};

/**
 * Determines callback response based on request parameters.
 *
 * @param {URL} url - Parsed request URL
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Appropriate response based on callback state
 * @internal
 */
const determineCallbackResponse = async (url: URL, config: ServerConfig): Promise<Response> => {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const hasError = error !== null;
  const promise = hasError
    ? Promise.resolve(getCallbackErrorResponse(url, config))
    : getCallbackResponsePromise(url, code, config);

  return await promise;
};

/**
 * Handles GET /strava/auth/callback - OAuth callback handler.
 *
 * Exchanges authorization code for tokens and saves them to cookies.
 *
 * @param {Request} request - HTTP request with authorization code in query params
 * @param {ServerConfig} config - Server configuration
 * @returns {Promise<Response>} Redirect response with cookies set
 */
const stravaAuthCallback = async (request: Request, config: ServerConfig): Promise<Response> => {
  const url = new URL(request.url);
  return await determineCallbackResponse(url, config);
};

export default stravaAuthCallback;
