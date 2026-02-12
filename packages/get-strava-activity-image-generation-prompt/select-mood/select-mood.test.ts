import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import selectMood from './select-mood';
import { StravaActivityImageGenerationPromptMood } from '../types';

type Case = [
  string,
  StravaActivitySignals,
  StravaActivityImageGenerationPromptMood,
];

describe('select-mood', () => {
  test.each<Case>([
    [
      'recovery tag selects calm mood',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: ['recovery'],
      },
      'calm',
    ],
    [
      'race tag selects intense mood',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: ['race'],
      },
      'intense',
    ],
    [
      'low intensity selects calm mood',
      {
        activityType: 'Run',
        intensity: 'low',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      'calm',
    ],
    [
      'high intensity selects intense mood',
      {
        activityType: 'Run',
        intensity: 'high',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      'intense',
    ],
    [
      'medium intensity selects focused mood',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      'focused',
    ],
  ])('%#. %s', (_name, signals, expected) => {
    const result = selectMood(signals);

    expect(result).toBe(expected);
  });
});
