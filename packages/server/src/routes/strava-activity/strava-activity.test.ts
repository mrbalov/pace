import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import stravaActivity from './strava-activity';
import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';

describe('stravaActivity', () => {
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
    successRedirect: '/',
    errorRedirect: '/error',
  };

  const fetchState = { originalFetch: globalThis.fetch };

  beforeEach(() => {
    fetchState.originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = fetchState.originalFetch;
  });

  test('returns 401 when tokens are missing', async () => {
    const request = new Request('http://localhost:3000/strava/activity/123456');
    const response = await stravaActivity(request, mockConfig);

    expect(response.status).toBe(401);
    const body = (await response.json()) as { error: string; message: string };
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toBe('Authentication required. Please authenticate with Strava.');
  });

  test('returns 400 when activity ID is missing', async () => {
    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activity/', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivity(request, mockConfig);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string; message: string };
    expect(body.error).toBe('Bad Request');
    expect(body.message).toBe('Activity ID is required');
  });
});
