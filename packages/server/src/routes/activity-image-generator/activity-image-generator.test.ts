import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import activityImageGenerator from './activity-image-generator';
import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';

describe('activityImageGenerator', () => {
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
    const request = new Request('http://localhost:3000/activity-image-generator/123456');
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toBe('Authentication required. Please authenticate with Strava.');
  });

  test('returns 400 when activity ID is missing', async () => {
    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Bad Request');
    expect(body.message).toBe('Activity ID is required');
  });

  test('successfully processes activity and returns activity, signals, and prompt', async () => {
    const mockActivity = {
      id: 123456,
      type: 'Ride',
      sport_type: 'MountainBikeRide',
      name: 'Test Activity',
      distance: 10000,
      moving_time: 1800,
      total_elevation_gain: 200,
      start_date: '2024-01-01T10:00:00Z',
    };

    globalThis.fetch = (async () =>
      new Response(JSON.stringify(mockActivity), { status: 200 })) as unknown as typeof fetch;

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/123456', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.activity).toBeDefined();
    expect(body.activity.id).toBe(123456);
    expect(body.signals).toBeDefined();
    expect(body.signals.activityType).toBe('MountainBikeRide');
    expect(body.signals.intensity).toBeDefined();
    expect(body.signals.elevation).toBeDefined();
    expect(body.signals.timeOfDay).toBeDefined();
    expect(body.prompt).toBeDefined();
    expect(body.prompt.style).toBeDefined();
    expect(body.prompt.mood).toBeDefined();
    expect(body.prompt.subject).toBeDefined();
    expect(body.prompt.scene).toBeDefined();
    expect(body.prompt.text).toBeDefined();
  });

  test('returns 404 when activity is not found', async () => {
    globalThis.fetch = (async () => new Response('Not Found', { status: 404 })) as unknown as typeof fetch;

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/999999', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe('Activity not found');
  });

  test('returns 401 when authentication fails', async () => {
    globalThis.fetch = (async () => new Response('Unauthorized', { status: 401 })) as unknown as typeof fetch;

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=invalid-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/123456', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Authentication failed. Token may be expired or invalid.');
  });

  test('returns 400 when activity ID is invalid', async () => {
    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/invalid-id', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Activity ID must be a valid number');
  });
});
