/**
 * Netlify Functions adapter for PACE server routes
 *
 * Provides Netlify-compatible handler functions that wrap the server route handlers.
 */

import {
  stravaAuth,
  stravaAuthCallback,
  stravaAuthStatus,
  stravaLogout,
  stravaActivities,
  stravaActivity,
} from '../routes';
import { getConfig } from '../config';

/**
 * Netlify Function event type.
 */
export interface NetlifyEvent {
  /**
   * HTTP method.
   */
  httpMethod: string;
  /**
   * Request path.
   */
  path: string;
  /**
   * Request headers.
   */
  headers: Record<string, string>;
  /**
   * Query string parameters.
   */
  queryStringParameters?: Record<string, string> | null;
  /**
   * Request body.
   */
  body?: string;
}

/**
 * Netlify Function response type.
 */
export interface NetlifyResponse {
  /**
   * HTTP status code.
   */
  statusCode: number;
  /**
   * Response headers.
   */
  headers: Record<string, string>;
  /**
   * Multi-value headers (for Set-Cookie).
   */
  multiValueHeaders?: Record<string, string[]>;
  /**
   * Response body.
   */
  body?: string;
}

/**
 * Normalizes Netlify function path to expected route path.
 *
 * Converts paths like `/.netlify/functions/strava-activity/12345` to `/strava/activity/12345`
 * so route handlers can properly parse them.
 *
 * @param {string} path - Original Netlify path
 * @returns {string} Normalized path
 * @internal
 */
const normalizePath = (path: string): string => {
  // Handle Netlify function paths
  if (path.startsWith('/.netlify/functions/')) {
    const functionPath = path.replace('/.netlify/functions/', '');
    const parts = functionPath.split('/');
    const functionName = parts[0];
    const remainingPath = parts.slice(1).join('/');

    // Map function names to route paths
    const routeMap: Record<string, string> = {
      'strava-auth': '/strava/auth',
      'strava-auth-callback': '/strava/auth/callback',
      'strava-logout': '/strava/logout',
      'strava-activities': '/strava/activities',
      'strava-activity': '/strava/activity',
    };

    const baseRoute = routeMap[functionName] || path;
    return remainingPath ? `${baseRoute}/${remainingPath}` : baseRoute;
  }

  return path;
};

/**
 * Checks if HTTP method supports a request body.
 *
 * @param {string} method - HTTP method
 * @returns {boolean} True if method supports body
 * @internal
 */
const methodSupportsBody = (method: string): boolean => {
  const upperMethod = method.toUpperCase();
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(upperMethod);
};

/**
 * Converts Netlify event to Web API Request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Request} Web API Request object
 * @internal
 */
const netlifyEventToRequest = (event: NetlifyEvent): Request => {
  const protocol = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host || event.headers['x-forwarded-host'];
  const normalizedPath = normalizePath(event.path);
  const queryString = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : '';
  const url = `${protocol}://${host}${normalizedPath}${queryString}`;
  const method = event.httpMethod || 'GET';

  // Normalize headers - ensure Cookie header is capitalized (Netlify may send lowercase 'cookie')
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(event.headers)) {
    const normalizedKey = key.toLowerCase() === 'cookie' ? 'Cookie' : key;
    normalizedHeaders[normalizedKey] = value;
  }

  const requestInit: RequestInit = {
    method,
    headers: normalizedHeaders,
  };

  // Only include body for methods that support it (POST, PUT, PATCH, DELETE)
  // GET and HEAD requests cannot have a body
  if (methodSupportsBody(method) && event.body) {
    requestInit.body = event.body;
  }

  return new Request(url, requestInit);
};

/**
 * Gets the allowed origin for CORS based on environment.
 *
 * @returns {string} Allowed origin URL
 * @internal
 */
const getAllowedOrigin = (): string =>
  // Allow UI origin from environment variable, default to localhost:3001 for dev
   process.env.UI_ORIGIN ?? 'http://localhost:3001'
;

/**
 * Converts Web API Response to Netlify response format.
 *
 * @param {Response} response - Web API Response object
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const webResponseToNetlify = async (response: Response): Promise<NetlifyResponse> => {
  const headers: Record<string, string> = {};
  const multiValueHeaders: Record<string, string[]> = {};
  const isRedirect = response.status >= 300 && response.status < 400;

  // Handle Set-Cookie with multiValueHeaders (Netlify requirement)
  const setCookies = response.headers.getSetCookie();
  if (setCookies.length > 0) {
    multiValueHeaders['Set-Cookie'] = setCookies;
  }

  // Add CORS headers (skip for redirects as they're not needed)
  if (!isRedirect) {
    const allowedOrigin = getAllowedOrigin();
    headers['Access-Control-Allow-Origin'] = allowedOrigin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }

  // Copy other headers from response (excluding Set-Cookie and CORS headers which we handled above)
  response.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey !== 'set-cookie' &&
      lowerKey !== 'access-control-allow-origin' &&
      lowerKey !== 'access-control-allow-credentials' &&
      lowerKey !== 'access-control-allow-methods' &&
      lowerKey !== 'access-control-allow-headers'
    ) {
      headers[key] = value;
    }
  });

  // For redirects, body should be empty
  const hasBody = !isRedirect && response.body !== null;
  const body = hasBody ? await response.text() : undefined;

  return {
    statusCode: response.status,
    headers,
    multiValueHeaders: Object.keys(multiValueHeaders).length > 0 ? multiValueHeaders : undefined,
    body,
  };
};

/**
 * Handles OPTIONS preflight request.
 *
 * @param {NetlifyEvent} _event - Netlify function event (unused)
 * @returns {NetlifyResponse} CORS preflight response
 * @internal
 */
