#!/usr/bin/env bun

/**
 * UI Server for PACE
 *
 * Provides web endpoints for Strava OAuth authorization and token management.
 */

import getConfig from './get-config';
import {
  handleStravaAuth,
  handleStravaAuthCallback,
  handleRoot,
} from './routes';

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const config = getConfig();

/**
 * Determines content type based on file pathname.
 *
 * @param {string} pathname - File pathname
 * @returns {string} Content type string
 * @internal
 */
const getContentType = (pathname: string): string => {
  if (pathname.endsWith('.js')) {
    return 'application/javascript';
  } else if (pathname.endsWith('.html')) {
    return 'text/html';
  } else {
    return 'text/plain';
  }
};

/**
 * Serves static files from the public directory.
 *
 * @param {Request} request - HTTP request
 * @returns {Promise<Response | null>} File response or null if not found
 */
const serveStaticFile = async (request: Request): Promise<Response | null> => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only serve files from /js/ and root static files
  const isValidPath = pathname.startsWith('/js/') || pathname === '/index.html';
  
  if (!isValidPath) {
    return null;
  } else {
    try {
      const __dirname = fileURLToPath(new URL('.', import.meta.url));
      const publicDir = join(__dirname, '..', '..', 'public');
      const filePath = pathname === '/index.html' 
        ? join(publicDir, 'index.html')
        : join(publicDir, pathname);

      const file = Bun.file(filePath);
      const exists = await file.exists();
      
      if (!exists) {
        return null;
      } else {
        const contentType = getContentType(pathname);

        return new Response(file, {
          headers: {
            'Content-Type': contentType,
          },
        });
      }
    } catch {
      return null;
    }
  }
};

/**
 * Handles incoming HTTP requests.
 *
 * @param {Request} request - HTTP request
 * @returns {Promise<Response>} HTTP response
 * @internal
 */
const handleRequest = async (request: Request): Promise<Response> => {
  // Try to serve static files first
  const staticResponse = await serveStaticFile(request);
  
  if (staticResponse) {
    return staticResponse;
  } else {
    // Handle API routes
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/') {
      return handleRoot(request, config);
    } else if (pathname === '/strava/auth') {
      return handleStravaAuth(request, config);
    } else if (pathname === '/strava/auth/callback') {
      return await handleStravaAuthCallback(request, config);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  }
};

/**
 * Handles server errors.
 *
 * @param {Error} error - Error object
 * @returns {Response} Error response
 * @internal
 */
const handleError = (error: Error): Response => {
  console.error('Server error:', error);
  return new Response('Internal Server Error', { status: 500 });
};

/** 
 * UI dev server instance.
 * Allows to mimic Netlify website behavior on the local machine.
 */
const server = Bun.serve({
  hostname: config.hostname,
  fetch: handleRequest,
  development: {
    hmr: false,
    console: true,
  },
  error: handleError,
});

const serverUrl = `http://${config.hostname}${server.port ? `:${server.port}` : ''}`;

console.log(`🚀 PACE UI Dev Server is running on ${serverUrl}.`);
