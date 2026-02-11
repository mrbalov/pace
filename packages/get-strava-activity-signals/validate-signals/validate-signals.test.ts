import { describe, test, expect } from 'bun:test';

import validateActivitySignals from './validate-signals';
import { StravaActivitySignals, StravaActivitySignalsValidationResult } from '../types';

type Case = [string, StravaActivitySignals, StravaActivitySignalsValidationResult];

describe('validate-signals', () => {
  test.each<Case>([
    [
      'valid signals with all required fields',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
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
        activityType: 'Run',
        intensity: 'invalid' as 'low',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      {
        valid: false,
        errors: ['Intensity must be one of: low, medium, high'],
        sanitized: {
          activityType: 'Run',
          intensity: 'invalid' as 'low',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
          semanticContext: undefined,
        },
      },
    ],
    [
      'signals with invalid elevation',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'invalid' as 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      {
        valid: false,
        errors: ['Elevation must be one of: flat, rolling, mountainous'],
        sanitized: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'invalid' as 'flat',
          timeOfDay: 'day',
          tags: [],
          semanticContext: undefined,
        },
      },
    ],
    [
      'signals with invalid time of day',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'invalid' as 'morning',
        tags: [],
      },
      {
        valid: false,
        errors: ['Time of day must be one of: morning, day, evening, night'],
        sanitized: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'invalid' as 'morning',
          tags: [],
          semanticContext: undefined,
        },
      },
    ],
  ])('%#. %s', (_name, signals, expected) => {
    const result = validateActivitySignals(signals);

    expect(result).toStrictEqual(expected);
  });
});
