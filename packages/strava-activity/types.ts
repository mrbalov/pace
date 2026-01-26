/**
 * Activity data structure matching guardrails spec.
 */
export type Activity = {
  /** Required activity type. */
  type: string;
  /** Required sport type. */
  sport_type: string;
  distance?: number;
  avg_hr?: number;
  pace?: number;
  elevation_gain?: number;
  time_of_day?: string;
  weather?: string;
  name?: string;
  description?: string;
  tags?: string[];
  gear?: string;
  id?: number;
  start_date?: string;
  start_date_local?: string;
  timezone?: string;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  average_speed?: number;
  max_speed?: number;
  average_cadence?: number;
  average_temp?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate?: boolean;
  max_watts?: number;
  elev_high?: number;
  elev_low?: number;
  calories?: number;
};

/**
 * Strava API response type (raw format from API).
 */
export type ActivityStravaApiResponse = {
  id: number;
  resource_state?: number;
  external_id?: string;
  upload_id?: number;
  athlete?: {
    id: number;
    resource_state?: number;
  };
  name?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  type: string;
  sport_type: string;
  start_date?: string;
  start_date_local?: string;
  timezone?: string;
  utc_offset?: number;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  achievement_count?: number;
  kudos_count?: number;
  comment_count?: number;
  athlete_count?: number;
  photo_count?: number;
  map?: {
    id?: string;
    polyline?: string;
    resource_state?: number;
    summary_polyline?: string;
  };
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  private?: boolean;
  flagged?: boolean;
  gear_id?: string;
  from_accepted_tag?: boolean;
  average_speed?: number;
  max_speed?: number;
  average_cadence?: number;
  average_temp?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate?: boolean;
  max_watts?: number;
  elev_high?: number;
  elev_low?: number;
  pr_count?: number;
  total_photo_count?: number;
  has_kudoed?: boolean;
  workout_type?: number;
  suffer_score?: number | null;
  description?: string;
  calories?: number;
  segment_efforts?: Array<Record<string, unknown>>;
  splits_metric?: Array<Record<string, unknown>>;
  laps?: Array<Record<string, unknown>>;
  gear?: {
    id?: string;
    primary?: boolean;
    name?: string;
    resource_state?: number;
    distance?: number;
  };
  partner_brand_tag?: string | null;
  photos?: Record<string, unknown>;
  highlighted_kudosers?: Array<Record<string, unknown>>;
  hide_from_home?: boolean;
  device_name?: string;
  embed_token?: string;
  segment_leaderboard_opt_out?: boolean;
  leaderboard_opt_out?: boolean;
};

/**
 * Activity validation result from Activity Guardrails.
 */
export type ActivityValidationResult = {
  /** Whether the activity is valid. */
  valid: boolean;
  /** Validation errors if any. */
  errors?: string[];
};

/**
 * Activity Guardrails interface (dependency for validation).
 */
export type ActivityGuardrails = {
  /**
   * Validates an activity and returns validation result.
   * @param {Activity} activity - The activity to validate
   * @returns {ActivityValidationResult} Validation result
   */
  validateActivity: (activity: Activity) => ActivityValidationResult;
};

/**
 * Module configuration for Activity module.
 */
export type ActivityConfig = {
  /** OAuth2 access token for Strava API. */
  accessToken: string;
  /** OAuth2 refresh token for token refresh. */
  refreshToken?: string;
  /** OAuth2 client ID for token refresh. */
  clientId?: string;
  /** OAuth2 client secret for token refresh. */
  clientSecret?: string;
  /** Strava API base URL (defaults to https://www.strava.com/api/v3). */
  baseUrl?: string;
  /** Activity Guardrails instance for validation (dependency injection). */
  guardrails?: ActivityGuardrails;
};

/**
 * Activity error codes.
 */
export type ActivityErrorCode =
  | 'INVALID_ID'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_FAILED'
  | 'MALFORMED_RESPONSE';

/**
 * Activity error structure.
 */
export type ActivityError = {
  /** Error code. */
  code: ActivityErrorCode;
  /** User-friendly error message. */
  message: string;
  /** Whether the error is retryable. */
  retryable?: boolean;
};

/**
 * Token refresh response from Strava OAuth endpoint.
 */
export type ActivityTokenRefreshResponse = {
  /** New access token. */
  access_token?: string;
  /** New refresh token (optional). */
  refresh_token?: string;
};
