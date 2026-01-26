/**
 * Vercel serverless adapter for PACE server routes
 *
 * Provides Vercel-compatible handler functions that wrap the server route handlers.
 *
 * Note: Requires @vercel/node package to be installed for type definitions.
 * Install with: bun add @vercel/node
 */

import { handleStravaAuth, handleStravaAuthCallback } from '../routes';
import { getConfig } from '../config';

// Vercel types (optional dependency)
type VercelRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[]>;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
  end: () => void;
};

/**
 * Vercel handler for /strava/auth endpoint
 */
export const stravaAuthHandler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  try {
    const config = getConfig();
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const url = `${protocol}://${host}${req.url || '/strava/auth'}`;

    const request = new Request(url, {
      method: req.method || 'GET',
      headers: req.headers as HeadersInit,
    });

    const response = handleStravaAuth(request, config);

    // Set status code
    res.status(response.status);

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Handle body
    if (response.body) {
      const body = await response.text();
      res.send(body);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Error in strava-auth handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Vercel handler for /strava/auth/callback endpoint
 */
export const stravaAuthCallbackHandler = async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  try {
    const config = getConfig();
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const url = `${protocol}://${host}${req.url || '/strava/auth/callback'}`;

    const request = new Request(url, {
      method: req.method || 'GET',
      headers: req.headers as HeadersInit,
    });

    const response = await handleStravaAuthCallback(request, config);

    // Set status code
    res.status(response.status);

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Handle body
    if (response.body) {
      const body = await response.text();
      res.send(body);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Error in strava-auth-callback handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
