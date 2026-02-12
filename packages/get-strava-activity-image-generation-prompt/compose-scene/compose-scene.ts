import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import { DEFAULT_SUBJECT, SUBJECTS } from './constants';
import {
  StravaActivityImageGeneraionPromptAtmosphere,
  StravaActivityImageGeneraionPromptEnvironment,
  StravaActivityImageGeneraionPromptTerrain,
} from '../types';
import { Output } from './types';

/**
 * Extracts terrain information from the elevation.
 * @param {StravaActivitySignals} signals - Strava activity signals.
 * @returns {StravaActivityImageGeneraionPromptTerrain} Terrain information.
 * @internal
 */
const getTerrain = (
  signals: StravaActivitySignals,
): StravaActivityImageGeneraionPromptTerrain => {
  switch (signals.elevation) {
    case 'mountainous': {
      return 'mountainous terrain';
    }
    case 'rolling': {
      return 'rolling hills';
    }
    default: {
      return 'flat terrain';
    }
  }
};

/**
 * Extracts environment details.
 * @param {StravaActivitySignals} signals - Strava sctivity signals.
 * @returns {StravaActivityImageGeneraionPromptEnvironment} Activity environment details.
 * @internal
 */
const getEnvironment = (
  signals: StravaActivitySignals,
): StravaActivityImageGeneraionPromptEnvironment => (
  signals.activityType.includes('Virtual')
    ? 'indoor training space'
    : 'outdoor training space'
);

/**
 * Extracts atmosphere details.
 * @param {StravaActivitySignals} signals - Strava sctivity signals.
 * @returns {StravaActivityImageGeneraionPromptEnvironment} Activity atmosphere details.
 * @internal
 */
const getAtmosphere = (
  signals: StravaActivitySignals,
): StravaActivityImageGeneraionPromptAtmosphere => {
  switch (signals.timeOfDay) {
    case 'morning': {
      return 'soft morning light';
    }
    case 'day': {
      return 'bright daylight';
    }
    case 'evening': {
      return 'warm evening glow';
    }
    case 'night': {
      return 'dark night atmosphere';
    }
    default: {
      return 'soft neutral light';
    }
  }
};

/**
 * Composes scene description from activity signals.
 *
 * Builds environment description based on activity type, elevation,
 * and time of day. Scene composition follows priority order:
 * base environment → terrain → lighting → atmosphere.
 *
 * Scene composition priority:
 * 1. Base environment (from activity type)
 * 2. Terrain features (from elevation)
 * 3. Weather elements (if applicable)
 * 4. Lighting (from time of day)
 * 5. Atmosphere (from mood)
 *
 * @param {StravaActivitySignals} signals - Activity signals to compose scene from.
 * @returns {Output} Subject and scene description.
 */
const composeScene = (signals: StravaActivitySignals): Output => {
  const subject = SUBJECTS[signals.activityType] ?? DEFAULT_SUBJECT;
  const scene = [
    getEnvironment(signals),
    getTerrain(signals),
    getAtmosphere(signals),
  ].join(', ');

  return { subject, scene };
};

export default composeScene;
