import { CLASSIFICATIONS } from '../constants';
import { StravaActivitySignalsElevation } from '../types';
import { Input } from './types';

/**
 * Classifies elevation terrain based on elevation gain.
 *
 * Categorizes terrain as flat, rolling, or mountainous based on
 * total elevation gain from the activity.
 *
 * Classification thresholds:
 * - Flat: < 50m elevation gain
 * - Rolling: 50m - 500m elevation gain
 * - Mountainous: > 500m elevation gain
 *
 * @param {Input} input - Strava activity data containing elevation gain.
 * @returns {StravaActivitySignalsElevation} Elevation classification.
 */
const classifyElevation = ({ total_elevation_gain }: Input): StravaActivitySignalsElevation => {
  if (total_elevation_gain === undefined) {
    return 'flat';
  } else if (total_elevation_gain < CLASSIFICATIONS.ELEVATION.FLAT_THRESHOLD) {
    return 'flat';
  } else if (total_elevation_gain >= CLASSIFICATIONS.ELEVATION.ROLLING_THRESHOLD) {
    return 'mountainous';
  } else {
    return 'rolling';
  }
};

export default classifyElevation;
