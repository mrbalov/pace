/**
 * Netlify Functions adapter for PACE server routes
 *
 * Provides Netlify-compatible handler functions that wrap the server route handlers.
 */

import { handleStravaAuth, handleStravaAuthCallback } from '../routes';
import { getConfig } from '../config';

/**
 * Netlify Function event type
 */
export type NetlifyEvent = {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string> | null;
  body?: string;
};

/**
 * Netlify Function response type
 */
export type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
};

/**
 * Converts Netlify event to Web API Request
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
 * Converts Web API Response to Netlify response format
 */
const webResponseToNetlify = async (response: Response): Promise<NetlifyResponse> => {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    statusCode: response.status,
    headers,
    body: response.body ? await response.text() : undefined,
  };
};

/**
 * Netlify Function handler for /strava/auth endpoint
 */
export const stravaAuthHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  try {
    const config = getConfig();
    const request = netlifyEventToRequest(event);
    const response = handleStravaAuth(request, config);
    return await webResponseToNetlify(response);
  } catch (error) {
    console.error('Error in strava-auth function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * Netlify Function handler for /strava/auth/callback endpoint
 */
export const stravaAuthCallbackHandler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  try {
    const config = getConfig();
    const request = netlifyEventToRequest(event);
    const response = await handleStravaAuthCallback(request, config);
    return await webResponseToNetlify(response);
  } catch (error) {
    console.error('Error in strava-auth-callback function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
