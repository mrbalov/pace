import { StravaActivitySignals, StravaActivitySignalsValidationResult } from '../types';
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
 * @param {Function} checkForbiddenContent - Function to check for forbidden content in the text.
 * @returns {StravaActivitySignalsValidationResult} Validation result with errors and optional sanitized signals.
 */
const validateActivitySignals = (
  signals: StravaActivitySignals,
  checkForbiddenContent: (input: string) => boolean,
): StravaActivitySignalsValidationResult => {
  const errors: string[] = [];
  const { core } = signals;

  // Validate activity type.
  if (!core.activityType || typeof core.activityType !== 'string') {
    errors.push('Activity type is required and must be a string');
  }

  // Validate intensity.
  if (core.intensity && !INTENSITIES.includes(core.intensity)) {
    errors.push(`Intensity must be one of: ${INTENSITIES.join(', ')}`);
  }

  // Validate elevation.
  if (core.elevation && !ELEVATIONS.includes(core.elevation)) {
    errors.push(`Elevation must be one of: ${ELEVATIONS.join(', ')}`);
  }

  // Validate time of day.
  if (core.timeOfDay && !TIMES_OF_DAY.includes(core.timeOfDay)) {
    errors.push(`Time of day must be one of: ${TIMES_OF_DAY.join(', ')}`);
  }

  // Validate tags are normalized (array of strings).
  if (core.tags) {
    const invalidTags = core.tags.filter((tag) => typeof tag !== 'string');

    if (invalidTags.length > 0) {
      errors.push('All tags must be strings');
    }
  }

  // Check for forbidden content in semantic context.
  if (core.semanticContext) {
    const hasForbiddenContent = core.semanticContext.some((context) =>
      checkForbiddenContent(context),
    );

    if (hasForbiddenContent) {
      errors.push('Semantic context contains forbidden content');
    }
  }

  // Validate brands.
  if (core.brands) {
    const invalidBrands = core.brands.filter((brand) => typeof brand !== 'string');

    if (invalidBrands.length > 0) {
      errors.push('All brands must be strings');
    }
  }

  const valid = errors.length === 0;
  const sanitized: StravaActivitySignals | undefined = valid
    ? undefined
    : {
        ...signals,
        core: {
          ...core,
          semanticContext: core.semanticContext?.filter(
            (context) => !checkForbiddenContent(context),
          ),
        },
      };

  return {
    valid,
    errors,
    sanitized,
  };
};

export default validateActivitySignals;
