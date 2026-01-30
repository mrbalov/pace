import { ImageGenerationProviderName, StravaActivityImagePrompt } from '../types';

/**
 * Input for image generation.
 */
export type GenerateImageInput = {
  /** Image generation prompt from activity data. */
  prompt: StravaActivityImagePrompt;
  /** Number of retry attempts made so far. */
  attempts?: number;
  provider?: ImageGenerationProviderName;
};

/**
 * Output from image generation.
 */
export type GenerateImageOutput = {
  /** Base64-encoded image data URL (data:image/png;base64,...). */
  imageData: string;
  /** Whether fallback was used. */
  fallback: boolean;
  /** Number of retry attempts performed. */
  attempts: number;
};
