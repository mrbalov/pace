import { StravaActivitySignals } from '../types';
import truncatePrompt from './truncate-prompt';
import {
  QUALITY_KEYWORDS,
  HUMAN_QUALITY_BY_STYLE,
  GENERAL_QUALITY,
} from './constants';

/**
 * Assembles final prompt text from prompt components with quality-enhancing keywords.
 *
 * Constructs the complete prompt text within character limit, including:
 * - Style-specific quality keywords (professional, polished, elegant, etc.)
 * - Human anatomy quality terms (anatomically correct, well-proportioned)
 * - General quality keywords (high quality, sharp, beautiful)
 *
 * Quality keywords address:
 * - Style-specific art direction (professional editorial illustration, modern animation style, etc.)
 * - Human quality terms (style-appropriate: character design for cartoon, professional anatomy for illustrated)
 * - Visual appeal and overall quality (high quality, sharp, beautiful)
 *
 * If over character limit, truncates scene details first while preserving quality keywords.
 *
 * @param {StravaActivitySignals} signals - Strava activity signals.
 * @returns {string} Assembled prompt text (max 600 characters).
 */
const assemblePrompt = (signals: StravaActivitySignals): string => {
  const { core, derived } = signals;
  const qualityKeywords = QUALITY_KEYWORDS[derived.style];
  const humanQuality = HUMAN_QUALITY_BY_STYLE[derived.style];
  const prompt = [
    qualityKeywords,
    `${derived.style} style`,
    `${derived.subject}${humanQuality}`,
    `${derived.mood} mood`,
    `${derived.atmosphere} atmosphere`,
    derived.environment,
    derived.terrain,
    ...core.brands ?? [],
    ...core.semanticContext ?? [],
    GENERAL_QUALITY,
  ].join('; ');

  return truncatePrompt(prompt, signals);
};

export default assemblePrompt;
