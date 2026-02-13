import { StravaActivitySignals } from './types';
import validatePrompt from './validate-prompt';
import assemblePrompt from './assemble-prompt';
import { DEFAULT_PROMPT } from './constants';

/**
 * Generates image generation prompt from Strava activity signals.
 *
 * Main entry point for prompt generation. Creates a complete prompt
 * structure by selecting style, mood, and composing scene based on
 * activity signals. Validates the prompt and falls back to safe default
 * if validation fails.
 *
 * Prompt generation process:
 * 1. Select visual style
 * 2. Select mood descriptor
 * 3. Compose scene description
 * 4. Assemble final prompt text
 * 5. Validate prompt
 * 6. Use fallback if validation fails
 *
 * @param {StravaActivitySignals} signals - Activity signals to generate prompt from.
 * @param {Function} checkForbiddenContent - Function to check for forbidden content in the text.
 * @returns {string} Generated and validated prompt.
 */
const getStravaActivityImageGenerationPrompt = (
  signals: StravaActivitySignals,
  checkForbiddenContent: (input: string) => boolean,
): string => {
  const prompt = assemblePrompt(signals);
  const { valid, errors } = validatePrompt(prompt, checkForbiddenContent);

  if (valid) {
    return prompt;
  } else {
    console.error('Prompt validation failed:', errors);

    return DEFAULT_PROMPT;
  }
};

export default getStravaActivityImageGenerationPrompt;
