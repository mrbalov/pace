import { describe, test, expect } from 'bun:test';
import selectStyle from './select-style';
import { StravaActivitySignals } from '../../types';

type Case = [
  string,
  {
    signals: StravaActivitySignals;
    expectedStyle: 'cartoon' | 'minimal' | 'abstract' | 'illustrated';
  },
];

describe('select-style', () => {
  test.each<Case>([
    [
      'recovery tag selects minimal style',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: ['recovery'],
        },
        expectedStyle: 'minimal',
      },
    ],
    [
      'foggy weather selects abstract style',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
          weather: 'foggy',
        },
        expectedStyle: 'abstract',
      },
    ],
    [
      'mountainous elevation selects illustrated style',
      {
        signals: {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'mountainous',
          timeOfDay: 'day',
          tags: [],
        },
        expectedStyle: 'illustrated',
      },
    ],
    [
      'high intensity Run selects illustrated style',
      {
        signals: {
          activityType: 'Run',
          intensity: 'high',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        expectedStyle: 'illustrated',
      },
    ],
    [
      'default selects cartoon style',
      {
        signals: {
          activityType: 'Swim',
          intensity: 'medium',
          elevation: 'flat',
          timeOfDay: 'day',
          tags: [],
        },
        expectedStyle: 'cartoon',
      },
    ],
  ])('%s', (_name, { signals, expectedStyle }) => {
    const result = selectStyle(signals);
    expect(result).toBe(expectedStyle);
  });
});
