import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import { apiRequest } from '../client';

/**
 * Fetch specific activity signals by activity ID.
 * @param {string} activityId - Activity ID.
 * @returns {Promise<StravaActivitySignals>} Activity signals.
 */
const fetchActivitySignals = (activityId: string): Promise<StravaActivitySignals> =>
  apiRequest<StravaActivitySignals>(`/strava/activities/${activityId}/signals`);

export default fetchActivitySignals;
