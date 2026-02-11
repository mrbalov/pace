import { describe, test, expect } from 'bun:test';

import checkForbiddenContent from './check-forbidden-content';

type Case = [string, string, boolean];

describe('check-forbidden-content', () => {
  describe('detects person-related forbidden content', () => {
    test.each<Case>([
      ['detects person keyword', 'A person running', true],
      ['detects people keyword', 'Many people at the park', true],
      ['detects individual keyword', 'An individual athlete', true],
      ['detects human keyword', 'Human performance', true],
      ['detects man keyword', 'A man running', true],
      ['detects woman keyword', 'Woman jogging', true],
      ['detects child keyword', 'Child playing', true],
      ['detects kid keyword', 'Kid running around', true],
      ['detects baby keyword', 'Baby in stroller', true],
      ['detects face keyword', 'Face in the photo', true],
      ['detects portrait keyword', 'Portrait photography', true],
      ['detects photo keyword', 'Photo of the run', true],
      ['detects picture keyword', 'Picture perfect day', true],
      ['detects image keyword', 'Image of runner', true],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('detects political forbidden content', () => {
    test.each<Case>([
      ['detects political keyword', 'Political rally', true],
      ['detects politics keyword', 'Politics discussion', true],
      ['detects government keyword', 'Government building', true],
      ['detects president keyword', 'President election', true],
      ['detects election keyword', 'Election day run', true],
      ['detects vote keyword', 'Vote for change', true],
      ['detects democracy keyword', 'Democracy march', true],
      ['detects republican keyword', 'Republican event', true],
      ['detects democrat keyword', 'Democrat gathering', true],
      ['detects flag keyword', 'Flag ceremony', true],
      ['detects banner keyword', 'Banner display', true],
      ['detects symbol keyword', 'Symbol of freedom', true],
      ['detects emblem keyword', 'Emblem on shirt', true],
      ['detects crest keyword', 'Family crest', true],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('detects violence forbidden content', () => {
    test.each<Case>([
      ['detects violence keyword', 'Violence in the streets', true],
      ['detects violent keyword', 'Violent storm', true],
      ['detects fight keyword', 'Fight for victory', true],
      ['detects war keyword', 'War memorial', true],
      ['detects battle keyword', 'Battle training', true],
      ['detects weapon keyword', 'Weapon training', true],
      ['detects gun keyword', 'Starting gun', true],
      ['detects knife keyword', 'Knife edge ridge', true],
      ['detects sword keyword', 'Sword monument', true],
      ['detects attack keyword', 'Attack the hill', true],
      ['detects kill keyword', 'Kill the workout', true],
      ['detects death keyword', 'Death valley run', true],
      ['detects blood keyword', 'Blood donation', true],
      ['detects combat keyword', 'Combat training', true],
      ['detects military keyword', 'Military base', true],
      ['detects soldier keyword', 'Soldier field', true],
      ['detects army keyword', 'Army run', true],
      ['detects navy keyword', 'Navy pier', true],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('detects sexual content forbidden content', () => {
    test.each<Case>([
      ['detects sexual keyword', 'Sexual content warning', true],
      ['detects sex keyword', 'Sex education', true],
      ['detects nude keyword', 'Nude beach', true],
      ['detects naked keyword', 'Naked truth', true],
      ['detects explicit keyword', 'Explicit content', true],
      ['detects adult keyword', 'Adult supervision', true],
      ['detects porn keyword', 'Porn website', true],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('detects typography forbidden content', () => {
    test.each<Case>([
      ['detects text keyword', 'Text message', true],
      ['detects word keyword', 'Word of the day', true],
      ['detects letter keyword', 'Letter of recommendation', true],
      ['detects alphabet keyword', 'Alphabet song', true],
      ['detects typography keyword', 'Typography design', true],
      ['detects caption keyword', 'Caption this photo', true],
      ['detects label keyword', 'Label the items', true],
      ['detects title keyword', 'Title of the run', true],
      ['detects heading keyword', 'Heading north', true],
      ['detects font keyword', 'Font selection', true],
      ['detects type keyword', 'Type of workout', true],
      ['detects write keyword', 'Write a review', true],
      ['detects print keyword', 'Print the results', true],
      ['detects display keyword', 'Display on screen', true],
      ['detects show keyword', 'Show the data', true],
      ['detects say keyword', 'Say hello', true],
      ['detects tell keyword', 'Tell a story', true],
      ['detects read keyword', 'Read the instructions', true],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles safe content correctly', () => {
    test.each<Case>([
      ['allows safe running text', 'Morning trail run', false],
      ['allows safe location text', 'Running through the park', false],
      ['allows safe activity text', 'Easy recovery jog', false],
      ['allows safe weather text', 'Sunny morning', false],
      ['allows safe terrain text', 'Mountain trail', false],
      ['allows safe distance text', '10k run', false],
      ['allows safe time text', 'Early morning workout', false],
      ['allows safe pace text', 'Quick tempo run', false],
      ['allows safe gear text', 'New running shoes', false],
      ['allows safe feeling text', 'Feeling strong', false],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('handles edge cases correctly', () => {
    test.each<Case>([
      ['handles empty string', '', false],
      ['handles whitespace only', '   ', false],
      ['handles uppercase forbidden keyword', 'PEOPLE running', true],
      ['handles mixed case forbidden keyword', 'PeOpLe running', true],
      ['handles forbidden keyword at start', 'Government building run', true],
      ['handles forbidden keyword at end', 'Running with people', true],
      ['handles forbidden keyword in middle', 'Great people filled event', true],
      ['handles multiple forbidden keywords', 'Government people with weapons', true],
      ['handles partial word match that should not trigger', 'Manhattan beach run', false],
      ['handles special characters', '!@#$%^&*()', false],
    ])('%#. %s', (_name, text, expected) => {
      const result = checkForbiddenContent(text);

      expect(result).toStrictEqual(expected);
    });
  });
});
