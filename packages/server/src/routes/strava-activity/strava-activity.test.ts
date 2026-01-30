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
    const body = await response.json() as { error: string; message: string };
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
    const body = await response.json() as { error: string; message: string };
    expect(body.error).toBe('Bad Request');
    expect(body.message).toBe('Activity ID is required');
  });

  test('successfully fetches activity with valid ID and tokens', async () => {
    globalThis.fetch = () =>
      Promise.resolve(new Response(
        JSON.stringify({
          id: 123456,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          name: 'Test Activity',
        }),
        { status: 200 }
      ));

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activity/123456', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivity(request, mockConfig);

    expect(response.status).toBe(200);
    const body = await response.json() as { id: number; type: string; sport_type: string; name: string };
    expect(body.id).toBe(123456);
    expect(body.type).toBe('Ride');
    expect(body.sport_type).toBe('MountainBikeRide');
    expect(body.name).toBe('Test Activity');
  });

  test('returns 404 when activity is not found', async () => {
    globalThis.fetch = () => Promise.resolve(new Response('Not Found', { status: 404 }));

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activity/999999', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivity(request, mockConfig);

    expect(response.status).toBe(404);
    const body = await response.json() as { error: string };
    expect(body.error).toBe('Activity not found');
  });

  test('returns 401 when authentication fails', async () => {
    globalThis.fetch = () => Promise.resolve(new Response('Unauthorized', { status: 401 }));

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=invalid-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activity/123456', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivity(request, mockConfig);

    expect(response.status).toBe(401);
    const body = await response.json() as { error: string };
    expect(body.error).toBe('Authentication failed. Token may be expired or invalid.');
  });

  test('returns 400 when activity ID is invalid', async () => {
    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activity/invalid-id', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivity(request, mockConfig);

    expect(response.status).toBe(400);
    const body = await response.json() as { error: string };
    expect(body.error).toBe('Activity ID must be a valid number');
  });
});
