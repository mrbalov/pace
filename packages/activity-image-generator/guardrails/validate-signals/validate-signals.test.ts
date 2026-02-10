import { describe, test, expect } from 'bun:test';
import validateActivitySignals from './validate-signals';
import { StravaActivitySignals } from '../../types';

type Case = [
  string,
  {
    signals: StravaActivitySignals;
    expectedValid: boolean;
    expectedErrors?: string[];
  },
];

describe('validate-signals', () => {
  test.each<Case>([
    [
      'valid signals with all required fields',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        expectedValid: true,
        expectedErrors: [],
      },
    ],
    [
      'signals with invalid intensity',
      {
        signals: {
          activityType: 'Run',
          intensity: 'invalid' as 'low',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        expectedValid: false,
        expectedErrors: ['Intensity must be one of: low, medium, high'],
      },
    ],
    [
      'signals with invalid elevation',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'invalid' as 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        expectedValid: false,
        expectedErrors: ['Elevation must be one of: flat, rolling, mountainous'],
      },
    ],
    [
      'signals with invalid time of day',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'invalid' as 'morning',
          tags: [],
        },
        expectedValid: false,
        expectedErrors: ['Time of day must be one of: morning, day, evening, night'],
      },
    ],
    [
      'signals with invalid tags array',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: 'not-an-array' as unknown as string[],
        },
        expectedValid: false,
        expectedErrors: ['Tags must be an array'],
      },
    ],
    [
      'signals with valid weather',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
          weather: 'sunny',
        },
        expectedValid: true,
        expectedErrors: [],
      },
    ],
    [
      'signals with invalid weather',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
          weather: 'invalid' as 'sunny',
        },
        expectedValid: false,
        expectedErrors: ['Weather must be one of: sunny, rainy, cloudy, foggy'],
      },
    ],
  ])('%s', (_name, { signals, expectedValid, expectedErrors }) => {
    const result = validateActivitySignals(signals);

    expect(result.valid).toBe(expectedValid);

    if (expectedErrors !== undefined) {
      expect(result.errors).toStrictEqual(expectedErrors);
    }
  });
});
