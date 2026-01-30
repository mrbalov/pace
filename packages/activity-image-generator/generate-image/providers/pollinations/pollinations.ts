import { ImageGenerationProvider } from '../../types';
import { CONFIG } from '../../../constants';
import { BASE_URL, MODEL, NEGATIVE_PROMPT, PROMPT_ENHANCER } from './constants';

/**
 * Random seed prevents caching - ensures each request generates a unique image.
 * @returns {string} Random seed.
*/
const getSeed = () => String(Math.floor(Math.random() * 1000000));

/**
 * Creates Pollinations image generation URL for a given prompt.
 *
 * @param {string} prompt - Text prompt for image generation.
 * @returns {string} URL for Pollinations image generation.
 * @see {@link https://pollinations.ai | Pollinations.ai}
 * @internal
 */
const getUrl = (prompt: string): string => {
  const promptEnhanced = `${PROMPT_ENHANCER}, ${prompt}`;
  const url = new URL(`${BASE_URL}${encodeURIComponent(promptEnhanced)}`);

  url.searchParams.set('width', String(CONFIG.IMAGE_SIZE.WIDTH));
  url.searchParams.set('height', String(CONFIG.IMAGE_SIZE.HEIGHT));
  url.searchParams.set('model', MODEL);
  url.searchParams.set('nologo', 'true');
  url.searchParams.set('enhance', 'true');
  url.searchParams.set('negative', encodeURIComponent(NEGATIVE_PROMPT));
  url.searchParams.set('seed', getSeed());

  return url.toString();
};

/**
 * Pollinations.ai image generation provider.
 * 
 * Completely free, no authentication required.
 * Uses negative prompts to avoid common image generation issues.
 * 
 * Supports multiple models:
 * - `flux` (default, best for illustrations)
 * - `seedream`
 * - `gpt-image-large`
 * - `kontext`
 * 
 * @param {string} prompt - Text prompt for image generation.
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL (`data:image/png;base64,...`).
 * @throws {Error} Throws error if generation fails.
 * @see {@link https://pollinations.ai | Pollinations.ai}
 */
const pollinations: ImageGenerationProvider = async (
  prompt: string,
): Promise<string> => {  
  const url = getUrl(prompt)  
  const response = await fetch(url);
  
  if (response.ok) {
    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    
    return `data:image/png;base64,${base64}`;
  } else {
    throw new Error(`Pollinations API error: ${response.statusText}`);
  }
};

export default pollinations;
