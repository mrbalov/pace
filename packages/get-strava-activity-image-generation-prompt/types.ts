import { ATMOSPHERES, ENVIRONMENTS, MOODS, STYLES, TERRAINS } from './constants';

/**
 * Validation result returned by validation functions.
 */
export interface ValidationResult<T = unknown> {
  /** Whether the validation passed. */
  valid: boolean;
  /** Array of error messages if validation failed. */
  errors: string[];
  /** Sanitized version of the input if validation failed but sanitization was possible. */
  sanitized?: T;
}

export type StravaActivityImageGenerationPromptStyle = typeof STYLES[number];

export type StravaActivityImageGenerationPromptMood = typeof MOODS[number];

export type StravaActivityImageGeneraionPromptTerrain = typeof TERRAINS[number];

export type StravaActivityImageGeneraionPromptEnvironment = typeof ENVIRONMENTS[number];

export type StravaActivityImageGeneraionPromptAtmosphere = typeof ATMOSPHERES[number];

/**
 * Image generation prompt structure.
 */
export interface StravaActivityImageGenerationPrompt {
  style: StravaActivityImageGenerationPromptStyle;
  mood: string;
  subject: string;
  scene: string;
  text: string;
}

export type StravaActivityImageGenerationPromptValidationResult = ValidationResult<
StravaActivityImageGenerationPrompt
>;
