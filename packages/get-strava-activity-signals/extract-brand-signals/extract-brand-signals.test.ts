import { describe, test, expect } from 'bun:test';

import extractBrandSignals from './extract-brand-signals';
import { Input } from './types';

type Case = [string, Input, string[] | undefined];

describe('extract-brand-signals', () => {
  describe('extracts brands from gear name', () => {
    test.each<Case>([
      [
        'extracts brand from simple gear name',
        {
          gear: {
            name: 'Nike Air Zoom',
          },
        },
        ['Nike Air Zoom'],
      ],
      [
        'extracts brand from gear name with model number',
        {
          gear: {
            name: 'Asics Gel-Kayano 29',
          },
        },
        ['Asics Gel-Kayano 29'],
      ],
      [
        'extracts brand from gear name with multiple words',
        {
          gear: {
            name: 'Brooks Ghost 15 Running Shoes',
          },
        },
        ['Brooks Ghost 15 Running Shoes'],
      ],
      [
        'extracts brand from bike gear name',
        {
          gear: {
            name: 'Trek Domane SL 7',
          },
        },
        ['Trek Domane SL 7'],
      ],
      [
        'extracts brand from gear name with special characters',
        {
          gear: {
            name: 'Saucony Guide-15',
          },
        },
        ['Saucony Guide-15'],
      ],
      [
        'extracts brand from gear name with numbers',
        {
          gear: {
            name: 'Specialized S-Works Tarmac SL8',
          },
        },
        ['Specialized S-Works Tarmac SL8'],
      ],
      [
        'extracts brand from gear name with single word',
        {
          gear: {
            name: 'Garmin',
          },
        },
        ['Garmin'],
      ],
      [
        'extracts brand from gear name with mixed case',
        {
          gear: {
            name: 'NEW BALANCE FuelCell',
          },
        },
        ['NEW BALANCE FuelCell'],
      ],
      [
        'extracts brand from gear name with lowercase',
        {
          gear: {
            name: 'hoka one one',
          },
        },
        ['hoka one one'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('extracts brands from gear nickname', () => {
    test.each<Case>([
      [
        'extracts brand from simple gear nickname',
        {
          gear: {
            nickname: 'My Nike Runners',
          },
        },
        ['My Nike Runners'],
      ],
      [
        'extracts brand from gear nickname with custom name',
        {
          gear: {
            nickname: 'Speed Demons',
          },
        },
        ['Speed Demons'],
      ],
      [
        'extracts brand from gear nickname with brand and model',
        {
          gear: {
            nickname: 'Adidas Ultraboost 23',
          },
        },
        ['Adidas Ultraboost 23'],
      ],
      [
        'extracts brand from gear nickname with single word',
        {
          gear: {
            nickname: 'Beast',
          },
        },
        ['Beast'],
      ],
      [
        'extracts brand from gear nickname with numbers',
        {
          gear: {
            nickname: 'Road Bike 2024',
          },
        },
        ['Road Bike 2024'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('extracts brands from both name and nickname', () => {
    test.each<Case>([
      [
        'combines name and nickname when both present',
        {
          gear: {
            name: 'Nike Pegasus',
            nickname: 'Fast Runners',
          },
        },
        ['Nike Pegasus Fast Runners'],
      ],
      [
        'combines name and nickname with different brands',
        {
          gear: {
            name: 'Brooks Ghost',
            nickname: 'Daily Trainers',
          },
        },
        ['Brooks Ghost Daily Trainers'],
      ],
      [
        'combines name and nickname with single words',
        {
          gear: {
            name: 'Cannondale',
            nickname: 'Beast',
          },
        },
        ['Cannondale Beast'],
      ],
      [
        'combines name and nickname with spaces',
        {
          gear: {
            name: '  Nike Air  ',
            nickname: '  Zoom Fly  ',
          },
        },
        ['Nike Air     Zoom Fly'],
      ],
      [
        'combines when name has content and nickname is whitespace',
        {
          gear: {
            name: 'Saucony Endorphin',
            nickname: '   ',
          },
        },
        ['Saucony Endorphin'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('prefers name over nickname when only one present', () => {
    test.each<Case>([
      [
        'uses name when nickname is undefined',
        {
          gear: {
            name: 'Puma Velocity',
            nickname: undefined,
          },
        },
        ['Puma Velocity'],
      ],
      [
        'uses nickname when name is undefined',
        {
          gear: {
            name: undefined,
            nickname: 'Trail Beast',
          },
        },
        ['Trail Beast'],
      ],
      [
        'uses name when nickname is empty string',
        {
          gear: {
            name: 'Mizuno Wave',
            nickname: '',
          },
        },
        ['Mizuno Wave'],
      ],
      [
        'uses nickname when name is empty string',
        {
          gear: {
            name: '',
            nickname: 'Carbon Racer',
          },
        },
        ['Carbon Racer'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('returns undefined when no valid gear brands found', () => {
    test.each<Case>([
      [
        'returns undefined when gear is undefined',
        {
          gear: undefined,
        },
        undefined,
      ],
      [
        'returns undefined when gear is empty object',
        {
          gear: {},
        },
        undefined,
      ],
      [
        'returns undefined when both name and nickname are undefined',
        {
          gear: {
            name: undefined,
            nickname: undefined,
          },
        },
        undefined,
      ],
      [
        'returns undefined when both name and nickname are empty strings',
        {
          gear: {
            name: '',
            nickname: '',
          },
        },
        undefined,
      ],
      [
        'returns undefined when name is empty and nickname is undefined',
        {
          gear: {
            name: '',
            nickname: undefined,
          },
        },
        undefined,
      ],
      [
        'returns undefined when name is undefined and nickname is empty',
        {
          gear: {
            name: undefined,
            nickname: '',
          },
        },
        undefined,
      ],
      [
        'returns undefined when both are whitespace only',
        {
          gear: {
            name: '   ',
            nickname: '   ',
          },
        },
        undefined,
      ],
      [
        'returns undefined when name is whitespace and nickname is undefined',
        {
          gear: {
            name: '   ',
            nickname: undefined,
          },
        },
        undefined,
      ],
      [
        'returns undefined when name is undefined and nickname is whitespace',
        {
          gear: {
            name: undefined,
            nickname: '   ',
          },
        },
        undefined,
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles edge cases correctly', () => {
    test.each<Case>([
      [
        'handles gear name with leading spaces',
        {
          gear: {
            name: '   Adidas Supernova',
          },
        },
        ['Adidas Supernova'],
      ],
      [
        'handles gear name with trailing spaces',
        {
          gear: {
            name: 'New Balance 1080   ',
          },
        },
        ['New Balance 1080'],
      ],
      [
        'handles gear name with leading and trailing spaces',
        {
          gear: {
            name: '   Asics Nimbus   ',
          },
        },
        ['Asics Nimbus'],
      ],
      [
        'handles gear nickname with leading spaces',
        {
          gear: {
            nickname: '   Speed Machine',
          },
        },
        ['Speed Machine'],
      ],
      [
        'handles gear nickname with trailing spaces',
        {
          gear: {
            nickname: 'Trail Runner   ',
          },
        },
        ['Trail Runner'],
      ],
      [
        'handles very long gear name',
        {
          gear: {
            name: 'Specialized S-Works Tarmac SL8 eTap AXS Di2 Carbon Road Bike Professional Edition Limited',
          },
        },
        [
          'Specialized S-Works Tarmac SL8 eTap AXS Di2 Carbon Road Bike Professional Edition Limited',
        ],
      ],
      [
        'handles single character gear name',
        {
          gear: {
            name: 'X',
          },
        },
        ['X'],
      ],
      [
        'handles gear name with special characters',
        {
          gear: {
            name: 'On Cloud-X 3.0',
          },
        },
        ['On Cloud-X 3.0'],
      ],
      [
        'handles gear name with numbers only',
        {
          gear: {
            name: '2024',
          },
        },
        ['2024'],
      ],
      [
        'handles gear name with emojis',
        {
          gear: {
            name: 'Nike ⚡️ Speedsters',
          },
        },
        ['Nike ⚡️ Speedsters'],
      ],
      [
        'handles gear name with multiple consecutive spaces',
        {
          gear: {
            name: 'Nike    Air    Max',
          },
        },
        ['Nike    Air    Max'],
      ],
      [
        'handles gear nickname with multiple consecutive spaces',
        {
          gear: {
            nickname: 'My    Favorite    Shoes',
          },
        },
        ['My    Favorite    Shoes'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles various activity types gear', () => {
    test.each<Case>([
      [
        'extracts running shoe brand',
        {
          gear: {
            name: 'Altra Lone Peak 7',
          },
        },
        ['Altra Lone Peak 7'],
      ],
      [
        'extracts bike brand',
        {
          gear: {
            name: 'Giant TCR Advanced',
          },
        },
        ['Giant TCR Advanced'],
      ],
      [
        'extracts swimming gear brand',
        {
          gear: {
            name: 'Speedo Fastskin',
          },
        },
        ['Speedo Fastskin'],
      ],
      [
        'extracts watch brand',
        {
          gear: {
            name: 'Garmin Forerunner 955',
          },
        },
        ['Garmin Forerunner 955'],
      ],
      [
        'extracts ski equipment brand',
        {
          gear: {
            name: 'Rossignol Experience',
          },
        },
        ['Rossignol Experience'],
      ],
      [
        'extracts hiking boot brand',
        {
          gear: {
            name: 'Salomon Quest 4D',
          },
        },
        ['Salomon Quest 4D'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractBrandSignals(input);

      expect(result).toStrictEqual(expected);
    });
  });
});
