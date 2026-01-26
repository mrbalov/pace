/**
 * Netlify Functions adapter for PACE server routes
 *
 * Provides Netlify-compatible handler functions that wrap the server route handlers.
 */

import { stravaAuth, stravaAuthCallback } from '../routes';
import { getConfig } from '../config';

/**
 * Netlify Function event type.
 */
export type NetlifyEvent = {
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
};

/**
 * Netlify Function response type.
 */
export type NetlifyResponse = {
  /**
   * HTTP status code.
   */
  statusCode: number;
  /**
   * Response headers.
   */
  headers: Record<string, string>;
  /**
   * Response body.
   */
  body?: string;
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
  const queryString = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : '';
  const url = `${protocol}://${host}${event.path}${queryString}`;

  return new Request(url, {
    method: event.httpMethod || 'GET',
    headers: event.headers,
    body: event.body,
  });
};

/**
 * Converts Web API Response to Netlify response format.
 *
 * @param {Response} response - Web API Response object
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const webResponseToNetlify = async (response: Response): Promise<NetlifyResponse> => {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const hasBody = response.body !== null;
  const body = hasBody ? await response.text() : undefined;

  return {
    statusCode: response.status,
    headers,
    body,
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
  return {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
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
 * Handles successful strava auth callback request.
 *
 * @param {NetlifyEvent} event - Netlify function event
 * @returns {Promise<NetlifyResponse>} Netlify function response
 * @internal
 */
const stravaAuthCallbackSuccess = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
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
  return {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
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
