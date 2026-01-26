import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fetchActivity from './fetch-activity';
import { ActivityConfig, Activity, ActivityError, ActivityGuardrails } from '../types';

type Case = [
  string,
  {
    activityId: string;
    config: ActivityConfig;
    mockFetch?: () => Promise<Response>;
    shouldThrow: boolean;
    expectedError?: ActivityError;
    expectedActivity?: Activity;
  }
];

const parseError = (error: Error): ActivityError => {
  return JSON.parse(error.message) as ActivityError;
};

describe('fetch-activity', () => {
  const fetchState = { originalFetch: globalThis.fetch };

  beforeEach(() => {
    fetchState.originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = fetchState.originalFetch;
  });

  test.each<Case>([
    [
      'successfully fetches activity with valid ID',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: async () =>
          new Response(
            JSON.stringify({
              id: 123456,
              type: 'Ride',
              sport_type: 'MountainBikeRide',
              name: 'Test Activity',
            }),
            { status: 200 }
          ),
        shouldThrow: false,
        expectedActivity: {
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          id: 123456,
          name: 'Test Activity',
        },
      },
    ],
    [
      'throws error for invalid activity ID',
      {
        activityId: '',
        config: {
          accessToken: 'test-token',
        },
        shouldThrow: true,
        expectedError: {
          code: 'INVALID_ID',
          message: 'Activity ID cannot be empty',
          retryable: false,
        },
      },
    ],
    [
      'throws error for non-numeric activity ID',
      {
        activityId: 'abc',
        config: {
          accessToken: 'test-token',
        },
        shouldThrow: true,
        expectedError: {
          code: 'INVALID_ID',
          message: 'Activity ID must be a valid number',
          retryable: false,
        },
      },
    ],
    [
      'throws error for 404 not found',
      {
        activityId: '999999',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: async () => new Response('Not Found', { status: 404 }),
        shouldThrow: true,
        expectedError: {
          code: 'NOT_FOUND',
          message: 'Activity not found',
          retryable: false,
        },
      },
    ],
    [
      'throws error for 401 unauthorized without refresh token',
      {
        activityId: '123456',
        config: {
          accessToken: 'invalid-token',
        },
        mockFetch: async () => new Response('Unauthorized', { status: 401 }),
        shouldThrow: true,
        expectedError: {
          code: 'UNAUTHORIZED',
          message: 'Authentication failed. Token may be expired or invalid.',
          retryable: false,
        },
      },
    ],
    [
      'refreshes token and retries on 401 with refresh token available',
      {
        activityId: '123456',
        config: {
          accessToken: 'expired-token',
          refreshToken: 'refresh-token-123',
          clientId: 'client-id',
          clientSecret: 'client-secret',
        },
        mockFetch: (() => {
          const callCounter = { count: 0 };
          return async () => {
            callCounter.count = callCounter.count + 1;
            if (callCounter.count === 1) {
              return new Response('Unauthorized', { status: 401 });
            }
            if (callCounter.count === 2) {
              return new Response(
                JSON.stringify({
                  access_token: 'new-access-token',
                }),
                { status: 200 }
              );
            }
            return new Response(
              JSON.stringify({
                id: 123456,
                type: 'Ride',
                sport_type: 'Ride',
              }),
              { status: 200 }
            );
          };
        })(),
        shouldThrow: false,
        expectedActivity: {
          type: 'Ride',
          sport_type: 'Ride',
          id: 123456,
        },
      },
    ],
    [
      'throws error for 403 forbidden',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: async () => new Response('Forbidden', { status: 403 }),
        shouldThrow: true,
        expectedError: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to access this activity',
          retryable: false,
        },
      },
    ],
    [
      'retries on rate limit error',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: (() => {
          const callCounter = { count: 0 };
          return async () => {
            callCounter.count = callCounter.count + 1;
            if (callCounter.count === 1) {
              return new Response('Rate Limited', {
                status: 429,
                headers: {
                  'Retry-After': '0.1',
                },
              });
            }
            return new Response(
              JSON.stringify({
                id: 123456,
                type: 'Ride',
                sport_type: 'Ride',
              }),
              { status: 200 }
            );
          };
        })(),
        shouldThrow: false,
        expectedActivity: {
          type: 'Ride',
          sport_type: 'Ride',
          id: 123456,
        },
      },
    ],
    [
      'retries on server error',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: (() => {
          const callCounter = { count: 0 };
          return async () => {
            callCounter.count = callCounter.count + 1;
            if (callCounter.count === 1) {
              return new Response('Server Error', { status: 500 });
            }
            return new Response(
              JSON.stringify({
                id: 123456,
                type: 'Ride',
                sport_type: 'Ride',
              }),
              { status: 200 }
            );
          };
        })(),
        shouldThrow: false,
        expectedActivity: {
          type: 'Ride',
          sport_type: 'Ride',
          id: 123456,
        },
      },
    ],
    [
      'validates activity with guardrails when provided',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
          guardrails: {
            validateActivity: (activity: Activity) => {
              if (activity.type === 'Ride') {
                return { valid: true };
              }
              return { valid: false, errors: ['Invalid activity type'] };
            },
          } as ActivityGuardrails,
        },
        mockFetch: async () =>
          new Response(
            JSON.stringify({
              id: 123456,
              type: 'Ride',
              sport_type: 'Ride',
            }),
            { status: 200 }
          ),
        shouldThrow: false,
        expectedActivity: {
          type: 'Ride',
          sport_type: 'Ride',
          id: 123456,
        },
      },
    ],
    [
      'throws error when guardrails validation fails',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
          guardrails: {
            validateActivity: (activity: Activity) => {
              return { valid: false, errors: ['Validation failed'] };
            },
          } as ActivityGuardrails,
        },
        mockFetch: async () =>
          new Response(
            JSON.stringify({
              id: 123456,
              type: 'Ride',
              sport_type: 'Ride',
            }),
            { status: 200 }
          ),
        shouldThrow: true,
        expectedError: {
          code: 'VALIDATION_FAILED',
          message: 'Validation failed',
          retryable: false,
        },
      },
    ],
    [
      'handles activity with minimal required fields',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: async () =>
          new Response(
            JSON.stringify({
              id: 123456,
              type: 'Run',
              sport_type: 'Run',
            }),
            { status: 200 }
          ),
        shouldThrow: false,
        expectedActivity: {
          type: 'Run',
          sport_type: 'Run',
          id: 123456,
        },
      },
    ],
    [
      'handles activity with all optional fields',
      {
        activityId: '123456',
        config: {
          accessToken: 'test-token',
        },
        mockFetch: async () =>
          new Response(
            JSON.stringify({
              id: 123456,
              type: 'Ride',
              sport_type: 'Road',
              name: 'Morning Ride',
              description: 'Great ride',
              distance: 50000,
              total_elevation_gain: 500,
              start_date: '2024-01-01T08:00:00Z',
              average_speed: 25.5,
              calories: 800,
            }),
            { status: 200 }
          ),
        shouldThrow: false,
        expectedActivity: {
          type: 'Ride',
          sport_type: 'Road',
          id: 123456,
          name: 'Morning Ride',
          description: 'Great ride',
          distance: 50000,
          elevation_gain: 500,
          start_date: '2024-01-01T08:00:00Z',
          average_speed: 25.5,
          calories: 800,
        },
      },
    ],
  ])('%#. %s', async (_name, { activityId, config, mockFetch, shouldThrow, expectedError, expectedActivity }) => {
    if (mockFetch !== undefined) {
      globalThis.fetch = mockFetch;
    }

    if (shouldThrow) {
      await expect(async () => {
        await fetchActivity(activityId, config);
      }).toThrow();

      try {
        await fetchActivity(activityId, config);
      } catch (error) {
        const parsedError = parseError(error as Error);
        expect(parsedError.code).toStrictEqual(expectedError!.code);
        expect(parsedError.message).toStrictEqual(expectedError!.message);
        if (expectedError!.retryable !== undefined) {
          expect(parsedError.retryable).toStrictEqual(expectedError!.retryable);
        }
      }
    } else {
      const result = await fetchActivity(activityId, config);
      expect(result).toStrictEqual(expectedActivity);
    }
  });
});
