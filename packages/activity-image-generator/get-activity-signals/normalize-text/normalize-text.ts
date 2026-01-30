import sanitizeText from '../../guardrails/sanitize-text';

/**
 * Normalizes user-provided text to extract safe semantic signals.
 *
 * Processes text from activity name, description, or gear fields
 * to extract safe semantic context. Never copies text verbatim.
 *
 * User-provided text is sanitized and processed to extract semantic
 * signals that can safely influence prompt generation. Forbidden
 * content is removed, and only safe, normalized signals are returned.
 *
 * @param {string} text - User-provided text to normalize
 * @returns {string[]} Array of safe semantic signal strings
 */
const normalizeText = (text: string): string[] => {
  const hasText = text !== undefined && text !== null && text.trim().length > 0;
  
  const result = (() => {
    if (!hasText) {
      return [];
    } else {
      // Sanitize the text first
      const sanitized = sanitizeText(text);
      
      if (!sanitized || sanitized.length === 0) {
        return [];
      } else {
        // Extract safe semantic signals
        // For now, we'll return empty array as we need to be conservative
        // In a full implementation, we might extract activity-related keywords
        // like "trail", "road", "track", "indoor", "outdoor", etc.
        
        const signals: string[] = [];
        
        // Basic keyword extraction (very conservative)
        const lowerText = sanitized.toLowerCase();
        const safeKeywords = ['trail', 'road', 'track', 'indoor', 'outdoor', 'park', 'beach', 'mountain', 'hill'];
        
        safeKeywords.forEach((keyword) => {
          if (lowerText.includes(keyword)) {
            signals.push(keyword);
          }
        });
        
        return signals;
      }
    }
  })();
  
  return result;
};

export default normalizeText;
