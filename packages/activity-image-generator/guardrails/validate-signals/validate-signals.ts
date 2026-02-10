import { StravaActivitySignalsValidationResult } from '../types';
import { StravaActivitySignals } from '../../types';
import checkForbiddenContent from '../check-forbidden-content';

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
 * @param {StravaActivitySignals} signals - Activity signals to validate
 * @returns {StravaActivitySignalsValidationResult} Validation result with errors and optional sanitized signals
 */
const validateActivitySignals = (
  signals: StravaActivitySignals,
): StravaActivitySignalsValidationResult => {
  const errors: string[] = [];

  // Validate activity type
  if (!signals.activityType || typeof signals.activityType !== 'string') {
    errors.push('Activity type is required and must be a string');
  }

  // Validate intensity
  const validIntensities: StravaActivitySignals['intensity'][] = ['low', 'medium', 'high'];
  if (!validIntensities.includes(signals.intensity)) {
    errors.push(`Intensity must be one of: ${validIntensities.join(', ')}`);
  }

  // Validate elevation
  const validElevations: StravaActivitySignals['elevation'][] = ['flat', 'rolling', 'mountainous'];
  if (!validElevations.includes(signals.elevation)) {
    errors.push(`Elevation must be one of: ${validElevations.join(', ')}`);
  }

  // Validate time of day
  const validTimeOfDay: StravaActivitySignals['timeOfDay'][] = [
    'morning',
    'day',
    'evening',
    'night',
  ];
  if (!validTimeOfDay.includes(signals.timeOfDay)) {
    errors.push(`Time of day must be one of: ${validTimeOfDay.join(', ')}`);
  }

  // Validate tags are normalized (array of strings)
  if (!Array.isArray(signals.tags)) {
    errors.push('Tags must be an array');
  } else {
    const invalidTags = signals.tags.filter((tag) => typeof tag !== 'string');
    if (invalidTags.length > 0) {
      errors.push('All tags must be strings');
    }
  }

  // Check for forbidden content in semantic context
  if (signals.semanticContext !== undefined) {
    const hasForbidden = signals.semanticContext.some((context) => checkForbiddenContent(context));
    if (hasForbidden) {
      errors.push('Semantic context contains forbidden content');
    }
  }

  // Validate weather if present
  if (signals.weather !== undefined) {
    const validWeather: NonNullable<StravaActivitySignals['weather']>[] = [
      'sunny',
      'rainy',
      'cloudy',
      'foggy',
    ];
    if (!validWeather.includes(signals.weather)) {
      errors.push(`Weather must be one of: ${validWeather.join(', ')}`);
    }
  }

  // Validate brands if present
  if (signals.brands !== undefined) {
    if (!Array.isArray(signals.brands)) {
      errors.push('Brands must be an array');
    } else {
      const invalidBrands = signals.brands.filter((brand) => typeof brand !== 'string');
      if (invalidBrands.length > 0) {
        errors.push('All brands must be strings');
      }
    }
  }

  const valid = errors.length === 0;

  // Create sanitized version if validation failed
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
