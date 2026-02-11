import checkForbiddenContent from '../check-forbidden-content';

/**
 * Sanitizes user-provided text by removing forbidden content.
 *
 * This function processes text to extract safe semantic signals while
 * removing any forbidden content patterns. User text should never be
 * copied verbatim into prompts.
 *
 * @param {string} text - User-provided text to sanitize.
 * @returns {string} Sanitized text with forbidden content removed.
 */
const sanitizeText = (text: string): string => {
  const hasText = text.trim().length > 0;

  if (hasText) {
    const hasForbidden = checkForbiddenContent(text);

    if (hasForbidden) {
      // Return empty string if forbidden content detected.
      // In the future implementation, we might extract safe semantic signals.
      // But for now, we'll return empty to be safe.
      return '';
    } else {
      // Basic sanitization: trim and normalize whitespace.
      // In the future, we might also remove special characters, etc.
      const sanitized = text.trim().replace(/\s+/g, ' ');

      return sanitized;
    }
  } else {
    return '';
  }
};

export default sanitizeText;
