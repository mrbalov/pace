/**
 * Pollinations model for image generation.
 * Available models:
 * - `flux` (best for illustrations, balanced quality).
 * - `seedream` (excellent prompt understanding).
 * - `gpt-image-large` (photorealism).
 * - `kontext` (context-aware).
*/
export const MODEL = 'flux';

/**
 * Negative prompt allows to avoid common image generation issues.
 * Addresses: distorted faces, extra limbs, malformed hands, blurry images, low quality.
*/
export const NEGATIVE_PROMPT = 'distorted faces, extra limbs, malformed hands, blurry, low quality, pixelated, ugly, deformed, disfigured, bad anatomy, bad proportions, extra fingers, missing fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, out of focus, long neck, long body';
