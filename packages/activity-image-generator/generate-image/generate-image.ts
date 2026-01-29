import { GenerateImageInput, GenerateImageOutput } from './types';
import { CONFIG } from './constants';
import { StravaActivityImagePrompt } from '../types';
import askDialForImage from './ask-dial-for-image';
import simplifyPrompt from './simplify-prompt';
import getFallbackPrompt from './get-fallback-prompt';

/**
 * Attempts image generation with retry logic.
 *
 * @internal
 * @param {StravaActivityImagePrompt} currentPrompt - Current prompt to use
 * @param {number} attemptNumber - Current attempt number (0-based)
 * @param {number} maxRetries - Maximum number of retries allowed
 * @param {string} saveDirectory - Directory to save generated images
 * @param {string} baseUrl - Base URL for constructing full image URL
 * @param {object} [options] - Optional configuration including storeImage function
 * @returns {Promise<string>} Promise resolving to full image URL
 * @throws {Error} Throws error if all retries fail
 */
const attemptGeneration = async (
  currentPrompt: StravaActivityImagePrompt,
  attemptNumber: number,
  maxRetries: number,
  saveDirectory: string,
  baseUrl: string,
  options?: Parameters<typeof askDialForImage>[3]
): Promise<string> => {
  try {
    const imageUrl = await askDialForImage(currentPrompt.text, saveDirectory, baseUrl, options);
    return imageUrl;
  } catch (error) {
    if (attemptNumber < maxRetries) {
      const simplifiedPrompt = simplifyPrompt(currentPrompt, attemptNumber + 1);
      return attemptGeneration(simplifiedPrompt, attemptNumber + 1, maxRetries, saveDirectory, baseUrl, options);
    } else {
      throw error;
    }
  }
};

/**
 * Generates activity image using DIAL's DALL-E-3 service.
 *
 * Implements retry logic with prompt simplification and fallback mechanism.
 * Attempts image generation up to MAX_RETRIES times, simplifying the prompt
 * on each retry. If all retries fail, uses a safe fallback prompt. Images are
 * downloaded from DIAL storage and saved to the server's file system or Netlify Blobs.
 *
 * @param {GenerateImageInput} input - Image generation input with prompt
 * @param {string} saveDirectory - Directory path where images should be saved (for filesystem fallback)
 * @param {string} baseUrl - Base URL for constructing full image URL (e.g., 'http://localhost:3000')
 * @param {object} [options] - Optional configuration including storeImage function for Blobs
 * @returns {Promise<GenerateImageOutput>} Promise resolving to generated image URL and metadata
 * @throws {Error} Throws error if DIAL_KEY is not set
 *
 * @remarks
 * Generation process:
 * 1. Validate DIAL_KEY environment variable
 * 2. Validate prompt text length (max 400 characters)
 * 3. Attempt generation with original prompt
 * 4. On failure, retry with simplified prompt (max 2 retries)
 * 5. If all retries fail, use fallback prompt
 * 6. Images are downloaded from DIAL and saved to server or Blobs
 * 7. Always returns a valid full image URL
 *
 * @example
 * ```typescript
 * const result = await generateImage({ prompt }, '/path/to/images', 'http://localhost:3000');
 * console.log('Image URL:', result.imageUrl);
 * console.log('Used fallback:', result.usedFallback);
 * ```
 */
const generateImage = async (
  input: GenerateImageInput,
  saveDirectory: string,
  baseUrl: string,
  options?: Parameters<typeof askDialForImage>[3]
): Promise<GenerateImageOutput> => {
  if (!process.env.DIAL_KEY) {
    throw new Error('DIAL_KEY is not set');
  }

  const promptText = input.prompt.text;
  if (promptText.length > 400) {
    throw new Error(`Prompt text exceeds 400 character limit: ${promptText.length} characters`);
  }

  const retryCount = input.retryCount ?? 0;
  const maxRetries = CONFIG.MAX_RETRIES;

  const result = (async (): Promise<GenerateImageOutput> => {
    try {
      const imageUrl = await attemptGeneration(input.prompt, 0, maxRetries, saveDirectory, baseUrl, options);
      return {
        imageUrl,
        usedFallback: false,
        retriesPerformed: retryCount,
      };
    } catch (error) {
      const fallbackPrompt = getFallbackPrompt(input.prompt.subject);
      const fallbackImageUrl = await askDialForImage(fallbackPrompt.text, saveDirectory, baseUrl, options);
      return {
        imageUrl: fallbackImageUrl,
        usedFallback: true,
        retriesPerformed: maxRetries,
      };
    }
  })();

  return result;
};

export default generateImage;
