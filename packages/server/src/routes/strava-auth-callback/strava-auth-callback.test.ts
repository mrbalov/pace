import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import stravaAuthCallback from './strava-auth-callback';
import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';

describe('stravaAuthCallback', () => {
  const mockConfig: ServerConfig = {
    hostname: 'localhost',
    strava: {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'http://localhost:3000/strava/auth/callback',
      scope: 'activity:read',
    },
    cookies: {
      secure: false,
      sameSite: 'lax',
    },
    successRedirect: '/success',
    errorRedirect: '/error',
  };

  const fetchState = { originalFetch: globalThis.fetch };

  beforeEach(() => {
    fetchState.originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = fetchState.originalFetch;
  });

  test('exchanges code for tokens and sets cookies', async () => {
    const mockTokens = {
      access_token: 'access-token-123',
      refresh_token: 'refresh-token-123',
      expires_at: 1234567890,
      expires_in: 21600,
      token_type: 'Bearer',
    };

    globalThis.fetch = (() =>
      Promise.resolve(
        new Response(JSON.stringify(mockTokens), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )) as unknown as typeof fetch;

    const request = new Request('http://localhost:3000/strava/auth/callback?code=auth-code-123');
    const response = await stravaAuthCallback(request, mockConfig);

    expect(response.status).toBe(302);
    const location = response.headers.get('Location');
    expect(location).toBe('/success');

    // Check cookies are set
    const setCookieHeaders = response.headers.getSetCookie();
    expect(setCookieHeaders.length).toBeGreaterThan(0);

    const cookies = setCookieHeaders.join('; ');
    expect(cookies).toContain(COOKIE_NAMES.ACCESS_TOKEN);
    expect(cookies).toContain(COOKIE_NAMES.REFRESH_TOKEN);
    expect(cookies).toContain(COOKIE_NAMES.TOKEN_EXPIRES_AT);
    expect(cookies).toContain('access-token-123');
    expect(cookies).toContain('refresh-token-123');
  });

  test('redirects to error page when code is missing', async () => {
    const request = new Request('http://localhost:3000/strava/auth/callback');
    const response = await stravaAuthCallback(request, mockConfig);

    expect(response.status).toBe(302);
    const location = response.headers.get('Location');
    expect(location).toBe('/error');
  });

  test('redirects to error page when OAuth error is present', async () => {
    const request = new Request('http://localhost:3000/strava/auth/callback?error=access_denied');
    const response = await stravaAuthCallback(request, mockConfig);

    expect(response.status).toBe(302);
    const location = response.headers.get('Location');
    expect(location).toBe('/error');
  });

  test('redirects to error page when token exchange fails', async () => {
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response('Unauthorized', {
          status: 401,
        }),
      )) as unknown as typeof fetch;

    const request = new Request('http://localhost:3000/strava/auth/callback?code=invalid-code');
    const response = await stravaAuthCallback(request, mockConfig);

    expect(response.status).toBe(302);
    const location = response.headers.get('Location');
    expect(location).toBe('/error');
  });
});
