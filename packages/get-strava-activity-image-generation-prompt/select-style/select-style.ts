import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import { StravaActivityImageGenerationPromptStyle } from '../types';
import { HIGH_INTENSITY_ACTIVITIES } from './constants';

/**
 * Selects visual style for image generation based on activity signals.
 *
 * Style selection is deterministic and based on activity characteristics.
 * Follows the style selection rules from the specification.
 *
 * Style selection rules (deterministic):
 * - High intensity + (Run|Ride|Trail Run) → illustrated
 * - Recovery/easy tags → minimal
 * - High elevation → illustrated
 * - Default → cartoon
 *
 * @param {StravaActivitySignals} signals - Activity signals to base style selection on.
 * @returns {StravaActivityImageGenerationPromptStyle} Selected visual style.
 */
const selectStyle = (
  signals: StravaActivitySignals,
): StravaActivityImageGenerationPromptStyle => {
  const hasRecoveryTag = (
    signals.tags?.includes('recovery')
    || signals.tags?.includes('easy')
  );
  const isMountainous = signals.elevation === 'mountainous';
  const isHighIntensity = signals.intensity === 'high';
  const isHighIntensityActivity = HIGH_INTENSITY_ACTIVITIES.includes(
    signals.activityType,
  );

  if (hasRecoveryTag) {
    return 'minimal';
  } else if (isMountainous) {
    return 'illustrated';
  } else if (isHighIntensity && isHighIntensityActivity) {
    return 'illustrated';
  } else {
    return 'cartoon';
  }
};

export default selectStyle;
