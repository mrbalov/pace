import { apiRequest } from './client';

export interface Activity {
  id: number;
  type: string;
  sport_type: string;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  total_elevation_gain: number | null;
}

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
 * @returns {Promise<Activity[]>} Array of user activities
 */
export async function fetchActivities(): Promise<Activity[]> {
  return apiRequest<Activity[]>('/strava/activities');
}

/**
 * Fetch specific activity by ID.
 * @param {number} id - Activity ID
 * @returns {Promise<Activity>} Activity data
 */
export async function fetchActivity(id: number): Promise<Activity> {
  return apiRequest<Activity>(`/strava/activity/${id}`);
}

/**
 * Fetch specific activity signals by activity ID.
 * @param {number} id - Activity ID.
 * @returns {Promise<Activity>} Activity signals.
 */
export async function fetchActivitySignals(id: number): Promise<Activity> {
  return apiRequest<Activity>(`/strava/activities/${id}/signals`);
}
