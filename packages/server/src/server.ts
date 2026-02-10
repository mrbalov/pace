#!/usr/bin/env bun

/**
 * Standalone HTTP server for PACE backend
 *
 * Provides web endpoints for Strava OAuth authorization and token management.
 * Can be deployed to any Node.js hosting platform.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { getConfig } from './config';
import {
  stravaAuth,
  stravaAuthCallback,
  stravaAuthStatus,
  stravaActivity,
  stravaActivities,
  stravaLogout,
  activityImageGenerator,
} from './routes';

const config = getConfig();

/**
 * Reads request body chunks from stream.
 *
 * @param {IncomingMessage} req - Node.js incoming message
 * @returns {Promise<string>} Request body as string
 * @internal
 */
const readBodyChunks = async (req: IncomingMessage): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString();
};

/**
 * Reads request body from IncomingMessage stream.
 *
 * @param {IncomingMessage} req - Node.js incoming message
 * @returns {Promise<string | undefined>} Request body as string, or undefined if no body
 * @internal
 */
const readRequestBody = async (req: IncomingMessage): Promise<string | undefined> => {
  const hasBody = req.method !== undefined && req.method !== 'GET' && req.method !== 'HEAD';

  if (!hasBody) {
    return undefined;
  } else {
    return await readBodyChunks(req);
  }
};

/**
 * Converts Node.js IncomingMessage to Web API Request.
 *
 * @param {IncomingMessage} req - Node.js incoming message
 * @returns {Promise<Request>} Web API Request object
 * @internal
 */
const nodeRequestToWebRequest = async (req: IncomingMessage): Promise<Request> => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host ?? 'localhost';
  const url = `${String(protocol)}://${String(host)}${req.url ?? '/'}`;
  const body = await readRequestBody(req);

  return new Request(url, {
    method: req.method ?? 'GET',
    headers: req.headers as HeadersInit,
    body,
  });
};

/**
 * Gets the allowed origin for CORS based on environment.
 *
 * @returns {string} Allowed origin URL
 * @internal
 */
const getAllowedOrigin = (): string =>
  // Allow UI origin from environment variable, default to localhost:3001 for dev
  process.env.UI_ORIGIN ?? 'http://localhost:3001';
/**
 * Adds CORS headers to response.
 *
 * @param {ServerResponse} nodeResponse - Node.js server response object
 * @returns {void}
 * @internal
 */
const addCorsHeaders = (nodeResponse: ServerResponse): void => {
  const origin = getAllowedOrigin();
  nodeResponse.setHeader('Access-Control-Allow-Origin', origin);
  nodeResponse.setHeader('Access-Control-Allow-Credentials', 'true');
  nodeResponse.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  nodeResponse.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

/**
 * Checks if Content-Type represents binary data.
 *
 * @param {string | null} contentType - Content-Type header value
 * @returns {boolean} True if binary content type
 * @internal
 */
const isBinaryContentType = (contentType: string | null): boolean => {
  if (!contentType) {
    return false;
  }

  const binaryTypes = [
    'image/',
    'video/',
    'audio/',
    'application/octet-stream',
    'application/pdf',
    'application/zip',
  ];

  return binaryTypes.some((type) => contentType.toLowerCase().startsWith(type));
};

/**
 * Converts Web API Response to Node.js ServerResponse.
 *
 * @param {Response} webResponse - Web API Response object
 * @param {ServerResponse} nodeResponse - Node.js server response object
 * @returns {Promise<void>} Promise that resolves when response is sent
 * @internal
 */
const webResponseToNodeResponse = async (
  webResponse: Response,
  nodeResponse: ServerResponse,
): Promise<void> => {
  nodeResponse.statusCode = webResponse.status;

  // Add CORS headers
  addCorsHeaders(nodeResponse);

  // Handle Set-Cookie headers separately to preserve multiple cookies
  const setCookieHeaders = webResponse.headers.getSetCookie();
  for (const cookie of setCookieHeaders) {
    nodeResponse.appendHeader('Set-Cookie', cookie);
  }

  // Copy other headers (excluding Set-Cookie which we handled above)
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      nodeResponse.setHeader(key, value);
    }
  });

  // Handle body
  const hasBody = webResponse.body !== null;
  if (hasBody) {
    const contentType = webResponse.headers.get('Content-Type');

    if (isBinaryContentType(contentType)) {
      // For binary content, use arrayBuffer to preserve data integrity
      const arrayBuffer = await webResponse.arrayBuffer();
      nodeResponse.end(Buffer.from(arrayBuffer));
    } else {
      // For text content, use text() for proper encoding
      const body = await webResponse.text();
      nodeResponse.end(body);
    }
  } else {
    nodeResponse.end();
  }
};

