export const BASE_URL = 'https://image.pollinations.ai/prompt/';

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
 * Prompt enhancer to improve image quality.
 * 
 * Pollinations generates poor images by default.
 * This enhancer helps achieve better results.
 */
export const PROMPT_ENHANCER = 'side view, natural human anatomy, natural and clear eyes, attractive face, proportional arms and legs, symmetrical joints, clean lines, soft natural lighting, professional illustration';

/**
 * Negative prompt allows to avoid common image generation issues.
 * Addresses: distorted faces, extra limbs, malformed hands, blurry images, low quality, and others.
 * Pollinations generates poor images due to limited resources; negative prompts help mitigate this.
*/
export const NEGATIVE_PROMPT = 'distorted or warped eyes, twisted joints, distorted feet, unrealistic pose, distorted or warped faces, warped or distorted eyes, extra limbs, malformed or distorted hands, blurry, low quality, pixelated, ugly, deformed body, disfigured, bad or broken anatomy, bad proportions, extra fingers, missing fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, noise, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, out of focus, long neck, long body, logo, watermark';
