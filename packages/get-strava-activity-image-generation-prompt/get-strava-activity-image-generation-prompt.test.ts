import { describe, test, expect } from 'bun:test';

import { StravaActivitySignals } from './types';
import getStravaActivityImageGenerationPrompt from './get-strava-activity-image-generation-prompt';

type Case = [
  string,
  StravaActivitySignals,
  string,
];

describe('generate-prompt', () => {
  test.each<Case>([
    [
      'generates valid prompt from signals',
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
      'modern animation style, studio quality, vibrant character design; cartoon style; runner, appealing character design, expressive pose; focused mood; bright daylight atmosphere; outdoor training space; flat terrain; , high quality, sharp, beautiful',
    ],
    [
      'generates prompt with recovery tag',
      {
        core: {
          activityType: 'Run',
          intensity: 'low',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: ['recovery'],
        },
        derived: {
          mood: 'calm',
          style: 'minimal',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      'minimalist graphic design, clean vector art, simple shapes; minimal style; runner, simplified silhouette, clean form; calm mood; bright daylight atmosphere; outdoor training space; flat terrain; , high quality, sharp, beautiful',
    ],
    [
      'generates prompt with high intensity',
      {
        core: {
          activityType: 'Run',
          intensity: 'high',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        derived: {
          mood: 'intense',
          style: 'illustrated',
          subject: 'runner',
          terrain: 'flat terrain',
          environment: 'outdoor training space',
          atmosphere: 'bright daylight',
        },
      },
      'professional editorial illustration, digital art, concept art style; illustrated style; runner, well-proportioned figure, professional anatomy; intense mood; bright daylight atmosphere; outdoor training space; flat terrain; , high quality, sharp, beautiful',
    ],
  ])(
    '%#. %s',
    (_name, signals, expected) => {
      const result = getStravaActivityImageGenerationPrompt(
        signals,
        (input) => input.includes('forbidden'),
      );

      expect(result).toStrictEqual(expected);
    },
  );
});
