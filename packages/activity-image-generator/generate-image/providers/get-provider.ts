import { ImageGenerationProvider } from './types';
import { ImageGenerationProviderName } from '../../types';
import pollinations from './pollinations';

/**
 * Gets the configured image generation provider.
 * Defaults to `Pollinations` if not set.
 * 
 * @returns {ImageProvider} Image generation provider instance.
 * @throws {Error} Throws if provider name is invalid.
 * 
 * @remarks
 * Supported providers:
 * - 'pollinations' (default): Free, unlimited, no authentication.
 * 
 * @example
 * ```typescript
 * const provider1 = getProvider(); // Uses default 'pollinations'.
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
      throw new Error(`Unknown image generation provider: ${providerName}.`);
    }
  }
};

export default getProvider;
