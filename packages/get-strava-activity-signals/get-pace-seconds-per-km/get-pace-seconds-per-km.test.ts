import { describe, test, expect } from 'bun:test';

import getPaceSecondsPerKm from './get-pace-seconds-per-km';

type Case = [
  string,
  {
    movingTime: number;
    distance: number;
    expectedPace: number;
  },
];

describe('get-pace-seconds-per-km', () => {
  test.each<Case>([
    [
      'standard 5k run at 5 min/km pace',
      {
        movingTime: 1500,
        distance: 5000,
        expectedPace: 300,
      },
    ],
    [
      'standard 10k run at 6 min/km pace',
      {
        movingTime: 3600,
        distance: 10000,
        expectedPace: 360,
      },
    ],
    [
      'marathon at 4:30 min/km pace',
      {
        movingTime: 11385,
        distance: 42195,
        expectedPace: 269.8186988979737,
      },
    ],
    [
      'short 1k sprint at 3 min/km pace',
      {
        movingTime: 180,
        distance: 1000,
        expectedPace: 180,
      },
    ],
    [
      'ultra distance 50k run at 7 min/km pace',
      {
        movingTime: 21000,
        distance: 50000,
        expectedPace: 420,
      },
    ],
    [
      'very slow pace at 10 min/km',
      {
        movingTime: 3000,
        distance: 5000,
        expectedPace: 600,
      },
    ],
    [
      'fast pace at 3:30 min/km',
      {
        movingTime: 1050,
        distance: 5000,
        expectedPace: 210,
      },
    ],
    [
      'short distance with fractional kilometers',
      {
        movingTime: 150,
        distance: 500,
        expectedPace: 300,
      },
    ],
    [
      'very short distance 100m',
      {
        movingTime: 20,
        distance: 100,
        expectedPace: 200,
      },
    ],
    [
      'long distance bike ride',
      {
        movingTime: 7200,
        distance: 100000,
        expectedPace: 72,
      },
    ],
    [
      'zero moving time returns zero pace',
      {
        movingTime: 0,
        distance: 5000,
        expectedPace: 0,
      },
    ],
    [
      'negative moving time returns zero pace',
      {
        movingTime: -100,
        distance: 5000,
        expectedPace: 0,
      },
    ],
    [
      'zero distance returns zero pace',
      {
        movingTime: 1500,
        distance: 0,
        expectedPace: 0,
      },
    ],
    [
      'negative distance returns zero pace',
      {
        movingTime: 1500,
        distance: -5000,
        expectedPace: 0,
      },
    ],
    [
      'both zero values return zero pace',
      {
        movingTime: 0,
        distance: 0,
        expectedPace: 0,
      },
    ],
    [
      'both negative values return zero pace',
      {
        movingTime: -100,
        distance: -5000,
        expectedPace: 0,
      },
    ],
    [
      'very small distance calculates correctly',
      {
        movingTime: 10,
        distance: 50,
        expectedPace: 200,
      },
    ],
    [
      'very large distance calculates correctly',
      {
        movingTime: 36000,
        distance: 200000,
        expectedPace: 180,
      },
    ],
    [
      'decimal result is preserved',
      {
        movingTime: 1000,
        distance: 3333,
        // eslint-disable-next-line no-loss-of-precision
        expectedPace: 300.03000300030005,
      },
    ],
    [
      'pace calculation with typical real-world values',
      {
        movingTime: 2456,
        distance: 8234,
        expectedPace: 298.27544328394464,
      },
    ],
  ])('%#. %s', (_name, { movingTime, distance, expectedPace }) => {
    const result = getPaceSecondsPerKm(movingTime, distance);

    expect(result).toBe(expectedPace);
  });
});
