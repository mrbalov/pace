import sanitizeText from '../sanitize-text';
import { KEYWORDS } from './constants';

/**
 * Extracts safe semantic signals from user-provided text fields in Strava activities.
 *
 * Processes text from activity name, description, gear fields etc.
 * to extract safe semantic context. Never copies text verbatim.
 *
 * User-provided text is sanitized and processed to extract semantic
 * signals that can safely influence prompt generation. Forbidden
 * content is removed, and only safe, normalized signals are returned.
 *
 * In a future implementation, we might extract activity-related keywords
 * like "trail", "road", "track", "indoor", "outdoor", etc.
 *
 * @param {string} text - User-provided text to extract signals from.
 * @returns {string[]} Array of safe semantic signal strings or undefined if none found.
 */
const extractTextSignals = (text: string): string[] | undefined => {
  const textSanitized = sanitizeText(text.trim().toLowerCase());
  const hasTextSanitized = textSanitized.length > 0;

  if (hasTextSanitized) {
    return KEYWORDS.map((keyword) => {
      if (textSanitized.includes(keyword)) {
        return keyword;
      } else {
        return '';
      }
    }).filter(Boolean);
  } else {
    return undefined;
  }
};

export default extractTextSignals;
