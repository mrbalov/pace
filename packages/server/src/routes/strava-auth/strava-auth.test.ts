import { describe, test, expect } from 'bun:test';
import stravaAuth from './strava-auth';
import type { ServerConfig } from '../../types';

describe('stravaAuth', () => {
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

  test('redirects to Strava authorization URL', () => {
    const request = new Request('http://localhost:3000/strava/auth');
    const response = stravaAuth(request, mockConfig);

    expect(response.status).toBe(302);
    const location = response.headers.get('Location');
    expect(location).toBeString();
    expect(location).toContain('https://www.strava.com/oauth/authorize');
    expect(location).toContain('client_id=test-client-id');
    expect(location).toContain(
      'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fstrava%2Fauth%2Fcallback',
    );
    expect(location).toContain('scope=activity%3Aread');
  });

  test('redirects to error page on configuration error', () => {
    const invalidConfig: ServerConfig = {
      ...mockConfig,
      strava: {
        ...mockConfig.strava,
        clientId: '', // Invalid: empty client ID
      },
    };

    const request = new Request('http://localhost:3000/strava/auth');
    const response = stravaAuth(request, invalidConfig);

    expect(response.status).toBe(302);
    const location = response.headers.get('Location');
    expect(location).toBe('/error');
  });
});
