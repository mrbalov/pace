export const INTENSITIES = ['low', 'medium', 'high'] as const;

export const ELEVATIONS = ['flat', 'rolling', 'mountainous'] as const;

export const TIMES_OF_DAY = ['morning', 'day', 'evening', 'night'] as const;

/**
 * Complete list of moving activities supported by Strava API.
 * These activities require distance > 0 to be valid.
 *
 * Activities are categorized by type:
 * - Running: Run, TrailRun, VirtualRun
 * - Cycling: Ride, VirtualRide, MountainBikeRide, EBikeRide
 * - Water: Swim, Surfing, Canoeing, Kayaking
 * - Winter: AlpineSki, BackcountrySki, NordicSki, Snowboard
 * - Walking: Walk, Hike
 * - Other: RockClimbing, Golf, Soccer, Tennis
 *
 * Note: Fitness activities (Workout, Yoga, WeightTraining, CrossFit) are
 * excluded as they don't require distance > 0 to be valid.
 */
export const MOVING_ACTIVITIES = [
  // Running
  'Run',
  'TrailRun',
  'VirtualRun',

  // Cycling
  'Ride',
  'VirtualRide',
  'MountainBikeRide',
  'EBikeRide',

  // Water
  'Swim',
  'Surfing',
  'Canoeing',
  'Kayaking',

  // Winter
  'AlpineSki',
  'BackcountrySki',
  'NordicSki',
  'Snowboard',

  // Walking
  'Walk',
  'Hike',

  // Other
  'RockClimbing',
  'Golf',
  'Soccer',
  'Tennis',
] as const;

/**
 * World record pace is around 2:30 min/km,
 * so anything faster than 2:00 min/km is suspicious.
 */
export const MAX_PACE = 120 as const;

/**
 * Classification thresholds and constants for Strava activity signals.
 * Defines thresholds for classifying activity intensity, elevation, and time of day.
 * Used across classification and validation logic to ensure consistency.
 */
export const CLASSIFICATIONS = {
  /** Intensity classification thresholds. */
  INTENSITY: {
    /**
     * Low intensity threshold for pace (seconds per km).
     * 6:00 min/km.
     */
    LOW_PACE_THRESHOLD: 360,

    /**
     * High intensity threshold for pace (seconds per km).
     * 4:00 min/km.
     */
    HIGH_PACE_THRESHOLD: 240,
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
