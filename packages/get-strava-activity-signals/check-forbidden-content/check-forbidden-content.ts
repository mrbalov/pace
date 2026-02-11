import { PATTERNS } from './constants';

/**
 * Checks if text contains forbidden content patterns.
 *
 * Forbidden content includes:
 * - Real persons or identifiable individuals
 * - Political or ideological symbols
 * - Explicit violence or sexual content
 * - Military or combat scenes
 * - Text/captions/typography instructions
 *
 * @param {string} text - Text to check for forbidden content.
 * @returns {boolean} True if forbidden content detected, false otherwise.
 */
const checkForbiddenContent = (text: string): boolean => {
  const lowerText = text.toLowerCase();

  return PATTERNS.some((pattern) => pattern.test(lowerText));
};

export default checkForbiddenContent;