/**
 * Checks if pathname matches /strava/activity/:id pattern.
 *
 * @param {string} pathname - Request pathname
 * @returns {boolean} True if pathname matches the pattern
 * @internal
 */
const matchesActivityRoute = (pathname: string): boolean => {
  const pathParts = pathname.split('/').filter((part) => part !== '');
  return pathParts.length === 3 && pathParts[0] === 'strava' && pathParts[1] === 'activity';
};

/**
 * Checks if pathname matches /activity-image-generator/:id pattern.
 *
 * @param {string} pathname - Request pathname
 * @returns {boolean} True if pathname matches the pattern
 * @internal
 */
const matchesActivityImageGeneratorRoute = (pathname: string): boolean => {
  const pathParts = pathname.split('/').filter((part) => part !== '');
  return pathParts.length === 2 && pathParts[0] === 'activity-image-generator';
};

/**
 * Handles route matching and returns appropriate response.
 *
 * @param {Request} request - Web API request
 * @returns {Promise<Response>} Response for the matched route
 * @internal
 */
const handleRoute = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const promise =
    pathname === '/strava/auth'
      ? Promise.resolve(stravaAuth(request, config))
      : pathname === '/strava/auth/callback'
        ? stravaAuthCallback(request, config)
        : pathname === '/strava/auth/status'
          ? Promise.resolve(stravaAuthStatus(request, config))
          : pathname === '/strava/logout'
            ? Promise.resolve(stravaLogout(request, config))
            : pathname === '/strava/activities'
              ? stravaActivities(request, config)
              : matchesActivityRoute(pathname)
                ? stravaActivity(request, config)
                : matchesActivityImageGeneratorRoute(pathname)
                  ? activityImageGenerator(request, config)
                  : Promise.resolve(new Response('Not Found', { status: 404 }));

  return await promise;
};

/**
 * Handles server errors by sending error response.
 *
 * @param {unknown} error - Error object
 * @param {ServerResponse} res - Node.js server response
 * @returns {void}
 * @internal
 */
const handleServerError = (error: unknown, res: ServerResponse): void => {
  console.error('Server error:', error);
  res.statusCode = 500;
  res.end('Internal Server Error');
};

/**
 * Processes request and returns response or null on error.
 *
 * @param {IncomingMessage} req - Node.js incoming message
 * @returns {Promise<Response | null>} Response if successful, null if error occurred
 * @internal
 */
const processRequest = async (req: IncomingMessage): Promise<Response | null> =>
  await (async () => {
    try {
      const request = await nodeRequestToWebRequest(req);
      return await handleRoute(request);
    } catch (error) {
      console.error('Server error:', error);
      return null;
    }
  })();

/**
 * Handles incoming HTTP requests.
 *
 * @param {IncomingMessage} req - Node.js incoming message
 * @param {ServerResponse} res - Node.js server response
 * @returns {Promise<void>} Promise that resolves when request is handled
 * @internal
 */
const requestHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  // Handle OPTIONS preflight requests for CORS
  if (req.method === 'OPTIONS') {
    addCorsHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  const response = await processRequest(req);

  if (response === null) {
    handleServerError(new Error('Request processing failed'), res);
  } else {
    await webResponseToNodeResponse(response, res);
  }
};

/**
 * Creates and starts the HTTP server.
 *
 * @returns {ReturnType<typeof createServer>} HTTP server instance
 */
const createHttpServer = (): ReturnType<typeof createServer> => {
  const server = createServer((req, res) => {
    void requestHandler(req, res);
  });

  const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
  const hostname = config.hostname ?? '0.0.0.0';

  server.listen(port, hostname, () => {
    console.info(`🚀 PACE Server is running on http://${hostname}:${port}`);
  });

  return server;
};

// Start server if this file is run directly
if (import.meta.main) {
  createHttpServer();
}

export default createHttpServer;
