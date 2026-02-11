import { describe, test, expect } from 'bun:test';

import { Input } from './types';
import classifyIntensity from './classify-intensity';
import { StravaActivitySignalsIntensity } from '../types';

type Case = [string, Input, StravaActivitySignalsIntensity];

describe('classify-intensity', () => {
  test.each<Case>([
    [
      'low intensity based on slow pace',
      {
        distance: 5000, // 5km
        moving_time: 1800, // 30 minutes = 6:00 min/km
      },
      'low',
    ],
    [
      'high intensity based on fast pace',
      {
        distance: 5000, // 5km
        moving_time: 1200, // 20 minutes = 4:00 min/km
      },
      'high',
    ],
    [
      'medium intensity based on moderate pace',
      {
        distance: 5000, // 5km
        moving_time: 1500, // 25 minutes = 5:00 min/km
      },
      'medium',
    ],
    [
      'high intensity based on high power',
      {
        average_watts: 300,
      },
      'high',
    ],
    [
      'low intensity based on low power',
      {
        average_watts: 100,
      },
      'low',
    ],
    ['default to medium when no clear indicators', {}, 'medium'],
  ])('%#. %s', (_name, activity, expected) => {
    const result = classifyIntensity(activity);

    expect(result).toBe(expected);
  });
});
