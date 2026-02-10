import { ImageGenerationProviderName, StravaActivityImagePrompt } from '../types';

export interface ImageGenerationProviderApiKeys {
  pollinations?: string;
}

/**
 * Input for image generation.
 */
export interface GenerateImageInput {
  /** Image generation prompt from activity data. */
  prompt: StravaActivityImagePrompt;
  /** Number of retry attempts made so far. */
  attempts?: number;
  provider?: ImageGenerationProviderName;
  providerApiKeys?: ImageGenerationProviderApiKeys;
}

/**
 * Output from image generation.
 */
export interface GenerateImageOutput {
  /** Base64-encoded image data URL. */
  imageData: string;
  /** Whether fallback was used. */
  fallback: boolean;
  /** Number of retry attempts performed. */
  attempts: number;
}

/**
 * Common interface for all image generation providers.
 * Generates an image from a text prompt.
 *
 * @param {string} prompt - Text prompt for image generation.
 * @param {string} [apiKey] - Optional API key for the provider (if required).
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL (`data:image/png;base64,...`).
 * @throws {Error} Throws error if generation fails.
 */
export type ImageGenerationProvider = (prompt: string, apiKey?: string) => Promise<string>;
