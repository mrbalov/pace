import pollinations from './pollinations';
import {
  ImageGenerationProvider,
  ImageGenerationProviderApiKeys,
  ImageGenerationProviderName,
} from '../types';

/**
 * Gets the configured image generation provider.
 * Reads IMAGE_PROVIDER environment variable or defaults to 'Pollinations'.
 *
 * Supported providers:
 * - 'pollinations' (default): Free, unlimited, no authentication.
 *
 * Priority:
 * 1. Explicit providerName parameter
 * 2. IMAGE_PROVIDER environment variable
 * 3. Default to 'pollinations'
 *
 * @param {ImageGenerationProviderName} [providerName] - Override provider name
 * @param {ImageGenerationProviderApiKeys} [providerApiKeys] - Optional provider API keys.
 * @returns {ImageGenerationProvider} Image generation provider instance.
 * @throws {Error} Throws if provider name is invalid.
 *
 * @example
 * ```typescript
 * const provider1 = getProvider(); // Uses IMAGE_PROVIDER env or defaults to 'pollinations'
 * const provider2 = getProvider('pollinations');
 * ```
 */
const getProvider = (
  providerName: ImageGenerationProviderName = 'pollinations',
  providerApiKeys?: ImageGenerationProviderApiKeys,
): ImageGenerationProvider => {
  switch (providerName) {
    case 'pollinations': {
      return (prompt: string) => pollinations(prompt, providerApiKeys?.pollinations);
    }
    default: {
      throw new Error(`Unknown image generation provider: ${String(providerName)}.`);
    }
  }
};

export default getProvider;
