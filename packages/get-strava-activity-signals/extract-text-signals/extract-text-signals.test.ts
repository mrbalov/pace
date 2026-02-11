import { describe, test, expect } from 'bun:test';

import extractTextSignals from './extract-text-signals';

type Case = [string, string, string[] | undefined];

describe('extract-text-signals', () => {
  describe('extracts keywords from valid text', () => {
    test.each<Case>([
      ['finds trail keyword in simple text', 'Morning trail run', ['trail', 'morning']],
      ['finds road keyword in simple text', 'Easy road run', ['road']],
      ['finds track keyword in simple text', 'Track workout session', ['track']],
      ['finds indoor keyword in simple text', 'Indoor cycling workout', ['indoor']],
      ['finds outdoor keyword in simple text', 'Outdoor adventure', ['outdoor']],
      ['finds park keyword in simple text', 'Running in the park', ['park']],
      ['finds beach keyword in simple text', 'Beach run at sunrise', ['beach']],
      ['finds mountain keyword in simple text', 'Mountain bike ride', ['mountain']],
      ['finds hill keyword in simple text', 'Hill repeats workout', ['hill']],
      ['finds multiple keywords in text', 'Trail run in the mountain', ['trail', 'mountain']],
      ['finds multiple keywords with mixed case', 'OUTDOOR PARK RUN', ['outdoor', 'park']],
      ['extracts keywords from text with extra spaces', '  trail   run  ', ['trail']],
      ['finds keywords in lowercase text', 'trail run', ['trail']],
      ['finds keywords in uppercase text', 'TRAIL RUN', ['trail']],
      ['finds keywords in mixed case text', 'Trail Run', ['trail']],
      [
        'finds all keywords when present',
        'trail road track indoor outdoor park beach mountain hill',
        ['indoor', 'outdoor', 'trail', 'road', 'track', 'park', 'beach', 'mountain', 'hill'],
      ],
      [
        'finds keywords in longer descriptive text',
        'Amazing trail run through the park with beautiful mountain views',
        ['trail', 'park', 'mountain'],
      ],
      ['finds road and park keywords together', 'Road cycling through city park', ['road', 'park']],
      [
        'finds beach and outdoor keywords together',
        'Outdoor beach volleyball',
        ['outdoor', 'beach'],
      ],
      [
        'finds indoor and track keywords together',
        'Indoor track running session',
        ['indoor', 'track'],
      ],
      [
        'finds keywords with punctuation',
        'Trail, road, and park running!',
        ['trail', 'road', 'park'],
      ],
      [
        'finds keywords in text with numbers',
        '10k trail run on the mountain',
        ['trail', 'mountain'],
      ],
      [
        'finds keywords in text with special characters',
        'Trail-run @ park #outdoor',
        ['outdoor', 'trail', 'park'],
      ],
      [
        'finds keywords when part of longer words',
        'mountainous trail landscape',
        ['trail', 'mountain'],
      ],
      ['finds hill keyword in hillside', 'Running hillside trails', ['trail', 'hill']],
      ['finds morning keyword in simple text', 'Early morning run', ['morning']],
      ['finds afternoon keyword in simple text', 'Afternoon cycling session', ['afternoon']],
      ['finds evening keyword in simple text', 'Evening trail run', ['trail', 'evening']],
      ['finds night keyword in simple text', 'Late night workout', ['night']],
      ['finds spring keyword in simple text', 'Beautiful spring weather', ['spring']],
      ['finds summer keyword in simple text', 'Hot summer day run', ['summer']],
      ['finds fall keyword in simple text', 'Fall colors trail run', ['trail', 'fall']],
      ['finds autumn keyword in simple text', 'Autumn leaves everywhere', ['autumn']],
      ['finds winter keyword in simple text', 'Cold winter morning', ['morning', 'winter']],
      [
        'finds time of day keywords together',
        'morning run then evening workout',
        ['morning', 'evening'],
      ],
      ['finds season keywords together', 'spring turning into summer', ['spring', 'summer']],
      [
        'finds all time of day keywords',
        'morning afternoon evening night',
        ['morning', 'afternoon', 'evening', 'night'],
      ],
      [
        'finds all season keywords',
        'spring summer fall autumn winter',
        ['spring', 'summer', 'fall', 'autumn', 'winter'],
      ],
      [
        'finds mixed location and time keywords',
        'morning trail run in the park',
        ['trail', 'park', 'morning'],
      ],
      [
        'finds mixed location and season keywords',
        'winter mountain trail',
        ['trail', 'mountain', 'winter'],
      ],
      [
        'finds time and season keywords together',
        'spring morning outdoor run',
        ['outdoor', 'morning', 'spring'],
      ],
      [
        'finds all keyword types together',
        'early morning spring trail run through the park on a beautiful outdoor path',
        ['outdoor', 'trail', 'park', 'morning', 'spring'],
      ],
      ['finds morning with mixed case', 'MORNING Run', ['morning']],
      ['finds afternoon with mixed case', 'Afternoon WORKOUT', ['afternoon']],
      ['finds evening with mixed case', 'EvEnInG run', ['evening']],
      ['finds night with mixed case', 'NIGHT cycling', ['night']],
      ['finds spring with mixed case', 'SPRING season', ['spring']],
      ['finds summer with mixed case', 'Summer Time', ['summer']],
      ['finds fall with mixed case', 'FALL colors', ['fall']],
      ['finds autumn with mixed case', 'AuTuMn leaves', ['autumn']],
      ['finds winter with mixed case', 'WiNtEr sports', ['winter']],
      [
        'finds time keywords in descriptive text',
        'Started my morning routine with a run that lasted until afternoon',
        ['morning', 'afternoon'],
      ],
      [
        'finds season keywords in descriptive text',
        'Training for summer races but still feels like spring outside',
        ['spring', 'summer'],
      ],
      ['finds morning in compound words', 'Good morning workout', ['morning']],
      ['finds evening in compound words', 'This evening was great', ['evening']],
      ['finds winter in compound words', 'Wintertime running', ['winter']],
      ['finds summer in compound words', 'Summertime vibes', ['summer']],
    ])('%#. %s', (_name, text, expected) => {
      const result = extractTextSignals(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('returns undefined when no keywords found', () => {
    test.each<Case>([
      ['returns undefined for empty string', '', undefined],
      ['returns undefined for whitespace only', '   ', undefined],
      ['returns empty array for text with no keywords', 'Running workout session', []],
      [
        'finds keywords that are part of similar words',
        'roadway pathway tracking',
        ['road', 'track'],
      ],
      ['returns empty array for numeric text', '12345', []],
      ['returns empty array for special characters only', '!@#$%^&*()', []],
      [
        'returns empty array for text with no matching keywords',
        'Daily jog around the neighborhood',
        [],
      ],
      ['returns empty array for gibberish text', 'xyzabc defghi', []],
      [
        'returns undefined when keywords are partial',
        'trails roads tracks',
        ['trail', 'road', 'track'],
      ],
    ])('%#. %s', (_name, text, expected) => {
      const result = extractTextSignals(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles forbidden content gracefully', () => {
    test.each<Case>([
      [
        'returns undefined when text contains violence keywords',
        'trail run with weapon training',
        undefined,
      ],
      [
        'returns undefined when text contains political keywords',
        'outdoor run to the government building',
        undefined,
      ],
      [
        'returns undefined when text contains explicit content keywords',
        'mountain climb with explicit adult content',
        undefined,
      ],
      [
        'returns undefined when text contains person identifiers',
        'trail run with portrait photo',
        undefined,
      ],
      [
        'returns undefined when text contains typography instructions',
        'beach run display text on screen',
        undefined,
      ],
    ])('%#. %s', (_name, text, expected) => {
      const result = extractTextSignals(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles edge cases gracefully', () => {
    test.each<Case>([
      ['handles text with only spaces before keyword', '     trail', ['trail']],
      ['handles text with only spaces after keyword', 'trail     ', ['trail']],
      ['handles text with tabs', '\t\ttrail run', ['trail']],
      ['handles text with newlines', 'trail\nrun\nmountain', ['trail', 'mountain']],
      [
        'handles text with mixed whitespace',
        '  trail \t road \n park  ',
        ['trail', 'road', 'park'],
      ],
      [
        'handles very long text with keywords',
        'This is a very long description about my amazing trail run that took me through the park and up the mountain and down to the beach where I enjoyed the outdoor scenery and fresh air on this beautiful road that winds through the hill country and passes by an indoor track facility',
        ['indoor', 'outdoor', 'trail', 'road', 'track', 'park', 'beach', 'mountain', 'hill'],
      ],
      ['handles text with duplicate keywords', 'trail trail trail', ['trail']],
      [
        'handles text with keywords in different order',
        'park road trail',
        ['trail', 'road', 'park'],
      ],
      ['handles single character keywords not matching', 'a b c d', []],
      [
        'handles repeated spaces between keywords',
        'trail     road     park',
        ['trail', 'road', 'park'],
      ],
    ])('%#. %s', (_name, text, expected) => {
      const result = extractTextSignals(text);

      expect(result).toStrictEqual(expected);
    });
  });
});
