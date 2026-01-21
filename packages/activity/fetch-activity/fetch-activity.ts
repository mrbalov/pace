import { Activity, ActivityConfig, ActivityError } from '../types';
import { MAX_RETRIES, INITIAL_BACKOFF_MS } from '../constants';
import validateActivityId from '../validate-activity-id';
import fetchFromApi from '../fetch-from-api';
import transformResponse from '../transform-response';
import handleRetry from '../handle-retry';
import handleRateLimit from '../handle-rate-limit';
import refreshToken from '../refresh-token';

/**
 * Parses an Error object to extract ActivityError if present.
 *
 * Attempts to parse the error message as JSON to extract structured ActivityError.
 * Returns null if parsing fails or error doesn't contain ActivityError structure.
 *
 * @param {Error} error - Error object potentially containing ActivityError in message
 * @returns {ActivityError | null} ActivityError if successfully parsed, null otherwise
 * @internal
 */
const parseError = (error: Error): ActivityError | null => {
  try {
    return JSON.parse(error.message) as ActivityError;
  } catch {
    return null;
  }
};

/**
 * Fetches and validates a Strava activity by ID.
 *
 * Main entry point for the Activity module. Orchestrates the complete flow:
 * validates activity ID, fetches data from Strava API with retry logic,
 * handles rate limiting and token refresh, transforms the response to internal
 * format, and validates through Activity Guardrails if provided.
 *
 * This function is typically called when a Strava webhook notification is
 * received containing an activity ID, initiating the activity processing pipeline.
 *
 * @param {string} activityId - Activity ID from Strava (typically received via webhook)
 * @param {ActivityConfig} config - Activity module configuration including OAuth tokens and optional guardrails
 * @returns {Promise<Activity>} Promise resolving to validated Activity object in internal format
 * @throws {Error} Throws an error with ActivityError structure for various failure scenarios:
 *   - 'INVALID_ID' (not retryable): Invalid activity ID format
 *   - 'NOT_FOUND' (not retryable): Activity doesn't exist
 *   - 'UNAUTHORIZED' (not retryable): Authentication failed (after refresh attempt if applicable)
 *   - 'FORBIDDEN' (not retryable): Insufficient permissions
 *   - 'RATE_LIMITED' (retryable): Rate limit exceeded (handled with retry)
 *   - 'SERVER_ERROR' (retryable): Strava API server error (handled with retry)
 *   - 'NETWORK_ERROR' (retryable): Network connection failure (handled with retry)
 *   - 'VALIDATION_FAILED' (not retryable): Activity Guardrails validation failed
 *   - 'MALFORMED_RESPONSE' (not retryable): Invalid API response format
 *
 * @remarks
 * The function implements the following flow:
 * 1. Validates activity ID format
 * 2. Fetches from API with automatic retry on retryable errors
 * 3. Handles rate limiting by waiting before retry
 * 4. Attempts token refresh on 401 errors (if refresh token available)
 * 5. Transforms API response to internal format
 * 6. Validates through Activity Guardrails (if provided)
 * 7. Returns validated activity
 *
 * @see {@link https://developers.strava.com/docs/reference/#api-Activities-getActivityById | Strava Get Activity API}
 * @see {@link https://developers.strava.com/docs/webhooks/ | Strava Webhooks}
 *
 * @example
 * ```typescript
 * const activity = await fetchActivity('123456789', {
 *   accessToken: 'abc123',
 *   guardrails: activityGuardrailsInstance
 * });
 * ```
 */
const fetchActivity = async (activityId: string, config: ActivityConfig): Promise<Activity> => {
  validateActivityId(activityId);

  let currentConfig = config;

  const fetchWithRetry = async (): Promise<Activity> => {
    let apiResponse;

    try {
      apiResponse = await fetchFromApi(activityId, currentConfig);
    } catch (error) {
      const activityError = parseError(error as Error);

      if (activityError !== null && activityError.code === 'RATE_LIMITED') {
        // Use the actual response if available, otherwise create a mock with default wait
        const rateLimitResponse = (error as any).response ?? new Response('Rate Limited', {
          status: 429,
          headers: { 'Retry-After': '60' },
        });
        await handleRateLimit(rateLimitResponse);
        throw error;
      }

      if (activityError !== null && activityError.code === 'UNAUTHORIZED') {
        if (currentConfig.refreshToken !== undefined && currentConfig.clientId !== undefined && currentConfig.clientSecret !== undefined) {
          try {
            const newAccessToken = await refreshToken(currentConfig);
            currentConfig = {
              ...currentConfig,
              accessToken: newAccessToken,
            };
            apiResponse = await fetchFromApi(activityId, currentConfig);
          } catch (refreshError) {
            throw error;
          }
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    const activity = transformResponse(apiResponse);

    if (config.guardrails !== undefined) {
      const validationResult = config.guardrails.validateActivity(activity);

      if (!validationResult.valid) {
        const error: ActivityError = {
          code: 'VALIDATION_FAILED',
          message: validationResult.errors?.join(', ') ?? 'Activity validation failed',
          retryable: false,
        };
        throw new Error(JSON.stringify(error));
      }
    }

    return activity;
  };

  return handleRetry(fetchWithRetry, MAX_RETRIES, INITIAL_BACKOFF_MS);
};

export default fetchActivity;
