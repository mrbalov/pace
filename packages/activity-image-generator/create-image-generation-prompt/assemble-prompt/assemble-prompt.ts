import { StravaActivityImagePrompt } from '../../types';
import { CONFIG } from '../../constants';

const truncatePrompt = (prompt: Omit<StravaActivityImagePrompt, 'text'>, fullPrompt: string): string => {
  if (fullPrompt.length > CONFIG.MAX_PROMPT_LENGTH) {
    // Calculate space for scene while keeping style, subject, and mood
    const baseText = `${prompt.style} style, ${prompt.subject}, ${prompt.mood} mood, `;
    const maxSceneLength = CONFIG.MAX_PROMPT_LENGTH - baseText.length;
  
    // Truncate scene
    const truncatedScene = prompt.scene.substring(0, Math.max(0, maxSceneLength - 3)) + '...';
    return baseText + truncatedScene;
  } else {
    return fullPrompt;
  }
};

/**
 * Assembles final prompt text from prompt components.
 *
 * Constructs the complete prompt text within character limit.
 * Truncates scene details first if needed, preserving core subject and style.
 *
 * @param {StravaActivityImagePrompt} prompt - Prompt components to assemble
 * @returns {string} Assembled prompt text (max 400 characters)
 *
 * @remarks
 * Prompt structure: "{style} style, {subject}, {mood} mood, {scene}"
 * If over character limit, truncates scene details first.
 */
const assemblePrompt = (prompt: Omit<StravaActivityImagePrompt, 'text'>): string => {
  // Build base prompt
  const fullPrompt = `${prompt.style} style, ${prompt.subject}, ${prompt.mood} mood, ${prompt.scene}`;
  
  // Truncate if over limit
  const promptTruncated = truncatePrompt(prompt, fullPrompt);
  
  return promptTruncated;
};

export default assemblePrompt;
