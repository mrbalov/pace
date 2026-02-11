import { describe, test, expect } from 'bun:test';

import extractTagSignals from './extract-tag-signals';
import { Input } from './types';

type Case = [string, Input, string[] | undefined];

describe('extract-tag-signals', () => {
  describe('extracts commute tag correctly', () => {
    test.each<Case>([
      ['extracts commute tag when commute is true', { commute: true }, ['commute']],
      ['extracts commute tag when commute is false', { commute: false }, undefined],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTagSignals(activity);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('returns undefined when no tags present', () => {
    test.each<Case>([
      ['returns undefined when commute is undefined', { commute: undefined }, undefined],
      ['returns undefined for basic activity without tags', {}, undefined],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTagSignals(activity);

      expect(result).toStrictEqual(expected);
    });
  });
});
