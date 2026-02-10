import { describe, test, expect } from 'bun:test';
import classifyIntensity from './classify-intensity';
import { StravaActivity } from '@pace/strava-api';

type Case = [
  string,
  {
    activity: StravaActivity;
    expectedIntensity: 'low' | 'medium' | 'high';
  },
];

describe('classify-intensity', () => {
  test.each<Case>([
    [
      'low intensity based on slow pace',
      {
        activity: {
          id: 1,
          type: 'Run',
          sport_type: 'Run',
          distance: 5000, // 5km
          moving_time: 1800, // 30 minutes = 6:00 min/km
        },
        expectedIntensity: 'low',
      },
    ],
    [
      'high intensity based on fast pace',
      {
        activity: {
          id: 2,
          type: 'Run',
          sport_type: 'Run',
          distance: 5000, // 5km
          moving_time: 1200, // 20 minutes = 4:00 min/km
        },
        expectedIntensity: 'high',
      },
    ],
    [
      'medium intensity based on moderate pace',
      {
        activity: {
          id: 3,
          type: 'Run',
          sport_type: 'Run',
          distance: 5000, // 5km
          moving_time: 1500, // 25 minutes = 5:00 min/km
        },
        expectedIntensity: 'medium',
      },
    ],
    [
      'high intensity based on high power',
      {
        activity: {
          id: 4,
          type: 'Ride',
          sport_type: 'Ride',
          average_watts: 300,
        },
        expectedIntensity: 'high',
      },
    ],
    [
      'low intensity based on low power',
      {
        activity: {
          id: 5,
          type: 'Ride',
          sport_type: 'Ride',
          average_watts: 100,
        },
        expectedIntensity: 'low',
      },
    ],
    [
      'default to medium when no clear indicators',
      {
        activity: {
          id: 6,
          type: 'Run',
          sport_type: 'Run',
        },
        expectedIntensity: 'medium',
      },
    ],
  ])('%s', (_name, { activity, expectedIntensity }) => {
    const result = classifyIntensity(activity);
    expect(result).toBe(expectedIntensity);
  });
});
