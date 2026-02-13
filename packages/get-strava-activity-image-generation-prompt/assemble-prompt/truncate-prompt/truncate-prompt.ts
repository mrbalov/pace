import { StravaActivitySignals } from '../../types';
import { MAX_PROMPT_LENGTH } from '../../constants';
import {
  QUALITY_KEYWORDS,
  HUMAN_QUALITY_BY_STYLE,
  GENERAL_QUALITY,
} from '../constants';

/**
 * Truncates prompt while preserving quality keywords and core components.
 *
 * Priority order for truncation:
 * 1. Keep quality keywords (critical for image quality)
 * 2. Keep style, subject, human quality, mood (core components)
 * 3. Truncate scene details if needed
 *
 * @param {string} prompt - Prompt.
 * @param {StravaActivitySignals} signals - Strava activity signals.
 * @returns {string} Truncated prompt within character limit.
 */
const truncatePrompt = (
  prompt: string,
  signals: StravaActivitySignals,
): string => {
  if (prompt.length <= MAX_PROMPT_LENGTH) {
    return prompt;
  } else {
    const { core, derived } = signals;
    const qualityKeywords = QUALITY_KEYWORDS[derived.style];
    const humanQuality = HUMAN_QUALITY_BY_STYLE[derived.style];
    const essentialPrompt = [
      qualityKeywords,
      `${derived.style} style`,
      `${derived.subject}${humanQuality}`,
      `${derived.mood} mood`,
    ].join('; ');
    const essentialLength = essentialPrompt.length + GENERAL_QUALITY.length;
    const remainingLength = MAX_PROMPT_LENGTH - essentialLength;

    if (remainingLength <= 0) {
      return `${essentialPrompt}${GENERAL_QUALITY}`;
    } else {
      const restPrompt = [
        `${derived.atmosphere} atmosphere`,
        derived.environment,
        derived.terrain,
        ...core.brands ?? [],
        ...core.semanticContext ?? [],
      ].join('; ');
      const truncatedRestPrompt =
        restPrompt.length > remainingLength
          ? restPrompt.substring(0, Math.max(0, remainingLength - 3)) + '...'
          : restPrompt;

      return `${essentialPrompt}; ${truncatedRestPrompt}; ${GENERAL_QUALITY}`;
    }
  }
};

export default truncatePrompt;
