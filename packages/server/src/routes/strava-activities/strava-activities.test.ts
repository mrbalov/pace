import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';
import { type StravaActivity } from '@torq/strava-api';

describe('stravaActivities', () => {
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

  let mockFetchStravaActivities: ReturnType<typeof mock>;

  beforeEach(() => {
    mockFetchStravaActivities = mock(() => Promise.resolve([] as StravaActivity[]));
    void mock.module('@torq/strava-api', () => ({
      fetchStravaActivities: mockFetchStravaActivities,
      fetchStravaActivity: mock(() => Promise.resolve(null)),
    }));
  });

  afterEach(() => {
    mock.restore();
  });

  test('returns 401 when tokens are missing', async () => {
    const { default: stravaActivities } = await import('./strava-activities');
    const request = new Request('http://localhost:3000/strava/activities');
    const response = await stravaActivities(request, mockConfig);

    expect(response.status).toBe(401);
    const body = (await response.json()) as { error: string; message: string };
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toBe('Authentication required. Please authenticate with Strava.');
  });

  test('successfully fetches activities with valid tokens', async () => {
    const { default: stravaActivities } = await import('./strava-activities');
    const mockActivities: StravaActivity[] = [
      {
        id: 123456,
        type: 'Ride',
        sport_type: 'MountainBikeRide',
        name: 'Test Activity 1',
        distance: 10000,
        moving_time: 3600,
        elapsed_time: 3800,
        start_date: '2024-01-01T10:00:00Z',
        total_elevation_gain: 500,
      },
      {
        id: 123457,
        type: 'Run',
        sport_type: 'Run',
        name: 'Test Activity 2',
        distance: 5000,
        moving_time: 1800,
        elapsed_time: 1900,
        start_date: '2024-01-02T08:00:00Z',
        total_elevation_gain: 100,
      },
    ];

    mockFetchStravaActivities.mockResolvedValue(mockActivities);

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activities', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivities(request, mockConfig);

    expect(response.status).toBe(200);
    const body = (await response.json()) as StravaActivity[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(body[0].id).toBe(123456);
    expect(body[0].type).toBe('Ride');
    expect(body[1].id).toBe(123457);
    expect(body[1].type).toBe('Run');
  });

  test('returns 403 when insufficient permissions', async () => {
    const { default: stravaActivities } = await import('./strava-activities');
    const error = new Error(
      JSON.stringify({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions to access activities',
        retryable: false,
      }),
    );
    mockFetchStravaActivities.mockRejectedValue(error);

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activities', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivities(request, mockConfig);

    expect(response.status).toBe(403);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe('Insufficient permissions to access activities');
  });

  test('returns 429 when rate limited', async () => {
    const { default: stravaActivities } = await import('./strava-activities');
    const error = new Error(
      JSON.stringify({
        code: 'RATE_LIMITED',
        message: 'Rate limit exceeded. Please try again later.',
        retryable: true,
      }),
    );
    mockFetchStravaActivities.mockRejectedValue(error);

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activities', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivities(request, mockConfig);

    expect(response.status).toBe(429);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe('Rate limit exceeded. Please try again later.');
  });

  test('returns 500 when server error occurs', async () => {
    const { default: stravaActivities } = await import('./strava-activities');
    const error = new Error(
      JSON.stringify({
        code: 'SERVER_ERROR',
        message: 'Strava API server error',
        retryable: true,
      }),
    );
    mockFetchStravaActivities.mockRejectedValue(error);

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activities', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivities(request, mockConfig);

    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe('Strava API server error');
  });

  test('handles network errors gracefully', async () => {
    const { default: stravaActivities } = await import('./strava-activities');
    const error = new Error(
      JSON.stringify({
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to Strava API',
        retryable: true,
      }),
    );
    mockFetchStravaActivities.mockRejectedValue(error);

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/strava/activities', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await stravaActivities(request, mockConfig);

    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe('Failed to connect to Strava API');
  });
});
