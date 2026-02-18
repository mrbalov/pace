import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import prettifySignals from './prettifySignals';
import { Output } from './types';

type Case = [string, StravaActivitySignals, Output];

describe('prettifySignals', () => {
  describe('formats single field values', () => {
    test.each<Case>([
      [
        'formats activity type field',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'formats mountain bike ride',
        {
          core: {
            activityType: 'MountainBikeRide',
            intensity: 'high',
            elevation: 'mountainous',
            timeOfDay: 'day',
          },
          derived: {
            mood: 'intense',
            style: 'illustrated',
            subject: 'athlete',
            terrain: 'mountainous terrain',
            environment: 'outdoor training space',
            atmosphere: 'warm evening glow',
          },
        },
        [
          ['Activity Type', 'MountainBikeRide'],
          ['Intensity', 'high'],
          ['Elevation', 'mountainous'],
          ['Time Of Day', 'day'],
          ['Mood', 'intense'],
          ['Style', 'illustrated'],
          ['Subject', 'athlete'],
          ['Terrain', 'mountainous terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'warm evening glow'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('formats array field values', () => {
    test.each<Case>([
      [
        'joins single tag into string',
        {
          core: {
            activityType: 'Run',
            intensity: 'low',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: ['recovery'],
          },
          derived: {
            mood: 'calm',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'soft morning light',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'low'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Tags', 'recovery'],
          ['Mood', 'calm'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'soft morning light'],
        ],
      ],
      [
        'joins multiple tags with comma separator',
        {
          core: {
            activityType: 'Run',
            intensity: 'high',
            elevation: 'rolling',
            timeOfDay: 'evening',
            tags: ['race', 'personal best', 'competition'],
          },
          derived: {
            mood: 'intense',
            style: 'illustrated',
            subject: 'runner',
            terrain: 'rolling hills',
            environment: 'outdoor training space',
            atmosphere: 'warm evening glow',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'high'],
          ['Elevation', 'rolling'],
          ['Time Of Day', 'evening'],
          ['Tags', 'race, personal best, competition'],
          ['Mood', 'intense'],
          ['Style', 'illustrated'],
          ['Subject', 'runner'],
          ['Terrain', 'rolling hills'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'warm evening glow'],
        ],
      ],
      [
        'joins single brand into string',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            brands: ['Nike'],
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Brands', 'Nike'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'joins multiple brands with comma separator',
        {
          core: {
            activityType: 'Ride',
            intensity: 'high',
            elevation: 'mountainous',
            timeOfDay: 'day',
            brands: ['Garmin', 'Specialized', 'Shimano'],
          },
          derived: {
            mood: 'focused',
            style: 'illustrated',
            subject: 'cyclist',
            terrain: 'mountainous terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Ride'],
          ['Intensity', 'high'],
          ['Elevation', 'mountainous'],
          ['Time Of Day', 'day'],
          ['Brands', 'Garmin, Specialized, Shimano'],
          ['Mood', 'focused'],
          ['Style', 'illustrated'],
          ['Subject', 'cyclist'],
          ['Terrain', 'mountainous terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'joins semantic context keywords',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            semanticContext: ['park', 'trail', 'nature'],
          },
          derived: {
            mood: 'calm',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'soft morning light',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Semantic Context', 'park, trail, nature'],
          ['Mood', 'calm'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'soft morning light'],
        ],
      ],
      [
        'includes all array fields together',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'rolling',
            timeOfDay: 'morning',
            tags: ['training', 'long run'],
            brands: ['Garmin', 'Nike'],
            semanticContext: ['trail', 'forest'],
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'soft morning light',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'rolling'],
          ['Time Of Day', 'morning'],
          ['Tags', 'training, long run'],
          ['Brands', 'Garmin, Nike'],
          ['Semantic Context', 'trail, forest'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'soft morning light'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('filters out falsy values', () => {
    test.each<Case>([
      [
        'omits undefined tags field',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'omits all undefined optional fields',
        {
          core: {
            activityType: 'Ride',
            intensity: 'low',
            elevation: 'flat',
            timeOfDay: 'day',
            tags: undefined,
            brands: undefined,
            semanticContext: undefined,
          },
          derived: {
            mood: 'calm',
            style: 'minimal',
            subject: 'cyclist',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Ride'],
          ['Intensity', 'low'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'day'],
          ['Mood', 'calm'],
          ['Style', 'minimal'],
          ['Subject', 'cyclist'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'omits empty array for tags',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: [],
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'omits empty arrays for all optional fields',
        {
          core: {
            activityType: 'Swim',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
            tags: [],
            brands: [],
            semanticContext: [],
          },
          derived: {
            mood: 'calm',
            style: 'minimal',
            subject: 'swimmer',
            terrain: 'flat terrain',
            environment: 'indoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Swim'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'calm'],
          ['Style', 'minimal'],
          ['Subject', 'swimmer'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'indoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles key formatting edge cases', () => {
    test.each<Case>([
      [
        'formats single-word keys correctly',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
      [
        'formats multi-word camelCase keys correctly',
        {
          core: {
            activityType: 'TrailRun',
            intensity: 'high',
            elevation: 'mountainous',
            timeOfDay: 'evening',
            semanticContext: ['mountain', 'wilderness'],
          },
          derived: {
            mood: 'intense',
            style: 'illustrated',
            subject: 'trail runner',
            terrain: 'mountainous terrain',
            environment: 'outdoor training space',
            atmosphere: 'warm evening glow',
          },
        },
        [
          ['Activity Type', 'TrailRun'],
          ['Intensity', 'high'],
          ['Elevation', 'mountainous'],
          ['Time Of Day', 'evening'],
          ['Semantic Context', 'mountain, wilderness'],
          ['Mood', 'intense'],
          ['Style', 'illustrated'],
          ['Subject', 'trail runner'],
          ['Terrain', 'mountainous terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'warm evening glow'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles minimal required fields', () => {
    test.each<Case>([
      [
        'handles only required core and derived fields',
        {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'morning',
          },
          derived: {
            mood: 'focused',
            style: 'minimal',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
        [
          ['Activity Type', 'Run'],
          ['Intensity', 'medium'],
          ['Elevation', 'flat'],
          ['Time Of Day', 'morning'],
          ['Mood', 'focused'],
          ['Style', 'minimal'],
          ['Subject', 'runner'],
          ['Terrain', 'flat terrain'],
          ['Environment', 'outdoor training space'],
          ['Atmosphere', 'bright daylight'],
        ],
      ],
    ])('%#. %s', (_name: string, input: StravaActivitySignals, expected: Output) => {
      const result = prettifySignals(input);
      expect(result).toStrictEqual(expected);
    });
  });
});
