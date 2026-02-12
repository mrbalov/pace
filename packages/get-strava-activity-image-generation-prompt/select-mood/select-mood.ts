import { StravaActivitySignals } from '@pace/get-strava-activity-signals';
import { StravaActivityImageGenerationPromptMood } from '../types';

/**
 * Selects mood descriptor based on activity signals.
 *
 * Mood selection is deterministic and aligns with activity characteristics.
 * Priority: tags → intensity.
 *
 * Mood selection priority:
 * 1. Tag signals (recovery → calm, race → intense)
 * 2. Intensity level (low → calm, high → intense)
 *
 * @param {StravaActivitySignals} signals - Activity signals to base mood selection on.
 * @returns {StravaActivityImageGenerationPromptMood} Mood descriptor (e.g., "calm", "intense", "focused").
 */
const selectMood = (
  signals: StravaActivitySignals,
): StravaActivityImageGenerationPromptMood => {
  const hasRecoveryTag = signals.tags?.includes('recovery');
  const hasRaceTag = signals.tags?.includes('race');
  const hasCommuteTag = signals.tags?.includes('commute');
  const hasWithKidTag = signals.tags?.includes('with kid');
  const isLowIntensity = signals.intensity === 'low';
  const isHighIntensity = signals.intensity === 'high';
  const isMediumIntensity = signals.intensity === 'medium';

  if (hasRecoveryTag) {
    return 'calm';
  } else if (hasRaceTag) {
    return 'intense';
  } else if (hasCommuteTag) {
    return 'routine';
  } else if (hasWithKidTag) {
    return 'playful';
  } else if (isLowIntensity) {
    return 'calm';
  } else if (isHighIntensity) {
    return 'intense';
  } else if (isMediumIntensity) {
    return 'focused';
  } else {
    return 'focused';
  }
};

export default selectMood;
