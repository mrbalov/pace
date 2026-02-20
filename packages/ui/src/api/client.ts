/**
 * Base API client with cookie-based authentication.
 * Communicates with /packages/server backend.
 *
 * Requests to /strava/* are proxied to the backend via next.config.mjs rewrites.
 * NEXT_PUBLIC_API_URL is only needed when running without the Next.js server proxy.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Custom error class for API request failures.
 */
export class APIError extends Error {
  /**
   * Creates an API error with HTTP status code.
   * @param {number} status - HTTP status code
   * @param {string} message - Error message
   */
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Makes an authenticated API request to the backend.
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<T>} Response data
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ error: response.statusText }))) as {
      error?: string;
      message?: string;
    };
    throw new APIError(response.status, error.error ?? error.message ?? 'Unknown error');
  }

  return response.json() as Promise<T>;
}
