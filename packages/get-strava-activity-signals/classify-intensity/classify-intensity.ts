import { StravaActivitySignalsIntensity } from '../types';
import { CLASSIFICATIONS } from '../constants';
import { Input } from './types';
import getPaceSecondsPerKm from '../get-pace-seconds-per-km';

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
 * @param {Input} input - Strava activity data to classify.
 * @returns {StravaActivitySignalsIntensity} Intensity classification.
 */
const classifyIntensity = ({
  average_watts,
  weighted_average_watts,
  distance,
  moving_time,
}: Input): StravaActivitySignalsIntensity => {
  const hasPower = average_watts !== undefined;
  const hasWeightedPower = weighted_average_watts !== undefined;
  const hasPaceData = distance !== undefined && moving_time !== undefined && distance > 0;
  const paceSecondsPerKm = hasPaceData ? getPaceSecondsPerKm(moving_time, distance) : 0;

  if (hasPaceData && paceSecondsPerKm >= CLASSIFICATIONS.INTENSITY.LOW_PACE_THRESHOLD) {
    return 'low';
  } else if (hasPaceData && paceSecondsPerKm <= CLASSIFICATIONS.INTENSITY.HIGH_PACE_THRESHOLD) {
    return 'high';
  } else if (hasPower && average_watts! > 250) {
    return 'high';
  } else if (hasPower && average_watts! < 150) {
    return 'low';
  } else if (hasWeightedPower && weighted_average_watts! > 250) {
    return 'high';
  } else if (hasWeightedPower && weighted_average_watts! < 150) {
    return 'low';
  } else {
    return 'medium';
  }
};

export default classifyIntensity;
