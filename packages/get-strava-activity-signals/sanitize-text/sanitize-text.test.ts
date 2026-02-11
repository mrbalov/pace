import { describe, test, expect } from 'bun:test';

import sanitizeText from './sanitize-text';

type Case = [string, string, string];

describe('sanitize-text', () => {
  describe('sanitizes safe text correctly', () => {
    test.each<Case>([
      ['returns trimmed text for simple input', '  Morning run  ', 'Morning run'],
      [
        'normalizes multiple spaces to single space',
        'Morning   run   workout',
        'Morning run workout',
      ],
      ['normalizes tabs to single space', 'Morning\t\trun\tworkout', 'Morning run workout'],
      ['normalizes newlines to single space', 'Morning\nrun\nworkout', 'Morning run workout'],
      [
        'normalizes mixed whitespace to single space',
        'Morning \t\n run  \t workout',
        'Morning run workout',
      ],
      ['preserves text with special characters', 'Morning run @ 5k!', 'Morning run @ 5k!'],
      ['preserves text with numbers', 'Morning run 10k', 'Morning run 10k'],
      ['preserves text with punctuation', 'Morning run, very nice!', 'Morning run, very nice!'],
      ['preserves text with hyphens', 'Trail-running adventure', 'Trail-running adventure'],
      ['preserves text with apostrophes', "It's a great run", "It's a great run"],
      ['handles text with only spaces at start', '     Trail run', 'Trail run'],
      ['handles text with only spaces at end', 'Trail run     ', 'Trail run'],
      ['handles text with spaces on both ends', '   Trail run   ', 'Trail run'],
      ['handles single word', 'Running', 'Running'],
      [
        'handles very long text',
        'This is a very long description about my amazing morning run that took me through beautiful trails and parks',
        'This is a very long description about my amazing morning run that took me through beautiful trails and parks',
      ],
      ['preserves unicode characters', 'Morning run 🏃‍♂️', 'Morning run 🏃‍♂️'],
      [
        'handles text with multiple consecutive newlines',
        'Line one\n\n\nLine two',
        'Line one Line two',
      ],
      ['handles text with carriage returns', 'Line one\r\nLine two', 'Line one Line two'],
      ['preserves uppercase letters', 'MORNING RUN', 'MORNING RUN'],
      ['preserves mixed case', 'MoRnInG RuN', 'MoRnInG RuN'],
    ])('%#. %s', (_name, input, expected) => {
      const result = sanitizeText(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('returns empty string for invalid input', () => {
    test.each<Case>([
      ['returns empty string for empty input', '', ''],
      ['returns empty string for whitespace only', '   ', ''],
      ['returns empty string for tabs only', '\t\t\t', ''],
      ['returns empty string for newlines only', '\n\n\n', ''],
      ['returns empty string for mixed whitespace only', ' \t\n ', ''],
      ['returns empty string for carriage returns only', '\r\n\r\n', ''],
    ])('%#. %s', (_name, input, expected) => {
      const result = sanitizeText(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('removes forbidden content', () => {
    test.each<Case>([
      ['returns empty string for text with person keywords', 'Running with people in the park', ''],
      ['returns empty string for text with face keywords', 'Morning run with portrait photo', ''],
      [
        'returns empty string for text with political keywords',
        'Run to the government building',
        '',
      ],
      ['returns empty string for text with violence keywords', 'Running with weapon training', ''],
      ['returns empty string for text with combat keywords', 'Military training run', ''],
      ['returns empty string for text with sexual keywords', 'Explicit content in description', ''],
      ['returns empty string for text with typography keywords', 'Display text on screen', ''],
      ['returns empty string for text with write instruction', 'Write something here', ''],
      [
        'returns empty string for text with multiple forbidden keywords',
        'Government people with weapons',
        '',
      ],
      ['returns empty string for uppercase forbidden keywords', 'PEOPLE RUNNING', ''],
      ['returns empty string for mixed case forbidden keywords', 'PeOpLe running', ''],
      ['returns empty string for forbidden keyword at start', 'Government building run', ''],
      ['returns empty string for forbidden keyword at end', 'Morning run with people', ''],
      ['returns empty string for forbidden keyword in middle', 'Great people filled run', ''],
      ['returns empty string for text with man keyword', 'Man running marathon', ''],
      ['returns empty string for text with woman keyword', 'Woman jogging', ''],
      ['returns empty string for text with child keyword', 'Child playing', ''],
      ['returns empty string for text with battle keyword', 'Battle training session', ''],
      ['returns empty string for text with flag keyword', 'Running past the flag', ''],
      ['returns empty string for text with army keyword', 'Army base run', ''],
    ])('%#. %s', (_name, input, expected) => {
      const result = sanitizeText(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles edge cases', () => {
    test.each<Case>([
      ['handles single character', 'a', 'a'],
      ['handles two characters', 'ab', 'ab'],
      ['handles very short safe text', 'run', 'run'],
      [
        'handles text with many spaces between words',
        'word1     word2     word3',
        'word1 word2 word3',
      ],
      ['handles text starting with special character', '!Important', '!Important'],
      ['handles text ending with special character', 'Important!', 'Important!'],
      ['handles text with only numbers', '12345', '12345'],
      ['handles text with only special characters', '!@#$%', '!@#$%'],
      ['handles text with leading tabs and trailing spaces', '\t\tRun   ', 'Run'],
      ['handles empty string with special characters removed', '', ''],
    ])('%#. %s', (_name, input, expected) => {
      const result = sanitizeText(input);

      expect(result).toStrictEqual(expected);
    });
  });
});
