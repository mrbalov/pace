import { describe, test, expect } from 'bun:test';

import extractSemanticContext from './extract-semantic-context';
import { Input } from './types';

type Case = [string, Input, string[] | undefined];

describe('extract-semantic-context', () => {
  describe('extracts context from name field', () => {
    test.each<Case>([
      [
        'extracts trail keyword from name',
        {
          name: 'Quick trail run',
        },
        ['trail'],
      ],
      [
        'extracts road keyword from name',
        {
          name: 'Easy road run',
        },
        ['road'],
      ],
      [
        'extracts track keyword from name',
        {
          name: 'Track workout',
        },
        ['track'],
      ],
      [
        'extracts indoor keyword from name',
        {
          name: 'Indoor cycling',
        },
        ['indoor'],
      ],
      [
        'extracts outdoor keyword from name',
        {
          name: 'Outdoor adventure',
        },
        ['outdoor'],
      ],
      [
        'extracts park keyword from name',
        {
          name: 'Running in the park',
        },
        ['park'],
      ],
      [
        'extracts beach keyword from name',
        {
          name: 'Beach run today',
        },
        ['beach'],
      ],
      [
        'extracts mountain keyword from name',
        {
          name: 'Mountain bike ride',
        },
        ['mountain'],
      ],
      [
        'extracts hill keyword from name',
        {
          name: 'Hill repeats',
        },
        ['hill'],
      ],
      [
        'extracts multiple keywords from name',
        {
          name: 'Trail run through the park',
        },
        ['trail', 'park'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('extracts context from description field', () => {
    test.each<Case>([
      [
        'extracts trail keyword from description',
        {
          description: 'Great trail run today',
        },
        ['trail'],
      ],
      [
        'extracts road keyword from description',
        {
          description: 'Long road cycling session',
        },
        ['road'],
      ],
      [
        'extracts track keyword from description',
        {
          description: 'Speed work on the track',
        },
        ['track'],
      ],
      [
        'extracts indoor keyword from description',
        {
          description: 'Indoor training session',
        },
        ['indoor'],
      ],
      [
        'extracts outdoor keyword from description',
        {
          description: 'Beautiful outdoor weather',
        },
        ['outdoor'],
      ],
      [
        'extracts park keyword from description',
        {
          description: 'Running through Central Park',
        },
        ['park'],
      ],
      [
        'extracts beach keyword from description',
        {
          description: 'Relaxing beach jog',
        },
        ['beach'],
      ],
      [
        'extracts mountain keyword from description',
        {
          description: 'Climbing mountain trails',
        },
        ['trail', 'mountain'],
      ],
      [
        'extracts hill keyword from description',
        {
          description: 'Tough hill workout',
        },
        ['hill'],
      ],
      [
        'extracts multiple keywords from description',
        {
          description: 'Outdoor run through mountain trails',
        },
        ['outdoor', 'trail', 'mountain'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('extracts context from both name and description', () => {
    test.each<Case>([
      [
        'extracts keywords from both fields',
        {
          name: 'Trail run',
          description: 'Beautiful park scenery',
        },
        ['trail', 'park'],
      ],
      [
        'combines keywords from both fields',
        {
          name: 'Easy road run',
          description: 'Running through the park',
        },
        ['road', 'park'],
      ],
      [
        'handles duplicate keywords from both fields',
        {
          name: 'Trail run',
          description: 'Amazing trail conditions',
        },
        ['trail', 'trail'],
      ],
      [
        'extracts all keywords from both fields',
        {
          name: 'Outdoor mountain trail',
          description: 'Running through park and beach areas',
        },
        ['outdoor', 'trail', 'mountain', 'park', 'beach'],
      ],
      [
        'extracts keywords when only name has keywords',
        {
          name: 'Trail run',
          description: 'Great workout',
        },
        ['trail'],
      ],
      [
        'extracts keywords when only description has keywords',
        {
          name: 'Quick run',
          description: 'Through the park',
        },
        ['park'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('returns undefined when no keywords found', () => {
    test.each<Case>([
      [
        'returns undefined for empty name',
        {
          name: '',
        },
        undefined,
      ],
      [
        'returns undefined for empty description',
        {
          description: '',
        },
        undefined,
      ],
      [
        'returns undefined for both empty',
        {
          name: '',
          description: '',
        },
        undefined,
      ],
      [
        'returns undefined when name has no keywords',
        {
          name: 'Daily jog',
        },
        undefined,
      ],
      [
        'returns undefined when description has no keywords',
        {
          description: 'Great workout today',
        },
        undefined,
      ],
      [
        'returns undefined when both have no keywords',
        {
          name: 'Daily jog',
          description: 'Great workout',
        },
        undefined,
      ],
      [
        'returns undefined for whitespace only name',
        {
          name: '   ',
        },
        undefined,
      ],
      [
        'returns undefined for whitespace only description',
        {
          description: '   ',
        },
        undefined,
      ],
      [
        'returns undefined when both are whitespace only',
        {
          name: '   ',
          description: '   ',
        },
        undefined,
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles missing fields correctly', () => {
    test.each<Case>([
      ['returns undefined when both fields missing', {}, undefined],
      [
        'handles missing name field',
        {
          description: 'Trail run today',
        },
        ['trail'],
      ],
      [
        'handles missing description field',
        {
          name: 'Trail run',
        },
        ['trail'],
      ],
      [
        'returns undefined when missing name and description has no keywords',
        {
          description: 'Quick workout',
        },
        undefined,
      ],
      [
        'returns undefined when missing description and name has no keywords',
        {
          name: 'Daily jog',
        },
        undefined,
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles case insensitivity', () => {
    test.each<Case>([
      [
        'extracts lowercase keywords',
        {
          name: 'trail run',
        },
        ['trail'],
      ],
      [
        'extracts uppercase keywords',
        {
          name: 'TRAIL RUN',
        },
        ['trail'],
      ],
      [
        'extracts mixed case keywords',
        {
          name: 'TrAiL RuN',
        },
        ['trail'],
      ],
      [
        'extracts keywords from mixed case description',
        {
          description: 'BeAuTiFuL PaRk ScEnErY',
        },
        ['park'],
      ],
      [
        'extracts keywords from both fields with mixed case',
        {
          name: 'TRAIL run',
          description: 'beautiful PARK scenery',
        },
        ['trail', 'park'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles forbidden content correctly', () => {
    test.each<Case>([
      [
        'returns undefined when name contains forbidden content',
        {
          name: 'Run with people',
        },
        undefined,
      ],
      [
        'returns undefined when description contains forbidden content',
        {
          description: 'Government building trail',
        },
        undefined,
      ],
      [
        'returns undefined when both contain forbidden content',
        {
          name: 'Running with people',
          description: 'Near government building',
        },
        undefined,
      ],
      [
        'returns keywords from name when description has forbidden content',
        {
          name: 'Trail run',
          description: 'With people today',
        },
        ['trail'],
      ],
      [
        'returns keywords from description when name has forbidden content',
        {
          name: 'Run with people',
          description: 'Trail conditions',
        },
        ['trail'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles special characters and whitespace', () => {
    test.each<Case>([
      [
        'extracts keywords with punctuation',
        {
          name: 'Trail, road, and park running!',
        },
        ['trail', 'road', 'park'],
      ],
      [
        'extracts keywords with multiple spaces',
        {
          name: 'Trail   run   workout',
        },
        ['trail'],
      ],
      [
        'extracts keywords with tabs',
        {
          name: 'Trail\trun\tworkout',
        },
        ['trail'],
      ],
      [
        'extracts keywords with newlines',
        {
          description: 'Trail\nrun\nmountain',
        },
        ['trail', 'mountain'],
      ],
      [
        'extracts keywords with hyphens',
        {
          name: 'Trail-running adventure',
        },
        ['trail'],
      ],
      [
        'extracts keywords with numbers',
        {
          name: '10k trail run',
        },
        ['trail'],
      ],
      [
        'handles leading and trailing spaces',
        {
          name: '  Trail run  ',
        },
        ['trail'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles edge cases', () => {
    test.each<Case>([
      [
        'handles very long name with keywords',
        {
          name: 'This is a very long activity name that describes my amazing trail run through the park and up the mountain',
        },
        ['trail', 'park', 'mountain'],
      ],
      [
        'handles very long description with keywords',
        {
          description:
            'This is a very long description about my outdoor trail run through the park with beautiful beach views and mountain scenery',
        },
        ['outdoor', 'trail', 'park', 'beach', 'mountain'],
      ],
      [
        'handles single character text',
        {
          name: 'a',
        },
        undefined,
      ],
      [
        'handles keywords at boundaries',
        {
          name: 'trail',
          description: 'park',
        },
        ['trail', 'park'],
      ],
      [
        'handles all keywords in one text',
        {
          name: 'trail road track indoor outdoor park beach mountain hill',
        },
        ['indoor', 'outdoor', 'trail', 'road', 'track', 'park', 'beach', 'mountain', 'hill'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('maintains keyword order from KEYWORDS array', () => {
    test.each<Case>([
      [
        'returns keywords in KEYWORDS array order',
        {
          name: 'park trail road',
        },
        ['trail', 'road', 'park'],
      ],
      [
        'returns keywords in order regardless of text order',
        {
          name: 'mountain beach outdoor',
        },
        ['outdoor', 'beach', 'mountain'],
      ],
      [
        'returns combined keywords in order',
        {
          name: 'hill mountain',
          description: 'trail park',
        },
        ['mountain', 'hill', 'trail', 'park'],
      ],
    ])('%#. %s', (_name, input, expected) => {
      const result = extractSemanticContext(input);

      expect(result).toStrictEqual(expected);
    });
  });
});
