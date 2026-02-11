import { describe, test, expect } from 'bun:test';

import { StravaActivity, StravaActivityValidationResult } from '../types';
import validateActivity from './validate-activity';

type Case = [string, StravaActivity, StravaActivityValidationResult];

describe('validate-activity', () => {
  test.each<Case>([
    [
      'valid activity with required fields',
      {
        id: 123456,
        type: 'Ride',
        sport_type: 'MountainBikeRide',
      },
      {
        valid: true,
        errors: [],
      },
    ],
    [
      'activity missing type field',
      {
        id: 123456,
        sport_type: 'MountainBikeRide',
      } as StravaActivity,
      {
        valid: false,
        errors: ['Activity type is required and must be a string'],
      },
    ],
    [
      'activity missing sport_type field',
      {
        id: 123456,
        type: 'Ride',
      } as StravaActivity,
      {
        valid: false,
        errors: ['Activity sport_type is required and must be a string'],
      },
    ],
    [
      'activity with invalid distance',
      {
        id: 123456,
        type: 'Ride',
        sport_type: 'MountainBikeRide',
        distance: -100,
      },
      {
        valid: false,
        errors: ['Distance must be greater than 0 for moving activities'],
        sanitized: {
          id: 123456,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          distance: undefined,
        },
      },
    ],
    [
      'activity with zero distance',
      {
        id: 123456,
        type: 'Ride',
        sport_type: 'MountainBikeRide',
        distance: 0,
      },
      {
        valid: false,
        errors: ['Distance must be greater than 0 for moving activities'],
        sanitized: {
          id: 123456,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          distance: undefined,
        },
      },
    ],
    [
      'activity with negative elevation gain',
      {
        id: 123456,
        type: 'Ride',
        sport_type: 'MountainBikeRide',
        total_elevation_gain: -50,
      },
      {
        valid: false,
        errors: ['Elevation gain must be non-negative for moving activities'],
        sanitized: {
          id: 123456,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          total_elevation_gain: 0,
        },
      },
    ],
    [
      'activity with valid optional fields',
      {
        id: 123456,
        type: 'Ride',
        sport_type: 'MountainBikeRide',
        distance: 10000,
        total_elevation_gain: 500,
        moving_time: 3600,
      },
      {
        valid: true,
        errors: [],
      },
    ],
    [
      'yoga with zero distance and elevation',
      {
        id: 123456,
        type: 'Yoga',
        sport_type: 'Yoga',
        distance: 0,
        total_elevation_gain: 0,
        moving_time: 1803,
      },
      {
        valid: true,
        errors: [],
      },
    ],
  ])('%#. %s', (_name, activity, expected) => {
    const result = validateActivity(activity);

    expect(result).toStrictEqual(expected);
  });
});
