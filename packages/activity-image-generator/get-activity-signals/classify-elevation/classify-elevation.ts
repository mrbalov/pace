import { StravaActivity } from '@pace/strava-api';
import { CONFIG } from '../../constants';

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
 * @param {StravaActivity} activity - Activity data to classify
 * @returns {'flat' | 'rolling' | 'mountainous'} Elevation classification
 */
const classifyElevation = (activity: StravaActivity): 'flat' | 'rolling' | 'mountainous' => {
  const elevationGain = activity.total_elevation_gain;
  
  const result = (() => {
    if (elevationGain === undefined) {
      return 'flat';
    } else if (elevationGain < CONFIG.ELEVATION.FLAT_THRESHOLD) {
      return 'flat';
    } else if (elevationGain >= CONFIG.ELEVATION.ROLLING_THRESHOLD) {
      return 'mountainous';
    } else {
      return 'rolling';
    }
  })();
  
  return result;
};

export default classifyElevation;
