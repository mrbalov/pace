import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import selectStyle from './select-style';
import { StravaActivityImageGenerationPromptStyle } from '../types';

type Case = [
  string,
  StravaActivitySignals,
  StravaActivityImageGenerationPromptStyle,
];

describe('select-style', () => {
  test.each<Case>([
    [
      'recovery tag selects minimal style',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: ['recovery'],
      },
      'minimal',
    ],
    [
      'mountainous elevation selects illustrated style',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'mountainous',
        timeOfDay: 'day',
        tags: [],
      },
      'illustrated',
    ],
    [
      'high intensity Run selects illustrated style',
      {
        activityType: 'Run',
        intensity: 'high',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      'illustrated',
    ],
    [
      'default selects cartoon style',
      {
        activityType: 'Swim',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      'cartoon',
    ],
  ])('%#. %s', (_name, signals, expected) => {
    const result = selectStyle(signals);

    expect(result).toBe(expected);
  });
});
