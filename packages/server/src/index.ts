/**
 * Main exports for @pace/server package
 */

// Standalone server
export { default as createServer } from './index-server';

// Route handlers
export { handleStravaAuth, handleStravaAuthCallback } from './routes';

// Configuration
export { getConfig } from './config';

// Cookie utilities
export { setTokens, getTokens } from './cookies';

// Types
export type { ServerConfig } from './types';
export { COOKIE_NAMES } from './types';

// Serverless adapters
export * from './adapters';
