/**
 * General quality keywords to guide model toward better output.
 */
export const GENERAL_QUALITY = ', high quality, sharp, beautiful';

/**
 * Style-specific quality keywords to enhance image generation.
 * Uses specific art style references that AI models understand better than generic terms.
 */
export const QUALITY_KEYWORDS: Record<string, string> = {
  illustrated: 'professional editorial illustration, digital art, concept art style',
  cartoon: 'modern animation style, studio quality, vibrant character design',
  minimal: 'minimalist graphic design, clean vector art, simple shapes',
  abstract: 'artistic composition, geometric abstraction, contemporary art',
};

/**
 * Human quality terms by style to avoid conflicting instructions.
 * Cartoon/illustration styles don't need "realistic features" which conflicts with the style.
 */
export const HUMAN_QUALITY_BY_STYLE: Record<string, string> = {
  illustrated: ', well-proportioned figure, professional anatomy',
  cartoon: ', appealing character design, expressive pose',
  minimal: ', simplified silhouette, clean form',
  abstract: '', // No human-specific terms for abstract style
};
