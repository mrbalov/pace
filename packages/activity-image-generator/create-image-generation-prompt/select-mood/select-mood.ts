import { StravaActivitySignals } from '../../types';

/**
 * Selects mood descriptor based on activity signals.
 *
 * Mood selection is deterministic and aligns with activity characteristics.
 * Priority: tags → intensity → weather.
 * 
 * Mood selection priority:
 * 1. Tag signals (recovery → calm, race → intense)
 * 2. Intensity level (low → calm, high → intense)
 * 3. Weather conditions (sunny → energetic, rainy → contemplative)
 *
 * @param {StravaActivitySignals} signals - Activity signals to base mood selection on
 * @returns {string} Mood descriptor (e.g., "calm", "intense", "focused")
 */
const selectMood = (signals: StravaActivitySignals): string => {
  const hasRecoveryTag = signals.tags.includes('recovery');
  const hasRaceTag = signals.tags.includes('race');
  const hasCommuteTag = signals.tags.includes('commute');
  const hasWithKidTag = signals.tags.includes('with kid');
  const isSunny = signals.weather === 'sunny';
  const isRainy = signals.weather === 'rainy';
  const isFoggy = signals.weather === 'foggy';
  const isLowIntensity = signals.intensity === 'low';
  const isHighIntensity = signals.intensity === 'high';
  const isMediumIntensity = signals.intensity === 'medium';
  
  const result = (() => {
    // Priority 1: Tag-based mood
    if (hasRecoveryTag) {
      return 'calm';
    } else if (hasRaceTag) {
      return 'intense';
    } else if (hasCommuteTag) {
      return 'routine';
    } else if (hasWithKidTag) {
      return 'playful';
    } else if (isSunny) {
      // Priority 2: Weather-based mood (before intensity, as per spec)
      return 'energetic';
    } else if (isRainy) {
      return 'contemplative';
    } else if (isFoggy) {
      return 'mysterious';
    } else if (isLowIntensity) {
      // Priority 3: Intensity-based mood
      return 'calm';
    } else if (isHighIntensity) {
      return 'intense';
    } else if (isMediumIntensity) {
      return 'focused';
    } else {
      // Default mood
      return 'focused';
    }
  })();
  
  return result;
};

export default selectMood;
