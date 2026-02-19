import { StravaActivity } from '@torq/strava-api';

import { apiRequest } from './client';

/**
 * Initiate OAuth flow by redirecting to backend auth endpoint.
 * Uses full URL for redirect (can't use relative URL for window.location.href).
 * @returns {void}
 */
export function authorizeStrava(): void {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  window.location.href = `${apiUrl}/strava/auth`;
}

/**
 * Fetch list of activities for authenticated user.
 * @returns {Promise<StravaActivity[]>} Array of user activities
 */
export async function fetchActivities(): Promise<StravaActivity[]> {
  return apiRequest<StravaActivity[]>('/strava/activities');
}

/**
 * Fetch specific activity by ID.
 * @param {number} id - Activity ID
 * @returns {Promise<StravaActivity>} Activity data
 */
export async function fetchActivity(id: number): Promise<StravaActivity> {
  return apiRequest<StravaActivity>(`/strava/activity/${id}`);
}

/**
 * Fetch specific activity signals by activity ID.
 * @param {number} id - Activity ID.
 * @returns {Promise<StravaActivity>} Activity signals.
 */
export async function fetchActivitySignals(id: number): Promise<StravaActivity> {
  return apiRequest<StravaActivity>(`/strava/activities/${id}/signals`);
}
