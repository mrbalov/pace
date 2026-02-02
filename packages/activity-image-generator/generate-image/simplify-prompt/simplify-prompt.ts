import { CONFIG } from '../../constants';
import { StravaActivityImagePrompt } from '../../types';

/**
 * Simplifies an image generation prompt for retry attempts.
 *
 * Reduces prompt complexity by removing less essential elements.
 * First simplification removes scene details, keeping style, mood, and subject.
 * Second simplification keeps only style and basic subject.
 *
 * Simplification strategy:
 * - Level 1: Remove scene, keep style + mood + subject
 * - Level 2: Keep only style + basic subject
 * The text field is reassembled after simplification.
 *
 * @param {StravaActivityImagePrompt} prompt - Original prompt to simplify
 * @param {number} attemptLevel - Retry attempt level (1, 2, and so on).
 * @returns {StravaActivityImagePrompt} Simplified prompt with reduced text
 *
 * @example
 * ```typescript
 * const simplifiedPrompt = simplifyPrompt(originalPrompt, 1);
 * ```
 */
const simplifyPrompt = (
  prompt: StravaActivityImagePrompt,
  attemptLevel: number,
): StravaActivityImagePrompt => {
  if (attemptLevel === 1) {
    const simplifiedText = `${prompt.style} style, ${prompt.mood} mood, ${prompt.subject}`;

    return {
      ...prompt,
      scene: '',
      text: simplifiedText.length <= CONFIG.MAX_PROMPT_LENGTH
        ? simplifiedText
        : simplifiedText.substring(0, CONFIG.MAX_PROMPT_LENGTH),
    };
  } else {
    const basicSubject = prompt.subject.split(',')[0]?.trim() ?? prompt.subject;
    const simplifiedText = `${prompt.style} style, ${basicSubject}`;

    return {
      ...prompt,
      mood: '',
      scene: '',
      text: simplifiedText.length <= CONFIG.MAX_PROMPT_LENGTH
        ? simplifiedText
        : simplifiedText.substring(0, CONFIG.MAX_PROMPT_LENGTH),
    };
  }
};

export default simplifyPrompt;
