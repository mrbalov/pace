import { StravaActivity } from '@pace/strava-api';
import { StravaActivitySignals } from '../types';
import validateActivity from '../guardrails/validate-activity';
import validateActivitySignals from '../guardrails/validate-signals';
import classifyIntensity from './classify-intensity';
import classifyElevation from './classify-elevation';
import extractTimeSignals from './extract-time-signals';
import extractWeatherSignals from './extract-weather-signals';
import extractTagSignals from './extract-tag-signals';
import normalizeText from './normalize-text';

/**
 * Extracts semantic signals from Strava activity data.
 *
 * Main entry point for signal extraction. Processes activity data to extract
 * all semantic signals needed for prompt generation, including intensity,
 * elevation, time of day, weather, tags, and semantic context from user text.
 *
 * Signal extraction process:
 * 1. Validates activity data via Activity Guardrails
 * 2. Extracts activity type from sport_type
 * 3. Classifies intensity based on pace/heart rate/power
 * 4. Classifies elevation based on elevation gain
 * 5. Extracts time of day from activity timestamps
 * 6. Extracts weather signals if available
 * 7. Normalizes and extracts tags
 * 8. Processes user text (name, description) for semantic context
 * 9. Validates extracted signals via Activity Guardrails
 *
 * @param {StravaActivity} activity - Strava activity data to extract signals from
 * @returns {StravaActivitySignals} Extracted and validated activity signals
 * @throws {Error} Throws error if activity validation fails
 */
const getActivitySignals = (activity: StravaActivity): StravaActivitySignals => {
  // Validate activity first
  const activityValidation = validateActivity(activity);

  const result = (() => {
    if (!activityValidation.valid) {
      throw new Error(`Activity validation failed: ${activityValidation.errors.join(', ')}`);
    } else {
      // Extract activity type
      const activityType = activity.sport_type ?? activity.type ?? 'Unknown';

      // Classify intensity
      const intensity = classifyIntensity(activity);

      // Classify elevation
      const elevation = classifyElevation(activity);

      // Extract time of day
      const timeOfDay = extractTimeSignals(activity);

      // Extract weather (optional)
      const weather = extractWeatherSignals(activity);

      // Extract tags
      const tags = extractTagSignals(activity);

      // Extract semantic context from user text
      const semanticContextParts: string[] = [];

      if (activity.name) {
        const nameSignals = normalizeText(activity.name);
        semanticContextParts.push(...nameSignals);
      }

      if (activity.description) {
        const descSignals = normalizeText(activity.description);
        semanticContextParts.push(...descSignals);
      }

      const semanticContext = semanticContextParts.length > 0 ? semanticContextParts : undefined;

      // Extract brands from gear (if available and compliant)
      const brands: string[] | undefined = activity.gear?.name ? [activity.gear.name] : undefined;

      // Build signals object
      const signals: StravaActivitySignals = {
        activityType,
        intensity,
        elevation,
        timeOfDay,
        weather,
        tags,
        brands,
        semanticContext,
      };

      // Validate signals
      const signalsValidation = validateActivitySignals(signals);

      if (!signalsValidation.valid) {
        if (signalsValidation.sanitized) {
          return signalsValidation.sanitized;
        } else {
          throw new Error(`Signal validation failed: ${signalsValidation.errors.join(', ')}`);
        }
      } else {
        return signals;
      }
    }
  })();

  return result;
};

export default getActivitySignals;
