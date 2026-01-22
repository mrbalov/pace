/**
 * Netlify Function wrapper for root (/) endpoint
 */

import { handleRoot } from '../../server/routes';
import getConfig from '../../server/config';

export const handler = async (event: any) => {
  try {
    const config = getConfig();
    
    // Build request URL from Netlify event
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const host = event.headers.host || event.headers['x-forwarded-host'];
    const queryString = event.queryStringParameters 
      ? '?' + new URLSearchParams(event.queryStringParameters).toString()
      : '';
    const url = `${protocol}://${host}${event.path}${queryString}`;
    
    const request = new Request(url, {
      method: event.httpMethod || 'GET',
      headers: event.headers,
    });
    
    const response = handleRoot(request, config);
    
    // Convert Response to Netlify format
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    return {
      statusCode: response.status,
      headers,
      body: response.body ? await response.text() : undefined,
    };
  } catch (error) {
    console.error('Error in root function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
