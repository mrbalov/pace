/**
 * Supported image generation providers:
 * - `pollinations`: Free, unlimited, no authentication.
 */
export type ImageGenerationProviderName = 'pollinations';

/**
 * Validation result returned by guardrails validation functions.
 */
export type ValidationResult<T = unknown> = {
  /** Whether the validation passed. */
  valid: boolean;
  /** Array of error messages if validation failed. */
  errors: string[];
  /** Sanitized version of the input if validation failed but sanitization was possible. */
  sanitized?: T;
};

/**
 * Activity signals extracted from activity data.
 */
export type StravaActivitySignals = {
  /** Activity type from sport_type field. */
  activityType: string;
  /** Intensity classification. */
  intensity: 'low' | 'medium' | 'high';
  /** Elevation classification. */
  elevation: 'flat' | 'rolling' | 'mountainous';
  /** Time of day classification. */
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  /** Weather condition if available. */
  weather?: 'sunny' | 'rainy' | 'cloudy' | 'foggy';
  /** Normalized tags from activity. */
  tags: string[];
  /** Extracted brand names from gear/description (if compliant). */
  brands?: string[];
  /** Safe semantic signals extracted from user text. */
  semanticContext?: string[];
};

/**
 * Image generation prompt structure.
 */
export type StravaActivityImagePrompt = {
  /** Visual style for the image. */
  style: 'cartoon' | 'minimal' | 'abstract' | 'illustrated';
  /** Mood descriptor. */
  mood: string;
  /** Subject description. */
  subject: string;
  /** Scene/environment description. */
  scene: string;
  /** Full assembled prompt text (max 400 characters). */
  text: string;
};
