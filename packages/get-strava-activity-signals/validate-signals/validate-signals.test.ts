import { describe, test, expect } from 'bun:test';

import validateActivitySignals from './validate-signals';
import { StravaActivitySignals, StravaActivitySignalsValidationResult } from '../types';

type Case = [string, StravaActivitySignals, StravaActivitySignalsValidationResult];

describe('validate-signals', () => {
  test.each<Case>([
    [
      'valid signals with all required fields',
      {
        core: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: true,
        errors: [],
        sanitized: undefined,
      },
    ],
    [
      'signals with invalid intensity',
      {
        core: {
          activityType: 'Run',
          intensity: 'invalid' as 'low',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['Intensity must be one of: low, medium, high'],
        sanitized: {
          core: {
            activityType: 'Run',
            intensity: 'invalid' as 'low',
            elevation: 'flat',
            timeOfDay: 'day',
            tags: [],
            semanticContext: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
    [
      'signals with invalid elevation',
      {
        core: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'invalid' as 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['Elevation must be one of: flat, rolling, mountainous'],
        sanitized: {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'invalid' as 'flat',
            timeOfDay: 'day',
            tags: [],
            semanticContext: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
    [
      'signals with invalid time of day',
      {
        core: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'invalid' as 'morning',
          tags: [],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['Time of day must be one of: morning, day, evening, night'],
        sanitized: {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'invalid' as 'morning',
            tags: [],
            semanticContext: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
    [
      'signals with missing activity type',
      {
        core: {
          activityType: '',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['Activity type is required and must be a string'],
        sanitized: {
          core: {
            activityType: '',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'day',
            tags: [],
            semanticContext: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
    [
      'signals with non-string tags are rejected',
      {
        core: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [123 as unknown as string],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['All tags must be strings'],
        sanitized: {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'day',
            tags: [123 as unknown as string],
            semanticContext: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
    [
      'signals with non-string brands are rejected',
      {
        core: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          brands: [456 as unknown as string],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['All brands must be strings'],
        sanitized: {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'day',
            brands: [456 as unknown as string],
            semanticContext: undefined,
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
    [
      'signals with forbidden content in semantic context',
      {
        core: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          semanticContext: ['morning', 'political rally'],
        },
        derived: {
          mood: 'focused',
          style: 'cartoon',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      {
        valid: false,
        errors: ['Semantic context contains forbidden content'],
        sanitized: {
          core: {
            activityType: 'Run',
            intensity: 'medium',
            elevation: 'flat',
            timeOfDay: 'day',
            semanticContext: ['morning'],
          },
          derived: {
            mood: 'focused',
            style: 'cartoon',
            subject: 'runner',
            terrain: 'flat terrain',
            environment: 'outdoor training space',
            atmosphere: 'bright daylight',
          },
        },
      },
    ],
  ])('%#. %s', (_name, signals, expected) => {
    const result = validateActivitySignals(
      signals,
      (input) => input.includes('forbidden'),
    );

    expect(result).toStrictEqual(expected);
  });
});
