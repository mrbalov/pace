import { StravaActivityImagePrompt } from '../../types';
import { CONFIG } from '../../constants';

/**
 * Style-specific quality keywords to enhance image generation.
 * Uses specific art style references that AI models understand better than generic terms.
 * 
 * @internal
 */
const QUALITY_KEYWORDS: Record<'illustrated' | 'cartoon' | 'minimal' | 'abstract', string> = {
  illustrated: 'professional editorial illustration, digital art, concept art style',
  cartoon: 'modern animation style, studio quality, vibrant character design',
  minimal: 'minimalist graphic design, clean vector art, simple shapes',
  abstract: 'artistic composition, geometric abstraction, contemporary art',
};

/**
 * Human quality terms by style to avoid conflicting instructions.
 * Cartoon/illustration styles don't need "realistic features" which conflicts with the style.
 * 
 * @internal
 */
const HUMAN_QUALITY_BY_STYLE: Record<'illustrated' | 'cartoon' | 'minimal' | 'abstract', string> = {
  illustrated: ', well-proportioned figure, professional anatomy',
  cartoon: ', appealing character design, expressive pose',
  minimal: ', simplified silhouette, clean form',
  abstract: '', // No human-specific terms for abstract style
};

/**
 * General quality keywords to guide model toward better output.
 * 
 * @internal
 */
const GENERAL_QUALITY = ', high quality, sharp, beautiful';

/**
 * Truncates prompt while preserving quality keywords and core components.
 * 
 * Priority order for truncation:
 * 1. Keep quality keywords (critical for image quality)
 * 2. Keep style, subject, human quality, mood (core components)
 * 3. Truncate scene details if needed
 * 
 * @internal
 * @param {Omit<StravaActivityImagePrompt, 'text'>} prompt - Prompt components
 * @param {string} fullPrompt - Full prompt with all components
 * @returns {string} Truncated prompt within character limit
 */
const truncatePrompt = (prompt: Omit<StravaActivityImagePrompt, 'text'>, fullPrompt: string): string => {
  if (fullPrompt.length <= CONFIG.MAX_PROMPT_LENGTH) {
    return fullPrompt;
  }
  
  // Build essential parts that must be preserved
  const qualityKeywords = QUALITY_KEYWORDS[prompt.style];
  const humanQuality = HUMAN_QUALITY_BY_STYLE[prompt.style];
  const essentialParts = `${qualityKeywords}, ${prompt.style} style, ${prompt.subject}${humanQuality}, ${prompt.mood} mood, `;
  const essentialLength = essentialParts.length + GENERAL_QUALITY.length;
  
  // Calculate available space for scene
  const maxSceneLength = CONFIG.MAX_PROMPT_LENGTH - essentialLength;
  
  if (maxSceneLength <= 0) {
    // If essential parts exceed limit, return minimal version without scene
    return `${essentialParts}${GENERAL_QUALITY}`;
  }
  
  // Truncate scene if needed
  const truncatedScene = prompt.scene.length > maxSceneLength
    ? prompt.scene.substring(0, Math.max(0, maxSceneLength - 3)) + '...'
    : prompt.scene;
  
  return `${essentialParts}${truncatedScene}${GENERAL_QUALITY}`;
};

/**
 * Assembles final prompt text from prompt components with quality-enhancing keywords.
 *
 * Constructs the complete prompt text within character limit, including:
 * - Style-specific quality keywords (professional, polished, elegant, etc.)
 * - Human anatomy quality terms (anatomically correct, well-proportioned)
 * - General quality keywords (high quality, sharp, beautiful)
 * 
 * Enhanced prompt structure: "{qualityKeywords}, {style} style, {subject}{humanQuality}, {mood} mood, {scene}{generalQuality}"
 * 
 * Quality keywords address:
 * - Style-specific art direction (professional editorial illustration, modern animation style, etc.)
 * - Human quality terms (style-appropriate: character design for cartoon, professional anatomy for illustrated)
 * - Visual appeal and overall quality (high quality, sharp, beautiful)
 * 
 * If over character limit, truncates scene details first while preserving quality keywords.
 *
 * @param {Omit<StravaActivityImagePrompt, 'text'>} prompt - Prompt components to assemble
 * @returns {string} Assembled prompt text (max 600 characters)
 *
 * @example
 * ```typescript
 * const prompt = assemblePrompt({
 *   style: 'illustrated',
 *   subject: 'runner',
 *   mood: 'energetic',
 *   scene: 'outdoor setting, flat terrain, bright clear sky'
 * });
 * // Returns: "professional editorial illustration, digital art, concept art style, illustrated style, runner, well-proportioned figure, professional anatomy, energetic mood, outdoor setting, flat terrain, bright clear sky, high quality, sharp, beautiful"
 * ```
 */
const assemblePrompt = (prompt: Omit<StravaActivityImagePrompt, 'text'>): string => {
  // Get style-specific quality keywords and human quality terms
  const qualityKeywords = QUALITY_KEYWORDS[prompt.style];
  const humanQuality = HUMAN_QUALITY_BY_STYLE[prompt.style];
  
  // Build enhanced prompt with quality keywords
  const fullPrompt = `${qualityKeywords}, ${prompt.style} style, ${prompt.subject}${humanQuality}, ${prompt.mood} mood, ${prompt.scene}${GENERAL_QUALITY}`;
  
  // Truncate if over limit (preserves quality keywords)
  const promptTruncated = truncatePrompt(prompt, fullPrompt);
  
  return promptTruncated;
};

export default assemblePrompt;
