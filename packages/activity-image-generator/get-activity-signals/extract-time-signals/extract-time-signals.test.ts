import { describe, test, expect } from 'bun:test';
import extractTimeSignals from './extract-time-signals';
import { StravaActivity } from '@pace/strava-api';

type Case = [
  string,
  {
    activity: StravaActivity;
    expectedTimeOfDay: 'morning' | 'day' | 'evening' | 'night';
  },
];

describe('extract-time-signals', () => {
  test.each<Case>([
    [
      'morning activity',
      {
        activity: {
          id: 1,
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-01T07:00:00Z',
        },
        expectedTimeOfDay: 'morning',
      },
    ],
    [
      'daytime activity',
      {
        activity: {
          id: 2,
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-01T14:00:00Z',
        },
        expectedTimeOfDay: 'day',
      },
    ],
    [
      'evening activity',
      {
        activity: {
          id: 3,
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-01T18:00:00Z',
        },
        expectedTimeOfDay: 'evening',
      },
    ],
    [
      'night activity',
      {
        activity: {
          id: 4,
          type: 'Run',
          sport_type: 'Run',
          start_date_local: '2024-01-01T22:00:00Z',
        },
        expectedTimeOfDay: 'night',
      },
    ],
    [
      'default to day when no time available',
      {
        activity: {
          id: 5,
          type: 'Run',
          sport_type: 'Run',
        },
        expectedTimeOfDay: 'day',
      },
    ],
  ])('%s', (_name, { activity, expectedTimeOfDay }) => {
    const result = extractTimeSignals(activity);
    expect(result).toBe(expectedTimeOfDay);
  });
});
