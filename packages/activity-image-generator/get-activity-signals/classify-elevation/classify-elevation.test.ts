import { describe, test, expect } from 'bun:test';
import classifyElevation from './classify-elevation';
import { StravaActivity } from '@pace/strava-api';

type Case = [
  string,
  {
    activity: StravaActivity;
    expectedElevation: 'flat' | 'rolling' | 'mountainous';
  },
];

describe('classify-elevation', () => {
  test.each<Case>([
    [
      'flat terrain with low elevation gain',
      {
        activity: {
          id: 1,
          type: 'Run',
          sport_type: 'Run',
          total_elevation_gain: 30,
        },
        expectedElevation: 'flat',
      },
    ],
    [
      'rolling terrain with moderate elevation gain',
      {
        activity: {
          id: 2,
          type: 'Ride',
          sport_type: 'Ride',
          total_elevation_gain: 300,
        },
        expectedElevation: 'rolling',
      },
    ],
    [
      'mountainous terrain with high elevation gain',
      {
        activity: {
          id: 3,
          type: 'Ride',
          sport_type: 'Ride',
          total_elevation_gain: 800,
        },
        expectedElevation: 'mountainous',
      },
    ],
    [
      'default to flat when elevation gain is undefined',
      {
        activity: {
          id: 4,
          type: 'Run',
          sport_type: 'Run',
        },
        expectedElevation: 'flat',
      },
    ],
  ])('%s', (_name, { activity, expectedElevation }) => {
    const result = classifyElevation(activity);
    expect(result).toBe(expectedElevation);
  });
});
