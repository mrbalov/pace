import { describe, test, expect } from 'bun:test';
import transformResponse from './transform-response';
import { ActivityStravaApiResponse, Activity } from '../types';

type Case = [
  string,
  {
    apiResponse: ActivityStravaApiResponse;
    expected: Activity;
  }
];

describe('transform-response', () => {
  test.each<Case>([
    [
      'transforms response with required fields only',
      {
        apiResponse: {
          id: 123456,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
        },
        expected: {
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          id: 123456,
        },
      },
    ],
    [
      'transforms response with all optional fields',
      {
        apiResponse: {
          id: 123456,
          type: 'Run',
          sport_type: 'TrailRun',
          name: 'Morning Run',
          description: 'Great run today',
          distance: 5000,
          total_elevation_gain: 100,
          start_date: '2024-01-01T08:00:00Z',
          start_date_local: '2024-01-01T09:00:00Z',
          timezone: '(GMT+01:00) Europe/Paris',
          moving_time: 1800,
          elapsed_time: 1900,
          average_speed: 2.78,
          max_speed: 3.5,
          average_cadence: 85,
          average_temp: 15,
          average_watts: 200,
          weighted_average_watts: 210,
          kilojoules: 500,
          device_watts: true,
          has_heartrate: true,
          max_watts: 300,
          elev_high: 500,
          elev_low: 400,
          calories: 300,
          gear_id: 'b123',
        },
        expected: {
          type: 'Run',
          sport_type: 'TrailRun',
          id: 123456,
          name: 'Morning Run',
          description: 'Great run today',
          distance: 5000,
          elevation_gain: 100,
          start_date: '2024-01-01T08:00:00Z',
          start_date_local: '2024-01-01T09:00:00Z',
          timezone: '(GMT+01:00) Europe/Paris',
          moving_time: 1800,
          elapsed_time: 1900,
          average_speed: 2.78,
          max_speed: 3.5,
          average_cadence: 85,
          average_temp: 15,
          average_watts: 200,
          weighted_average_watts: 210,
          kilojoules: 500,
          device_watts: true,
          has_heartrate: true,
          max_watts: 300,
          elev_high: 500,
          elev_low: 400,
          calories: 300,
          gear: 'b123',
        },
      },
    ],
    [
      'transforms gear from object with name',
      {
        apiResponse: {
          id: 123456,
          type: 'Ride',
          sport_type: 'Road',
          gear: {
            id: 'b123',
            name: 'Tarmac',
            primary: true,
            resource_state: 2,
            distance: 1000,
          },
        },
        expected: {
          type: 'Ride',
          sport_type: 'Road',
          id: 123456,
          gear: 'Tarmac',
        },
      },
    ],
    [
      'handles missing optional fields',
      {
        apiResponse: {
          id: 789,
          type: 'Swim',
          sport_type: 'Swim',
        },
        expected: {
          type: 'Swim',
          sport_type: 'Swim',
          id: 789,
        },
      },
    ],
    [
      'preserves date formats as strings',
      {
        apiResponse: {
          id: 123,
          type: 'Ride',
          sport_type: 'Ride',
          start_date: '2024-01-01T08:00:00Z',
          start_date_local: '2024-01-01T09:00:00Z',
        },
        expected: {
          type: 'Ride',
          sport_type: 'Ride',
          id: 123,
          start_date: '2024-01-01T08:00:00Z',
          start_date_local: '2024-01-01T09:00:00Z',
        },
      },
    ],
  ])('%#. %s', (_name, { apiResponse, expected }) => {
    const result = transformResponse(apiResponse);
    expect(result).toStrictEqual(expected);
  });
});
