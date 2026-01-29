/**
 * Base API client with cookie-based authentication.
 * Communicates with /packages/server backend.
 * 
 * In development, uses relative URLs to leverage Vite proxy.
 * In production, uses VITE_API_URL if set, otherwise defaults to relative URLs.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new APIError(response.status, error.error || error.message);
  }

  return response.json();
}
