import { describe, test, expect } from 'bun:test';

import getStravaActivitySignals from './get-strava-activity-signals';
import { StravaActivity, StravaActivitySignals } from '../types';

type Case = [string, StravaActivity, StravaActivitySignals];

describe('get-activity-signals', () => {
  describe('it extracts signals from valid activity', () => {
    test.each<Case>([
      [
        'valid mountain bike ride with minimal fields',
        {
          id: 123456,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          distance: 28099,
          moving_time: 4207,
          total_elevation_gain: 516,
          start_date_local: '2018-02-16T06:52:54Z',
        },
        {
          activityType: 'MountainBikeRide',
          intensity: 'high',
          elevation: 'mountainous',
          timeOfDay: 'morning',
          tags: undefined,
          brands: undefined,
          semanticContext: undefined,
        },
      ],
      [
        'valid running activity with all fields',
        {
          id: 123456,
          type: 'Run',
          sport_type: 'Run',
          name: 'Morning Run',
          description: 'Nice run in the park',
          distance: 5000,
          moving_time: 1500,
          total_elevation_gain: 50,
          start_date_local: '2024-01-01T07:00:00Z',
          gear: { name: 'Nike Shoes' },
        },
        {
          activityType: 'Run',
          intensity: 'medium',
          elevation: 'rolling',
          timeOfDay: 'morning',
          tags: undefined,
          brands: ['Nike Shoes'],
          semanticContext: ['park'],
        },
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const signals = getStravaActivitySignals(activity);

      expect(signals).toStrictEqual(expected);
    });
  });

  describe('it throws error for invalid activity', () => {
    test('throws error for invalid activity', () => {
      const activity: StravaActivity = {
        id: 123456,
        // Missing required fields...
      } as StravaActivity;

      expect(() => getStravaActivitySignals(activity)).toThrow();
    });
  });
});
