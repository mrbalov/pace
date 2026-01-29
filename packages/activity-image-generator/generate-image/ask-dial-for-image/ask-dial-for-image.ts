import dialProvider from '../providers/dial-provider';
import { ImageGenerationOptions } from '../providers/types';

/**
 * Legacy wrapper for DIAL image generation.
 * 
 * @deprecated Use providers/dial-provider directly or getProvider() factory
 * @see dialProvider
 * 
 * @param {string} prompt - Image generation prompt text
 * @param {string} saveDirectory - Directory path where images should be saved (for filesystem fallback)
 * @param {string} baseUrl - Base URL for constructing full image URL (e.g., 'http://localhost:3000')
 * @param {ImageGenerationOptions} [options] - Optional configuration
 * @returns {Promise<string>} Promise resolving to full image URL (e.g., 'http://localhost:3000/images/abc123')
 * @throws {Error} Throws error if DIAL_KEY is not set or generation fails
 */
const askDialForImage = async (
  prompt: string,
  saveDirectory: string,
  baseUrl: string,
  options?: ImageGenerationOptions
): Promise<string> => {
  return dialProvider.generateImage(prompt, saveDirectory, baseUrl, options);
};

export default askDialForImage;
