import {
  CLASSIFICATION_SUBJECTS,
  CLASSIFICATIONS,
  ELEVATIONS,
  INTENSITIES,
  TIMES_OF_DAY,
} from './constants';

/**
 * Strava Activity type.
 * The type is dictated by the Strava API and used internally by the system.
 * @see {@link https://developers.strava.com/docs/reference/#api-Activities-getActivityById | Strava Activity Response Format}
 */
export interface StravaActivity {
  id: number;
  type: string;
  sport_type: string;
  name?: string;
  description?: string;
  distance?: number;
  moving_time?: number;
  total_elevation_gain?: number;
  start_date?: string;
  start_date_local?: string;
  timezone?: string;
  utc_offset?: number;
  start_latlng?: [] | [number, number];
  end_latlng?: [] | [number, number];
  achievement_count?: number;
  comment_count?: number;
  athlete_count?: number;
  photo_count?: number;
  trainer?: boolean;
  commute?: boolean;
  average_speed?: number;
  max_speed?: number;
  average_cadence?: number;
  average_temp?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  max_watts?: number;
  elev_high?: number;
  elev_low?: number;
  pr_count?: number;
  total_photo_count?: number;
  workout_type?: number;
  suffer_score?: number | null;
  calories?: number;
  photos?: Record<string, unknown>;
  device_name?: string;
  perceived_exertion?: number;
  athlete?: {
    id: number;
  };
  gear?: {
    id?: string;
    name?: string;
    nickname?: string;
  };
  map?: {
    id?: string;
    polyline?: string;
    summary_polyline?: string;
  };
}

export type StravaActivitySignalsElevation = (typeof ELEVATIONS)[number];

export type StravaActivitySignalsIntensity = (typeof INTENSITIES)[number];

export type StravaActivitySignalsTimeOfDay = (typeof TIMES_OF_DAY)[number];

export type StravaActivitySignalsStyle = (typeof CLASSIFICATIONS.STYLES)[number];

export type StravaActivitySignalsMood = (typeof CLASSIFICATIONS.MOODS)[number];

export type StravaActivitySignalsTerrain = (typeof CLASSIFICATIONS.TERRAINS)[number];

export type StravaActivitySignalsEnvironment = (typeof CLASSIFICATIONS.ENVIRONMENTS)[number];

export type StravaActivitySignalsAtmosphere = (typeof CLASSIFICATIONS.ATMOSPHERES)[number];

export type StravaActivitySignalsSubject = typeof CLASSIFICATION_SUBJECTS[number];

export interface StravaActivitySignals {
  core: {
    activityType: string;
    intensity: StravaActivitySignalsIntensity;
    elevation: StravaActivitySignalsElevation;
    timeOfDay: StravaActivitySignalsTimeOfDay;
    tags?: string[];
    brands?: string[];
    semanticContext?: string[];
  };
  derived: {
    mood: StravaActivitySignalsMood;
    style: StravaActivitySignalsStyle;
    subject: StravaActivitySignalsSubject;
    terrain: StravaActivitySignalsTerrain;
    environment: StravaActivitySignalsEnvironment;
    atmosphere: StravaActivitySignalsAtmosphere;
  };
}

export interface ValidationResult<T = unknown> {
  /** Whether the validation passed. */
  valid: boolean;
  /** Array of error messages if validation failed. */
  errors: string[];
  /** Sanitized version of the input if validation failed but sanitization was possible. */
  sanitized?: T;
}

/**
 * Validation result for activity data.
 */
export type StravaActivityValidationResult = ValidationResult<StravaActivity>;

/**
 * Validation result for activity signals.
 */
export type StravaActivitySignalsValidationResult = ValidationResult<StravaActivitySignals>;
