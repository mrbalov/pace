import { MOVING_ACTIVITIES } from '../constants';
import { Input } from './types';

/**
 * Determines if a Strava activity is a "moving" activity based on its `type` or `sport_type`.
 *
 * "Moving" activities are those that involve physical geographic movement
 * and are typically have distance and pace metrics.
 *
 * Strava categorizes activities into various types and sport types.
 * This function checks if either the `type` or `sport_type` of the activity matches
 * any of the known moving activities.
 *
 * @param {Input} input - The Strava activity object containing type and sport_type fields.
 * @returns {boolean} - Returns true if the activity is a "moving" activity, false otherwise.
 */
const getIsMovingActivity = ({ type, sport_type }: Input): boolean => {
  const movingActivities = MOVING_ACTIVITIES.map(String);

  return movingActivities.includes(type) || movingActivities.includes(sport_type);
};

export default getIsMovingActivity;
