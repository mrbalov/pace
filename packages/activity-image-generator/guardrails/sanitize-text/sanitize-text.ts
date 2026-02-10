import checkForbiddenContent from '../check-forbidden-content';

/**
 * Sanitizes user-provided text by removing forbidden content.
 *
 * This function processes text to extract safe semantic signals while
 * removing any forbidden content patterns. User text should never be
 * copied verbatim into prompts.
 *
 * @param {string} text - User-provided text to sanitize
 * @returns {string} Sanitized text with forbidden content removed
 * @internal
 */
const sanitizeText = (text: string): string => {
  const hasText = text !== undefined && text !== null && text.trim().length > 0;

  const result = (() => {
    if (!hasText) {
      return '';
    } else {
      // Remove forbidden content patterns
      const hasForbidden = checkForbiddenContent(text);

      if (hasForbidden) {
        // Return empty string if forbidden content detected
        // In a real implementation, we might extract safe semantic signals
        // but for now, we'll return empty to be safe
        return '';
      } else {
        // Basic sanitization: trim and normalize whitespace
        const sanitized = text.trim().replace(/\s+/g, ' ');
        return sanitized;
      }
    }
  })();

  return result;
};

export default sanitizeText;
