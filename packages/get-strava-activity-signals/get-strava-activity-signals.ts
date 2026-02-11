import { StravaActivitySignals, StravaActivity } from './types';
import validateActivity from './validate-activity';
import validateSignals from './validate-signals';
import classifyIntensity from './classify-intensity';
import classifyElevation from './classify-elevation';
import extractTimeSignals from './extract-time-of-day-signals';
import extractTagSignals from './extract-tag-signals';
import extractSemanticContext from './extract-semantic-context';
import extractBrandSignals from './extract-brand-signals';

/**
 * Extracts semantic signals from Strava activity data.
 *
 * Main entry point for signal extraction. Processes activity data to extract
 * all semantic signals needed for prompt generation, including intensity,
 * elevation, time of day, tags, and semantic context from user text.
 *
 * Signal extraction process:
 * 1. Validates activity data
 * 2. Extracts activity type from sport_type
 * 3. Classifies intensity based on pace
 * 4. Classifies elevation based on elevation gain
 * 5. Extracts time of day from activity timestamps
 * 6. Normalizes and extracts tags
 * 7. Processes user text (name, description) for semantic context
 * 8. Validates extracted signals
 *
 * @param {StravaActivity} activity - Strava activity data to extract signals from
 * @returns {StravaActivitySignals} Extracted and validated activity signals
 * @throws {Error} Throws error if activity validation fails
 */
const getStravaActivitySignals = (activity: StravaActivity): StravaActivitySignals => {
  const activityValidation = validateActivity(activity);

  if (activityValidation.valid) {
    const signals: StravaActivitySignals = {
      activityType: activity.sport_type ?? activity.type ?? 'Unknown',
      intensity: classifyIntensity(activity),
      elevation: classifyElevation(activity),
      timeOfDay: extractTimeSignals(activity),
      tags: extractTagSignals(activity),
      semanticContext: extractSemanticContext(activity),
      brands: extractBrandSignals(activity),
    };
    const signalsValidation = validateSignals(signals);

    if (signalsValidation.valid) {
      return signals;
    } else if (signalsValidation.sanitized) {
      return signalsValidation.sanitized;
    } else {
      throw new Error(`Signals validation failed: ${signalsValidation.errors.join(', ')}`);
    }
  } else {
    throw new Error(`Activity validation failed: ${activityValidation.errors.join(', ')}`);
  }
};

export default getStravaActivitySignals;
