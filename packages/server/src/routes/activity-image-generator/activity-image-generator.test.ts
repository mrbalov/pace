import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'os';
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

  const testState = { 
    originalFetch: globalThis.fetch,
    testImagesDir: join(tmpdir(), `test-images-${Date.now()}`),
  };

  beforeEach(async () => {
    testState.originalFetch = globalThis.fetch;
    await mkdir(testState.testImagesDir, { recursive: true });
    process.env.IMAGES_DIRECTORY = testState.testImagesDir;
  });

  afterEach(async () => {
    globalThis.fetch = testState.originalFetch;
    delete process.env.IMAGES_DIRECTORY;
    try {
      await rm(testState.testImagesDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
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

  test('successfully processes activity and returns activity, signals, prompt, and image', async () => {
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

    let callCount = 0;
    globalThis.fetch = (async (url: RequestInfo | URL) => {
      callCount++;
      if (callCount === 1) {
        return new Response(JSON.stringify(mockActivity), { status: 200 });
      } else {
        const dialUrl = typeof url === 'string' ? url : url.toString();
        if (dialUrl.includes('ai-proxy.lab.epam.com') && dialUrl.includes('chat/completions')) {
          return new Response(
            JSON.stringify({
              choices: [
                {
                  message: {
                    custom_content: {
                      attachments: [
                        {
                          type: 'image/png',
                          url: 'files/test/image.png',
                        },
                      ],
                    },
                  },
                },
              ],
            }),
            { status: 200 }
          );
        } else if (dialUrl.includes('ai-proxy.lab.epam.com')) {
          return new Response(new TextEncoder().encode('fake-image-data'), {
            status: 200,
            headers: { 'Content-Type': 'image/png' },
          });
        }
        return new Response('Not Found', { status: 404 });
      }
    }) as unknown as typeof fetch;

    process.env.DIAL_KEY = 'test-dial-key';

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
    expect(body.image).toBeDefined();
    expect(body.image.imageUrl).toBeDefined();
    expect(body.image.imageUrl).toMatch(/^http:\/\/localhost:3000\/images\/[a-f0-9-]+\.png$/);
    expect(typeof body.image.usedFallback).toBe('boolean');
    expect(typeof body.image.retriesPerformed).toBe('number');
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

  test('successfully generates image with activity, signals, and prompt', async () => {
    const mockActivity = {
      id: 789012,
      type: 'Run',
      sport_type: 'Run',
      name: 'Morning Run',
      distance: 5000,
      moving_time: 1200,
      total_elevation_gain: 50,
      start_date: '2024-01-02T08:00:00Z',
    };

    let callCount = 0;
    globalThis.fetch = (async (url: RequestInfo | URL) => {
      callCount++;
      if (callCount === 1) {
        return new Response(JSON.stringify(mockActivity), { status: 200 });
      } else {
        const dialUrl = typeof url === 'string' ? url : url.toString();
        if (dialUrl.includes('ai-proxy.lab.epam.com') && dialUrl.includes('chat/completions')) {
          return new Response(
            JSON.stringify({
              choices: [
                {
                  message: {
                    custom_content: {
                      attachments: [
                        {
                          type: 'image/png',
                          url: 'files/test/generated-image.png',
                        },
                      ],
                    },
                  },
                },
              ],
            }),
            { status: 200 }
          );
        } else if (dialUrl.includes('ai-proxy.lab.epam.com')) {
          return new Response(new TextEncoder().encode('fake-image-data'), {
            status: 200,
            headers: { 'Content-Type': 'image/png' },
          });
        }
        return new Response('Not Found', { status: 404 });
      }
    }) as unknown as typeof fetch;

    process.env.DIAL_KEY = 'test-dial-key';

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/789012', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.image).toBeDefined();
    expect(body.image.imageUrl).toMatch(/^http:\/\/localhost:3000\/images\/[a-f0-9-]+\.png$/);
    expect(body.image.usedFallback).toBe(false);
    expect(body.image.retriesPerformed).toBe(0);
  });

  test('returns null image when generation fails but includes activity/signals/prompt', async () => {
    const mockActivity = {
      id: 345678,
      type: 'Ride',
      sport_type: 'Ride',
      name: 'Evening Ride',
      distance: 15000,
      moving_time: 2400,
      total_elevation_gain: 300,
      start_date: '2024-01-03T18:00:00Z',
    };

    let callCount = 0;
    globalThis.fetch = (async (url: RequestInfo | URL) => {
      callCount++;
      if (callCount === 1) {
        return new Response(JSON.stringify(mockActivity), { status: 200 });
      } else {
        const dialUrl = typeof url === 'string' ? url : url.toString();
        if (dialUrl.includes('ai-proxy.lab.epam.com') && dialUrl.includes('chat/completions')) {
          return new Response(
            JSON.stringify({
              error: {
                message: 'DIAL service unavailable',
              },
            }),
            { status: 500 }
          );
        }
        return new Response('Not Found', { status: 404 });
      }
    }) as unknown as typeof fetch;

    process.env.DIAL_KEY = 'test-dial-key';

    const cookies = `${COOKIE_NAMES.ACCESS_TOKEN}=test-access-token; ${COOKIE_NAMES.REFRESH_TOKEN}=test-refresh-token; ${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`;
    const request = new Request('http://localhost:3000/activity-image-generator/345678', {
      headers: {
        Cookie: cookies,
      },
    });
    const response = await activityImageGenerator(request, mockConfig);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.activity).toBeDefined();
    expect(body.activity.id).toBe(345678);
    expect(body.signals).toBeDefined();
    expect(body.prompt).toBeDefined();
    expect(body.image).toBeNull();
  });
});