const handleOptionsRequest = (_event: NetlifyEvent): NetlifyResponse => {
  // Explicitly mark parameter as intentionally unused
  void _event;

  const allowedOrigin = getAllowedOrigin();
  const requestHeaders = 'Content-Type';
  
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': requestHeaders,
      'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    },
  };
};

/**
 * Handles successful strava auth request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaAuthSuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  const config = getConfig();
  const request = netlifyEventToRequest(event);
  const response = stravaAuth(request, config);
  return await webResponseToNetlify(response);
};

/**
 * Handles strava auth error.
 *
 * @param {unknown} error - Error object
 * @returns {NetlifyResponse} Error response
 * @internal
 */
const stravaAuthError = (error: unknown): NetlifyResponse => {
  console.error('Error in strava-auth function:', error);
  const allowedOrigin = getAllowedOrigin();
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

/**
 * Netlify Function handler for /strava/auth endpoint.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 */
export const stravaAuthHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const result = await stravaAuthSuccess(event).catch((error) => stravaAuthError(error));
  return result;
};

/**
 * Handles successful strava auth status request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaAuthStatusSuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  const config = getConfig();
  const request = netlifyEventToRequest(event);
  const response = stravaAuthStatus(request, config);
  return await webResponseToNetlify(response);
};

/**
 * Handles strava auth status error.
 *
 * @param {unknown} error - Error object
 * @returns {NetlifyResponse} Error response
 * @internal
 */
const stravaAuthStatusError = (error: unknown): NetlifyResponse => {
  console.error('Error in strava-auth-status function:', error);
  const allowedOrigin = getAllowedOrigin();
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

/**
 * Netlify Function handler for /strava/auth/status endpoint.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 */
export const stravaAuthStatusHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const result = await stravaAuthStatusSuccess(event).catch((error) =>
    stravaAuthStatusError(error)
  );
  return result;
};

/**
 * Handles successful strava auth callback request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaAuthCallbackSuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  const config = getConfig();
  const request = netlifyEventToRequest(event);
  const response = await stravaAuthCallback(request, config);
  return await webResponseToNetlify(response);
};

/**
 * Handles strava auth callback error.
 *
 * @param {unknown} error - Error object
 * @returns {NetlifyResponse} Error response
 * @internal
 */
const stravaAuthCallbackError = (error: unknown): NetlifyResponse => {
  console.error('Error in strava-auth-callback function:', error);
  const allowedOrigin = getAllowedOrigin();
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

/**
 * Netlify Function handler for /strava/auth/callback endpoint.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 */
export const stravaAuthCallbackHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const result = await stravaAuthCallbackSuccess(event).catch((error) =>
    stravaAuthCallbackError(error)
  );
  return result;
};

/**
 * Handles successful strava logout request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaLogoutSuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  const config = getConfig();
  const request = netlifyEventToRequest(event);
  const response = stravaLogout(request, config);
  return await webResponseToNetlify(response);
};

/**
 * Handles strava logout error.
 *
 * @param {unknown} error - Error object
 * @returns {NetlifyResponse} Error response
 * @internal
 */
const stravaLogoutError = (error: unknown): NetlifyResponse => {
  console.error('Error in strava-logout function:', error);
  const allowedOrigin = getAllowedOrigin();
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

/**
 * Netlify Function handler for /strava/logout endpoint.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 */
export const stravaLogoutHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const result = await stravaLogoutSuccess(event).catch((error) => stravaLogoutError(error));
  return result;
};

/**
 * Handles successful strava activities request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaActivitiesSuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  const config = getConfig();
  const request = netlifyEventToRequest(event);
  const response = await stravaActivities(request, config);
  return await webResponseToNetlify(response);
};

/**
 * Handles strava activities error.
 *
 * @param {unknown} error - Error object
 * @returns {NetlifyResponse} Error response
 * @internal
 */
const stravaActivitiesError = (error: unknown): NetlifyResponse => {
  console.error('Error in strava-activities function:', error);
  const allowedOrigin = getAllowedOrigin();
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

/**
 * Netlify Function handler for /strava/activities endpoint.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 */
export const stravaActivitiesHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const result = await stravaActivitiesSuccess(event).catch((error) =>
    stravaActivitiesError(error)
  );
  return result;
};

/**
 * Handles successful strava activity request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaActivitySuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  const config = getConfig();
  const request = netlifyEventToRequest(event);
  const response = await stravaActivity(request, config);
  return await webResponseToNetlify(response);
};

/**
 * Handles strava activity error.
 *
 * @param {unknown} error - Error object
 * @returns {NetlifyResponse} Error response
 * @internal
 */
const stravaActivityError = (error: unknown): NetlifyResponse => {
  console.error('Error in strava-activity function:', error);
  const allowedOrigin = getAllowedOrigin();
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

/**
 * Netlify Function handler for /strava/activity/:id endpoint.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 */
export const stravaActivityHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const result = await stravaActivitySuccess(event).catch((error) => stravaActivityError(error));
  return result;
};
