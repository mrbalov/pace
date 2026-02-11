import { describe, test, expect } from 'bun:test';

import { Input } from './types';
import classifyElevation from './classify-elevation';
import { StravaActivitySignalsElevation } from '../types';

type Case = [string, Input, StravaActivitySignalsElevation];

describe('classify-elevation', () => {
  test.each<Case>([
    ['flat terrain with low elevation gain', { total_elevation_gain: 30 }, 'flat'],
    ['rolling terrain with moderate elevation gain', { total_elevation_gain: 300 }, 'rolling'],
    [
      'mountainous terrain with moderate elevation gain',
      { total_elevation_gain: 600 },
      'mountainous',
    ],
    ['mountainous terrain with high elevation gain', { total_elevation_gain: 800 }, 'mountainous'],
    [
      'default to flat when elevation gain is undefined',
      { total_elevation_gain: undefined },
      'flat',
    ],
    ['default to flat when elevation gain is not defined', {}, 'flat'],
  ])('%#. %s', (_name, elevationGain, expected) => {
    const result = classifyElevation(elevationGain);

    expect(result).toBe(expected);
  });
});
