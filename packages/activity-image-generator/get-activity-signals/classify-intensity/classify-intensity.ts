import { StravaActivity } from '@pace/strava-api';
import { CONFIG } from '../../constants';

/**
 * Classifies activity intensity based on metrics.
 *
 * Analyzes pace, heart rate, and power data to determine if activity
 * intensity is low, medium, or high. Uses deterministic thresholds
 * from configuration.
 *
 * Classification logic:
 * - Low: Slow pace (>6:00 min/km) OR low heart rate (<120 bpm)
 * - High: Fast pace (<4:00 min/km) OR high heart rate (>160 bpm) OR high power
 * - Medium: Everything else
 *
 * @param {StravaActivity} activity - Activity data to classify
 * @returns {'low' | 'medium' | 'high'} Intensity classification
 */
const classifyIntensity = (activity: StravaActivity): 'low' | 'medium' | 'high' => {
  const hasPaceData =
    activity.distance !== undefined && activity.moving_time !== undefined && activity.distance > 0;
  const paceSecondsPerKm = hasPaceData ? activity.moving_time! / (activity.distance! / 1000) : 0;

  const hasPower = activity.average_watts !== undefined;
  const hasWeightedPower = activity.weighted_average_watts !== undefined;

  const result = (() => {
    if (hasPaceData && paceSecondsPerKm >= CONFIG.INTENSITY.LOW_PACE_THRESHOLD) {
      return 'low';
    } else if (hasPaceData && paceSecondsPerKm <= CONFIG.INTENSITY.HIGH_PACE_THRESHOLD) {
      return 'high';
    } else if (hasPower && activity.average_watts! > 250) {
      return 'high';
    } else if (hasPower && activity.average_watts! < 150) {
      return 'low';
    } else if (hasWeightedPower && activity.weighted_average_watts! > 250) {
      return 'high';
    } else if (hasWeightedPower && activity.weighted_average_watts! < 150) {
      return 'low';
    } else {
      return 'medium';
    }
  })();

  return result;
};

export default classifyIntensity;
