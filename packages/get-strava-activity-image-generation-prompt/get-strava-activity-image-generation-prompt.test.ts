import { describe, test, expect } from 'bun:test';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import { StravaActivityImageGenerationPrompt } from './types';
import getStravaActivityImageGenerationPrompt from './get-strava-activity-image-generation-prompt';

type Case = [
  string,
  StravaActivitySignals,
  StravaActivityImageGenerationPrompt,
];

describe('generate-prompt', () => {
  test.each<Case>([
    [
      'generates valid prompt from signals',
      {
        activityType: 'Run',
        intensity: 'medium',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      {},
    ],
    [
      'generates prompt with recovery tag',
      {
        activityType: 'Run',
        intensity: 'low',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: ['recovery'],
      },
      {},
    ],
    [
      'generates prompt with high intensity',
      {
        activityType: 'Run',
        intensity: 'high',
        elevation: 'flat',
        timeOfDay: 'day',
        tags: [],
      },
      {},
    ],
  ])(
    '%#. %s',
    (_name, signals, expected) => {
      const result = getStravaActivityImageGenerationPrompt(signals);

      expect(result).toStrictEqual(expected);
    },
  );
});
