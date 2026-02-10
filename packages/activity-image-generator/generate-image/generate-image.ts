import { GenerateImageInput, GenerateImageOutput, ImageGenerationProviderApiKeys } from './types';
import { CONFIG } from '../constants';
import { ImageGenerationProviderName, StravaActivityImagePrompt } from '../types';
import { getProvider } from './providers';
import simplifyPrompt from './simplify-prompt';
import getFallbackPrompt from './get-fallback-prompt';

/**
 * Attempts image generation with retry logic.
 *
 * @internal
 * @param {StravaActivityImagePrompt} prompt - Current prompt to use
 * @param {number} attempt - Current attempt number (0-based)
 * @param {number} maxAttempts - Maximum number of retries allowed
 * @param {ImageGenerationProviderName} [providerName] - Optional provider name
 * @param {ImageGenerationProviderApiKeys} [providerApiKeys] - Optional provider API keys.
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL
 * @throws {Error} Throws error if all retries fail
 */
const attemptGeneration = async (
  prompt: StravaActivityImagePrompt,
  attempt: number,
  maxAttempts: number,
  providerName?: ImageGenerationProviderName,
  providerApiKeys?: ImageGenerationProviderApiKeys,
): Promise<string> => {
  const provider = getProvider(providerName, providerApiKeys);

  try {
    return await provider(prompt.text);
  } catch (error) {
    if (attempt < maxAttempts) {
      const nextAttempt = attempt + 1;
      const simplifiedPrompt = simplifyPrompt(prompt, nextAttempt);

      return attemptGeneration(
        simplifiedPrompt,
        nextAttempt,
        maxAttempts,
        providerName,
        providerApiKeys,
      );
    } else {
      throw error;
    }
  }
};

/**
 * Generates activity image using configured AI provider.
 *
 * Provider is controlled by IMAGE_PROVIDER environment variable:
 * - 'pollinations' (default): Free, unlimited Pollinations.ai
 *
 * Implements retry logic with prompt simplification and fallback mechanism.
 * Attempts image generation up to MAX_RETRIES times, simplifying the prompt
 * on each retry. If all retries fail, uses a safe fallback prompt. Images are
 * downloaded from the provider and returned as base64-encoded data URLs.
 *
 * Generation process:
 * 1. Get configured provider based on IMAGE_PROVIDER env var (defaults to Pollinations)
 * 2. Validate prompt text length (max 600 characters)
 * 3. Attempt generation with original prompt
 * 4. On failure, retry with simplified prompt (max 2 retries)
 * 5. If all retries fail, use fallback prompt
 * 6. Images are downloaded from provider and returned as base64 data URLs
 * 7. Always returns a valid base64-encoded image data URL
 *
 * @param {GenerateImageInput} input - Image generation input with prompt
 * @returns {Promise<GenerateImageOutput>} Promise resolving to generated image data and metadata
 * @throws {Error} Throws error if generation fails
 *
 * @example
 * ```typescript
 * const result = await generateImage({ prompt });
 * console.log('Image data:', result.imageData);
 * console.log('Used fallback:', result.fallback);
 * ```
 */
const generateImage = async (input: GenerateImageInput): Promise<GenerateImageOutput> => {
  if (input.prompt.text.length > CONFIG.MAX_PROMPT_LENGTH) {
    throw new Error(
      `Prompt text exceeds ${CONFIG.MAX_PROMPT_LENGTH} character limit: ${input.prompt.text.length} characters`,
    );
  } else {
    const attempts = input.attempts ?? 0;

    try {
      const imageData = await attemptGeneration(
        input.prompt,
        0,
        CONFIG.MAX_RETRIES,
        input.provider,
        input.providerApiKeys,
      );

      return {
        fallback: false,
        imageData,
        attempts,
      };
    } catch {
      const provider = getProvider(input.provider, input.providerApiKeys);
      const fallbackPrompt = getFallbackPrompt(input.prompt.subject);
      const fallbackImageData = await provider(fallbackPrompt.text);

      return {
        imageData: fallbackImageData,
        fallback: true,
        attempts: CONFIG.MAX_RETRIES,
      };
    }
  }
};

export default generateImage;
