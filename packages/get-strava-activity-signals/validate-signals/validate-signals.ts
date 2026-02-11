import { StravaActivitySignals, StravaActivitySignalsValidationResult } from '../types';
import checkForbiddenContent from '../check-forbidden-content';
import { ELEVATIONS, INTENSITIES, TIMES_OF_DAY } from '../constants';

/**
 * Validates activity signals according to guardrails specification.
 *
 * Checks that signals comply with guardrails, tags are normalized,
 * and intensity/elevation classifications are valid.
 *
 * Validates:
 * - Intensity is one of: low, medium, high
 * - Elevation is one of: flat, rolling, mountainous
 * - Time of day is one of: morning, day, evening, night
 * - Tags are normalized strings
 * - No forbidden content in semantic context
 *
 * @param {StravaActivitySignals} signals - Activity signals to validate.
 * @returns {StravaActivitySignalsValidationResult} Validation result with errors and optional sanitized signals.
 */
const validateActivitySignals = (
  signals: StravaActivitySignals,
): StravaActivitySignalsValidationResult => {
  const errors: string[] = [];

  // Validate activity type.
  if (!signals.activityType || typeof signals.activityType !== 'string') {
    errors.push('Activity type is required and must be a string');
  }

  // Validate intensity.
  if (signals.intensity && !INTENSITIES.includes(signals.intensity)) {
    errors.push(`Intensity must be one of: ${INTENSITIES.join(', ')}`);
  }

  // Validate elevation.
  if (signals.elevation && !ELEVATIONS.includes(signals.elevation)) {
    errors.push(`Elevation must be one of: ${ELEVATIONS.join(', ')}`);
  }

  // Validate time of day.
  if (signals.timeOfDay && !TIMES_OF_DAY.includes(signals.timeOfDay)) {
    errors.push(`Time of day must be one of: ${TIMES_OF_DAY.join(', ')}`);
  }

  // Validate tags are normalized (array of strings).
  if (signals.tags) {
    const invalidTags = signals.tags.filter((tag) => typeof tag !== 'string');

    if (invalidTags.length > 0) {
      errors.push('All tags must be strings');
    }
  }

  // Check for forbidden content in semantic context.
  if (signals.semanticContext) {
    const hasForbiddenContent = signals.semanticContext.some((context) =>
      checkForbiddenContent(context),
    );

    if (hasForbiddenContent) {
      errors.push('Semantic context contains forbidden content');
    }
  }

  // Validate brands.
  if (signals.brands) {
    const invalidBrands = signals.brands.filter((brand) => typeof brand !== 'string');

    if (invalidBrands.length > 0) {
      errors.push('All brands must be strings');
    }
  }

  const valid = errors.length === 0;
  const sanitized: StravaActivitySignals | undefined = valid
    ? undefined
    : {
        ...signals,
        semanticContext: signals.semanticContext?.filter(
          (context) => !checkForbiddenContent(context),
        ),
      };

  return {
    valid,
    errors,
    sanitized,
  };
};

export default validateActivitySignals;
