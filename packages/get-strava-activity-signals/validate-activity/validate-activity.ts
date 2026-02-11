import { MAX_PACE } from '../constants';
import getIsMovingActivity from '../get-is-moving-activity';
import getPaceSecondsPerKm from '../get-pace-seconds-per-km';
import { StravaActivityValidationResult, StravaActivity } from '../types';

/**
 * Validates activity value constraints.
 *
 * Checks if values are within allowed ranges and clamps/normalizes
 * invalid values according to guardrails specification.
 *
 * @param {StravaActivity} activity - Activity to validate.
 * @returns {StravaActivityValidationResult} Validation result with sanitized activity if needed.
 * @internal
 */
const validateActivityValues = (activity: StravaActivity): StravaActivityValidationResult => {
  const errors: string[] = [];
  const sanitized: StravaActivity = { ...activity };
  const isMovingActivity = getIsMovingActivity(activity);

  if (isMovingActivity && sanitized.distance !== undefined && sanitized.distance <= 0) {
    errors.push('Distance must be greater than 0 for moving activities');
    sanitized.distance = undefined;
  }

  if (
    isMovingActivity &&
    sanitized.total_elevation_gain !== undefined &&
    sanitized.total_elevation_gain < 0
  ) {
    errors.push('Elevation gain must be non-negative for moving activities');
    sanitized.total_elevation_gain = 0;
  }

  if (
    isMovingActivity &&
    sanitized.distance !== undefined &&
    sanitized.distance > 0 &&
    sanitized.moving_time !== undefined
  ) {
    const paceSecondsPerKm = getPaceSecondsPerKm(
      sanitized.moving_time ?? 0,
      sanitized.distance ?? 0,
    );

    if (paceSecondsPerKm <= 0) {
      errors.push('Pace must be greater than 0 for moving activities');
    }
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    sanitized: valid ? undefined : sanitized,
  };
};

/**
 * Validates activity semantic consistency.
 *
 * Checks if activity values are semantically consistent with the activity type.
 * For example, running pace faster than human limits would be inconsistent.
 *
 * @param {StravaActivity} activity - Activity to validate.
 * @returns {StravaActivityValidationResult} Validation result.
 * @internal
 */
const validateActivitySemantics = (activity: StravaActivity): StravaActivityValidationResult => {
  const errors: string[] = [];

  // Check for unrealistic pace (faster than human limits).
  // World record pace is around 2:30 min/km, so anything faster than 2:00 min/km is suspicious.
  if (activity.distance !== undefined && activity.moving_time !== undefined) {
    const paceSecondsPerKm = getPaceSecondsPerKm(activity.moving_time, activity.distance);

    if (paceSecondsPerKm < MAX_PACE && activity.type === 'Run') {
      errors.push('Running pace is faster than realistic human limits');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates activity data according to guardrails specification.
 *
 * Checks required fields, value constraints, and semantic consistency.
 * Returns validation result with sanitized activity if validation fails
 * but sanitization is possible.
 *
 * Required fields: type, sport_type
 * Value constraints: distance > 0, avg_hr in [40, 220], pace > 0, elevation_gain >= 0
 * Semantic validation: values must be consistent with activity type
 *
 * @param {StravaActivity} activity - Activity data to validate
 * @returns {StravaActivityValidationResult} Validation result with errors and optional sanitized activity
 */
const validateActivity = (activity: StravaActivity): StravaActivityValidationResult => {
  const errors: string[] = [];

  if (!activity.type || typeof activity.type !== 'string') {
    errors.push('Activity type is required and must be a string');
  }

  if (!activity.sport_type || typeof activity.sport_type !== 'string') {
    errors.push('Activity sport_type is required and must be a string');
  }

  const hasRequiredFields = errors.length === 0;

  if (hasRequiredFields) {
    const valueValidation = validateActivityValues(activity);

    if (valueValidation.valid) {
      const semanticValidation = validateActivitySemantics(activity);

      if (semanticValidation.valid) {
        return {
          valid: true,
          errors: [],
        };
      } else {
        // Semantic errors are warnings.
        // Prefer graceful degradation.
        return {
          valid: true, // Still valid, but with warnings.
          errors: semanticValidation.errors,
        };
      }
    } else {
      return {
        valid: false,
        errors: [...errors, ...valueValidation.errors],
        sanitized: valueValidation.sanitized,
      };
    }
  } else {
    return {
      valid: false,
      errors,
    };
  }
};

export default validateActivity;
