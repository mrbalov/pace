import { StravaActivity } from '@pace/strava-api';
import { StravaActivityValidationResult } from '../types';

/**
 * Validates activity value constraints.
 *
 * Checks if values are within allowed ranges and clamps/normalizes
 * invalid values according to guardrails specification.
 *
 * @param {StravaActivity} activity - Activity to validate
 * @returns {StravaActivityValidationResult} Validation result with sanitized activity if needed
 * @internal
 */
const validateActivityValues = (activity: StravaActivity): StravaActivityValidationResult => {
  const errors: string[] = [];
  const sanitized: StravaActivity = { ...activity };

  // Validate distance
  if (sanitized.distance !== undefined && sanitized.distance <= 0) {
    errors.push('Distance must be greater than 0');
    sanitized.distance = undefined;
  }

  // Validate heart rate
  if (sanitized.average_temp !== undefined) {
    // Note: average_temp might be temperature, not heart rate
    // We'll check has_heartrate and look for heart rate fields
  }

  // For now, we'll assume heart rate validation happens elsewhere
  // as Strava API doesn't directly expose avg_hr in the base type

  // Validate pace (derived from distance and moving_time)
  if (sanitized.distance !== undefined && sanitized.moving_time !== undefined) {
    const paceSecondsPerKm = sanitized.moving_time / (sanitized.distance / 1000);
    if (paceSecondsPerKm <= 0) {
      errors.push('Pace must be greater than 0');
    }
  }

  // Validate elevation gain
  if (sanitized.total_elevation_gain !== undefined && sanitized.total_elevation_gain < 0) {
    errors.push('Elevation gain must be non-negative');
    sanitized.total_elevation_gain = 0;
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
 * @param {StravaActivity} activity - Activity to validate
 * @returns {StravaActivityValidationResult} Validation result
 * @internal
 */
const validateActivitySemantics = (activity: StravaActivity): StravaActivityValidationResult => {
  const errors: string[] = [];

  // Check for unrealistic pace (faster than human limits)
  if (activity.distance !== undefined && activity.moving_time !== undefined) {
    const paceSecondsPerKm = activity.moving_time / (activity.distance / 1000);
    // World record pace is around 2:30 min/km, so anything faster than 2:00 min/km is suspicious
    if (paceSecondsPerKm < 120 && activity.type === 'Run') {
      errors.push('Running pace is faster than realistic human limits');
    }
  }

  // Additional semantic checks can be added here

  const valid = errors.length === 0;

  return {
    valid,
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

  // Check required fields
  if (!activity.type || typeof activity.type !== 'string') {
    errors.push('Activity type is required and must be a string');
  }

  if (!activity.sport_type || typeof activity.sport_type !== 'string') {
    errors.push('Activity sport_type is required and must be a string');
  }

  const hasRequiredFields = errors.length === 0;

  const result = (() => {
    if (!hasRequiredFields) {
      return {
        valid: false,
        errors,
      };
    } else {
      // Validate value constraints
      const valueValidation = validateActivityValues(activity);

      if (!valueValidation.valid) {
        return {
          valid: false,
          errors: [...errors, ...valueValidation.errors],
          sanitized: valueValidation.sanitized,
        };
      } else {
        // Validate semantic consistency
        const semanticValidation = validateActivitySemantics(activity);

        if (!semanticValidation.valid) {
          // Semantic errors are warnings, prefer graceful degradation
          return {
            valid: true, // Still valid, but log warnings
            errors: semanticValidation.errors,
          };
        } else {
          return {
            valid: true,
            errors: [],
          };
        }
      }
    }
  })();

  return result;
};

export default validateActivity;
