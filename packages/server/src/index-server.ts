#!/usr/bin/env bun

/**
 * Standalone HTTP server for PACE backend
 *
 * Provides web endpoints for Strava OAuth authorization and token management.
 * Can be deployed to any Node.js hosting platform.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { getConfig } from './config';
import { handleStravaAuth, handleStravaAuthCallback } from './routes';

const config = getConfig();

/**
 * Converts Node.js IncomingMessage to Web API Request
 */
const nodeRequestToWebRequest = async (req: IncomingMessage): Promise<Request> => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url || '/'}`;

  // Read body if present
  let body: string | undefined;
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks).toString();
  }

  return new Request(url, {
    method: req.method || 'GET',
    headers: req.headers as HeadersInit,
    body,
  });
};

/**
 * Converts Web API Response to Node.js ServerResponse
 */
const webResponseToNodeResponse = async (
  webResponse: Response,
  nodeResponse: ServerResponse
): Promise<void> => {
  nodeResponse.statusCode = webResponse.status;

  // Copy headers
  webResponse.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });

  // Handle body
  if (webResponse.body) {
    const body = await webResponse.text();
    nodeResponse.end(body);
  } else {
    nodeResponse.end();
  }
};

/**
 * Handles incoming HTTP requests
 */
const requestHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const request = await nodeRequestToWebRequest(req);
    const url = new URL(request.url);
    const pathname = url.pathname;

    let response: Response;

    if (pathname === '/strava/auth') {
      response = handleStravaAuth(request, config);
    } else if (pathname === '/strava/auth/callback') {
      response = await handleStravaAuthCallback(request, config);
    } else {
      response = new Response('Not Found', { status: 404 });
    }

    await webResponseToNodeResponse(response, res);
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};

/**
 * Creates and starts the HTTP server
 */
const createHttpServer = () => {
  const server = createServer(requestHandler);

  const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
  const hostname = config.hostname || '0.0.0.0';

  server.listen(port, hostname, () => {
    console.log(`🚀 PACE Server is running on http://${hostname}:${port}`);
  });

  return server;
};

// Start server if this file is run directly
if (import.meta.main) {
  createHttpServer();
}

export default createHttpServer;
