import { ImageProvider, ProviderName } from './types';
import pollinationsProvider from './pollinations-provider';
import dialProvider from './dial-provider';

/**
 * Gets the configured image generation provider.
 * 
 * Reads IMAGE_PROVIDER environment variable to determine which provider to use.
 * Defaults to Pollinations if not set.
 * 
 * @returns {ImageProvider} Image generation provider instance
 * @throws {Error} Throws if provider name is invalid
 * 
 * @remarks
 * Supported providers:
 * - 'pollinations' (default): Free, unlimited, no authentication
 * - 'dial': EPAM Dial with DALL-E-3 (requires DIAL_KEY)
 * 
 * @example
 * ```typescript
 * // Use default (Pollinations)
 * const provider = getProvider();
 * 
 * // Use EPAM Dial
 * process.env.IMAGE_PROVIDER = 'dial';
 * const dialProvider = getProvider();
 * ```
 */
const getProvider = (): ImageProvider => {
  const providerName = (process.env.IMAGE_PROVIDER || 'pollinations') as ProviderName;
  
  if (providerName === 'pollinations') {
    return pollinationsProvider;
  } else if (providerName === 'dial') {
    return dialProvider;
  } else {
    throw new Error(`Unknown IMAGE_PROVIDER: ${providerName}. Supported: pollinations, dial`);
  }
};

export default getProvider;
