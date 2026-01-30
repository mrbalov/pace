import { StravaActivityImagePrompt } from '../../types';
import { CONFIG } from '../../constants';

/**
 *
 * @param activityType
 */
const getStyleIndex = (activityType: string): number => {
  const chars = Array.from(activityType);
  const hash = chars.reduce((acc, char) => {
    const charCode = char.charCodeAt(0);
    const newHash = ((acc << 5) - acc) + charCode;
    return newHash & newHash;
  }, 0);

  return Math.abs(hash) % CONFIG.FALLBACK_STYLES.length;
};

/**
 * Generates a safe fallback prompt for image generation.
 *
 * Creates a minimal, safe prompt using abstract or minimal style when
 * all retry attempts have failed. Uses deterministic style selection based
 * on activity type hash to ensure consistency.
 *
 * @param {string} activityType - Activity type (e.g., 'Run', 'Ride')
 * @returns {StravaActivityImagePrompt} Safe fallback prompt with minimal/abstract style
 *
 * @remarks
 * Fallback prompts are designed to be:
 * - Safe and family-friendly
 * - Simple and generic
 * - Always valid and compliant with guardrails
 * Style selection is deterministic based on activity type.
 *
 * @example
 * ```typescript
 * const fallback = getFallbackPrompt('Run'); // -> { style: 'abstract', mood: 'energetic', ... }
 * ```
 */
const getFallbackPrompt = (activityType: string): StravaActivityImagePrompt => {
  const styleIndex = getStyleIndex(activityType);
  const style = CONFIG.FALLBACK_STYLES[styleIndex] ?? 'abstract';  
  const text = `${style} style, ${CONFIG.FALLBACK_SUBJECT}, ${CONFIG.FALLBACK_MOOD} mood, ${CONFIG.FALLBACK_SCENE}`;
  const textValidated = text.length <= CONFIG.MAX_PROMPT_LENGTH
    ? text
    : text.substring(0, CONFIG.MAX_PROMPT_LENGTH);

  return {
    mood: CONFIG.FALLBACK_MOOD,
    subject: CONFIG.FALLBACK_SUBJECT,
    scene: CONFIG.FALLBACK_SCENE,
    text: textValidated,
    style,
  };
};

export default getFallbackPrompt;
