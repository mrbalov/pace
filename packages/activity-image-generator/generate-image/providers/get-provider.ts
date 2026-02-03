import { ImageGenerationProvider } from '../types';
import { ImageGenerationProviderName } from '../../types';
import pollinations from './pollinations';

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
): ImageGenerationProvider => {
  switch (providerName) {
    case 'pollinations': {
      return pollinations;
    }
    default: {
      throw new Error(`Unknown image generation provider: ${String(providerName)}.`);
    }
  }
};

export default getProvider;
