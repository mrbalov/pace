import { describe, test, expect } from 'bun:test';
import getIsMovingActivity from './get-is-moving-activity';
import { Input } from './types';

type Case = [
  string,
  {
    input: Input;
    expected: boolean;
  },
];

describe('get-is-moving-activity', () => {
  describe('identifies moving activities by type field', () => {
    test.each<Case>([
      [
        'Run is a moving activity',
        {
          input: { type: 'Run', sport_type: 'Run' },
          expected: true,
        },
      ],
      [
        'TrailRun is a moving activity',
        {
          input: { type: 'TrailRun', sport_type: 'TrailRun' },
          expected: true,
        },
      ],
      [
        'VirtualRun is a moving activity',
        {
          input: { type: 'VirtualRun', sport_type: 'VirtualRun' },
          expected: true,
        },
      ],
      [
        'Ride is a moving activity',
        {
          input: { type: 'Ride', sport_type: 'Ride' },
          expected: true,
        },
      ],
      [
        'VirtualRide is a moving activity',
        {
          input: { type: 'VirtualRide', sport_type: 'VirtualRide' },
          expected: true,
        },
      ],
      [
        'MountainBikeRide is a moving activity',
        {
          input: { type: 'MountainBikeRide', sport_type: 'MountainBikeRide' },
          expected: true,
        },
      ],
      [
        'EBikeRide is a moving activity',
        {
          input: { type: 'EBikeRide', sport_type: 'EBikeRide' },
          expected: true,
        },
      ],
      [
        'Swim is a moving activity',
        {
          input: { type: 'Swim', sport_type: 'Swim' },
          expected: true,
        },
      ],
      [
        'Surfing is a moving activity',
        {
          input: { type: 'Surfing', sport_type: 'Surfing' },
          expected: true,
        },
      ],
      [
        'Canoeing is a moving activity',
        {
          input: { type: 'Canoeing', sport_type: 'Canoeing' },
          expected: true,
        },
      ],
      [
        'Kayaking is a moving activity',
        {
          input: { type: 'Kayaking', sport_type: 'Kayaking' },
          expected: true,
        },
      ],
      [
        'AlpineSki is a moving activity',
        {
          input: { type: 'AlpineSki', sport_type: 'AlpineSki' },
          expected: true,
        },
      ],
      [
        'BackcountrySki is a moving activity',
        {
          input: { type: 'BackcountrySki', sport_type: 'BackcountrySki' },
          expected: true,
        },
      ],
      [
        'NordicSki is a moving activity',
        {
          input: { type: 'NordicSki', sport_type: 'NordicSki' },
          expected: true,
        },
      ],
      [
        'Snowboard is a moving activity',
        {
          input: { type: 'Snowboard', sport_type: 'Snowboard' },
          expected: true,
        },
      ],
      [
        'Walk is a moving activity',
        {
          input: { type: 'Walk', sport_type: 'Walk' },
          expected: true,
        },
      ],
      [
        'Hike is a moving activity',
        {
          input: { type: 'Hike', sport_type: 'Hike' },
          expected: true,
        },
      ],
      [
        'RockClimbing is a moving activity',
        {
          input: { type: 'RockClimbing', sport_type: 'RockClimbing' },
          expected: true,
        },
      ],
      [
        'Golf is a moving activity',
        {
          input: { type: 'Golf', sport_type: 'Golf' },
          expected: true,
        },
      ],
      [
        'Soccer is a moving activity',
        {
          input: { type: 'Soccer', sport_type: 'Soccer' },
          expected: true,
        },
      ],
      [
        'Tennis is a moving activity',
        {
          input: { type: 'Tennis', sport_type: 'Tennis' },
          expected: true,
        },
      ],
    ])('%s', (_name, { input, expected }) => {
      expect(getIsMovingActivity(input)).toBe(expected);
    });
  });

  describe('identifies moving activities by sport_type when type differs', () => {
    test.each<Case>([
      [
        'matches sport_type when type is different',
        {
          input: { type: 'Ride', sport_type: 'MountainBikeRide' },
          expected: true,
        },
      ],
      [
        'matches sport_type Run when type is generic',
        {
          input: { type: 'Activity', sport_type: 'Run' },
          expected: true,
        },
      ],
      [
        'matches sport_type TrailRun when type is Run',
        {
          input: { type: 'Run', sport_type: 'TrailRun' },
          expected: true,
        },
      ],
      [
        'matches sport_type VirtualRide when type is Ride',
        {
          input: { type: 'Ride', sport_type: 'VirtualRide' },
          expected: true,
        },
      ],
      [
        'matches sport_type EBikeRide when type is Ride',
        {
          input: { type: 'Ride', sport_type: 'EBikeRide' },
          expected: true,
        },
      ],
    ])('%s', (_name, { input, expected }) => {
      expect(getIsMovingActivity(input)).toBe(expected);
    });
  });

  describe('identifies moving activities by type when sport_type differs', () => {
    test.each<Case>([
      [
        'matches type when sport_type is different',
        {
          input: { type: 'Run', sport_type: 'Unknown' },
          expected: true,
        },
      ],
      [
        'matches type Ride when sport_type is generic',
        {
          input: { type: 'Ride', sport_type: 'Activity' },
          expected: true,
        },
      ],
      [
        'matches type Walk when sport_type is empty',
        {
          input: { type: 'Walk', sport_type: '' },
          expected: true,
        },
      ],
      [
        'matches type Hike when sport_type is non-moving',
        {
          input: { type: 'Hike', sport_type: 'Other' },
          expected: true,
        },
      ],
    ])('%s', (_name, { input, expected }) => {
      expect(getIsMovingActivity(input)).toBe(expected);
    });
  });

  describe('identifies non-moving activities', () => {
    test.each<Case>([
      [
        'unknown activity type is not moving',
        {
          input: { type: 'Unknown', sport_type: 'Unknown' },
          expected: false,
        },
      ],
      [
        'empty strings are not moving',
        {
          input: { type: '', sport_type: '' },
          expected: false,
        },
      ],
      [
        'generic activity type is not moving',
        {
          input: { type: 'Activity', sport_type: 'Activity' },
          expected: false,
        },
      ],
      [
        'other activity type is not moving',
        {
          input: { type: 'Other', sport_type: 'Other' },
          expected: false,
        },
      ],
      [
        'meditation is not moving',
        {
          input: { type: 'Meditation', sport_type: 'Meditation' },
          expected: false,
        },
      ],
      [
        'stretching is not moving',
        {
          input: { type: 'Stretching', sport_type: 'Stretching' },
          expected: false,
        },
      ],
      [
        'breathing exercise is not moving',
        {
          input: { type: 'Breathing', sport_type: 'Breathing' },
          expected: false,
        },
      ],
      [
        'yoga is not moving',
        {
          input: { type: 'Yoga', sport_type: 'Yoga' },
          expected: false,
        },
      ],
      [
        'workout is not moving',
        {
          input: { type: 'Workout', sport_type: 'Workout' },
          expected: false,
        },
      ],
      [
        'weight training is not moving',
        {
          input: { type: 'WeightTraining', sport_type: 'WeightTraining' },
          expected: false,
        },
      ],
      [
        'crossfit is not moving',
        {
          input: { type: 'CrossFit', sport_type: 'CrossFit' },
          expected: false,
        },
      ],
    ])('%s', (_name, { input, expected }) => {
      expect(getIsMovingActivity(input)).toBe(expected);
    });
  });

  describe('handles case sensitivity', () => {
    test.each<Case>([
      [
        'lowercase run is not recognized',
        {
          input: { type: 'run', sport_type: 'run' },
          expected: false,
        },
      ],
      [
        'uppercase RUN is not recognized',
        {
          input: { type: 'RUN', sport_type: 'RUN' },
          expected: false,
        },
      ],
      [
        'mixed case rUn is not recognized',
        {
          input: { type: 'rUn', sport_type: 'rUn' },
          expected: false,
        },
      ],
      [
        'lowercase ride is not recognized',
        {
          input: { type: 'ride', sport_type: 'ride' },
          expected: false,
        },
      ],
      [
        'mixed case MountainbikeRide is not recognized',
        {
          input: { type: 'MountainbikeRide', sport_type: 'MountainbikeRide' },
          expected: false,
        },
      ],
    ])('%s', (_name, { input, expected }) => {
      expect(getIsMovingActivity(input)).toBe(expected);
    });
  });

  describe('handles edge cases', () => {
    test.each<Case>([
      [
        'whitespace only is not moving',
        {
          input: { type: '   ', sport_type: '   ' },
          expected: false,
        },
      ],
      [
        'activity type with leading space is not recognized',
        {
          input: { type: ' Run', sport_type: ' Run' },
          expected: false,
        },
      ],
      [
        'activity type with trailing space is not recognized',
        {
          input: { type: 'Run ', sport_type: 'Run ' },
          expected: false,
        },
      ],
      [
        'activity type with surrounding spaces is not recognized',
        {
          input: { type: ' Run ', sport_type: ' Run ' },
          expected: false,
        },
      ],
      [
        'partial match is not recognized',
        {
          input: { type: 'Running', sport_type: 'Running' },
          expected: false,
        },
      ],
      [
        'activity type with hyphen is not recognized',
        {
          input: { type: 'Trail-Run', sport_type: 'Trail-Run' },
          expected: false,
        },
      ],
      [
        'activity type with underscore is not recognized',
        {
          input: { type: 'Trail_Run', sport_type: 'Trail_Run' },
          expected: false,
        },
      ],
    ])('%s', (_name, { input, expected }) => {
      expect(getIsMovingActivity(input)).toBe(expected);
    });
  });
});
