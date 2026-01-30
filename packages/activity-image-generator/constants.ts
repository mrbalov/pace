/**
 * Configuration constants for the image generator package.
 */
export const CONFIG = {
  /** Maximum prompt length in characters. */
  MAX_PROMPT_LENGTH: 600,

  /** Maximum number of retry attempts. */
  MAX_RETRIES: 2,
  /** Default image quality. */
  DEFAULT_QUALITY: 'standard' as const,
  /** Default image style. */
  DEFAULT_STYLE: 'natural' as const,
  /** Fallback styles (minimal or abstract). */
  FALLBACK_STYLES: ['minimal', 'abstract'] as const,
  FALLBACK_SUBJECT: 'fitness activity illustration' as const,
  FALLBACK_MOOD: 'energetic' as const,
  FALLBACK_SCENE: 'neutral background' as const,
  IMAGE_SIZE: {
    WIDTH: 1024,
    HEIGHT: 1024,
  },

  /** Allowed visual styles for image generation. */
  ALLOWED_STYLES: ['cartoon', 'minimal', 'abstract', 'illustrated'] as const,

  /** Valid heart rate range (beats per minute). */
  HEART_RATE_MIN: 40,
  HEART_RATE_MAX: 220,
  
  /** Intensity classification thresholds. */
  INTENSITY: {
    /** Low intensity threshold for pace (seconds per km). */
    LOW_PACE_THRESHOLD: 360, // 6:00 min/km
    /** High intensity threshold for pace (seconds per km). */
    HIGH_PACE_THRESHOLD: 240, // 4:00 min/km
    /** Low intensity threshold for heart rate (bpm). */
    LOW_HR_THRESHOLD: 120,
    /** High intensity threshold for heart rate (bpm). */
    HIGH_HR_THRESHOLD: 160,
  },
  
  /** Elevation classification thresholds (meters). */
  ELEVATION: {
    /** Flat terrain threshold. */
    FLAT_THRESHOLD: 50,
    /** Rolling terrain threshold. */
    ROLLING_THRESHOLD: 500,
  },
  
  /** Time of day classification. */
  TIME_OF_DAY: {
    /** Morning start hour (0-23). */
    MORNING_START: 5,
    /** Morning end hour (0-23). */
    MORNING_END: 10,
    /** Evening start hour (0-23). */
    EVENING_START: 17,
    /** Night start hour (0-23). */
    NIGHT_START: 20,
  },
};
