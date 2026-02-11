import { describe, test, expect } from 'bun:test';

import { Input } from './types';
import extractTimeOfDaySignals from './extract-time-of-day-signals';
import { StravaActivitySignalsTimeOfDay } from '../types';

type Case = [string, Input, StravaActivitySignalsTimeOfDay];

describe('extract-time-of-day-signals', () => {
  describe('classifies morning activities correctly (5:00-10:00)', () => {
    test.each<Case>([
      [
        'morning at exact start boundary (5:00)',
        {
          start_date_local: '2024-01-01T05:00:00Z',
        },
        'morning',
      ],
      [
        'early morning (6:00)',
        {
          start_date_local: '2024-01-01T06:00:00Z',
        },
        'morning',
      ],
      [
        'mid morning (7:00)',
        {
          start_date_local: '2024-01-01T07:00:00Z',
        },
        'morning',
      ],
      [
        'mid morning (8:00)',
        {
          start_date_local: '2024-01-01T08:00:00Z',
        },
        'morning',
      ],
      [
        'late morning (9:00)',
        {
          start_date_local: '2024-01-01T09:00:00Z',
        },
        'morning',
      ],
      [
        'morning at 5:30',
        {
          start_date_local: '2024-01-01T05:30:00Z',
        },
        'morning',
      ],
      [
        'morning at 9:59',
        {
          start_date_local: '2024-01-01T09:59:59Z',
        },
        'morning',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('classifies day activities correctly (10:00-17:00)', () => {
    test.each<Case>([
      [
        'day at exact start boundary (10:00)',
        {
          start_date_local: '2024-01-01T10:00:00Z',
        },
        'day',
      ],
      [
        'late morning/early day (11:00)',
        {
          start_date_local: '2024-01-01T11:00:00Z',
        },
        'day',
      ],
      [
        'noon (12:00)',
        {
          start_date_local: '2024-01-01T12:00:00Z',
        },
        'day',
      ],
      [
        'afternoon (13:00)',
        {
          start_date_local: '2024-01-01T13:00:00Z',
        },
        'day',
      ],
      [
        'afternoon (14:00)',
        {
          start_date_local: '2024-01-01T14:00:00Z',
        },
        'day',
      ],
      [
        'afternoon (15:00)',
        {
          start_date_local: '2024-01-01T15:00:00Z',
        },
        'day',
      ],
      [
        'late afternoon (16:00)',
        {
          start_date_local: '2024-01-01T16:00:00Z',
        },
        'day',
      ],
      [
        'day at 16:59',
        {
          start_date_local: '2024-01-01T16:59:59Z',
        },
        'day',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('classifies evening activities correctly (17:00-20:00)', () => {
    test.each<Case>([
      [
        'evening at exact start boundary (17:00)',
        {
          start_date_local: '2024-01-01T17:00:00Z',
        },
        'evening',
      ],
      [
        'early evening (18:00)',
        {
          start_date_local: '2024-01-01T18:00:00Z',
        },
        'evening',
      ],
      [
        'late evening (19:00)',
        {
          start_date_local: '2024-01-01T19:00:00Z',
        },
        'evening',
      ],
      [
        'evening at 17:30',
        {
          start_date_local: '2024-01-01T17:30:00Z',
        },
        'evening',
      ],
      [
        'evening at 19:59',
        {
          start_date_local: '2024-01-01T19:59:59Z',
        },
        'evening',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('classifies night activities correctly (20:00-5:00)', () => {
    test.each<Case>([
      [
        'night at exact start boundary (20:00)',
        {
          start_date_local: '2024-01-01T20:00:00Z',
        },
        'night',
      ],
      [
        'late evening/early night (21:00)',
        {
          start_date_local: '2024-01-01T21:00:00Z',
        },
        'night',
      ],
      [
        'late night (22:00)',
        {
          start_date_local: '2024-01-01T22:00:00Z',
        },
        'night',
      ],
      [
        'late night (23:00)',
        {
          start_date_local: '2024-01-01T23:00:00Z',
        },
        'night',
      ],
      [
        'midnight (0:00)',
        {
          start_date_local: '2024-01-01T00:00:00Z',
        },
        'night',
      ],
      [
        'early night (1:00)',
        {
          start_date_local: '2024-01-01T01:00:00Z',
        },
        'night',
      ],
      [
        'early night (2:00)',
        {
          start_date_local: '2024-01-01T02:00:00Z',
        },
        'night',
      ],
      [
        'early night (3:00)',
        {
          start_date_local: '2024-01-01T03:00:00Z',
        },
        'night',
      ],
      [
        'early night (4:00)',
        {
          start_date_local: '2024-01-01T04:00:00Z',
        },
        'night',
      ],
      [
        'night at 4:59',
        {
          start_date_local: '2024-01-01T04:59:59Z',
        },
        'night',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('handles fallback to start_date when start_date_local missing', () => {
    test.each<Case>([
      [
        'uses start_date for morning',
        {
          start_date: '2024-01-01T07:00:00Z',
        },
        'morning',
      ],
      [
        'uses start_date for day',
        {
          start_date: '2024-01-01T14:00:00Z',
        },
        'day',
      ],
      [
        'uses start_date for evening',
        {
          start_date: '2024-01-01T18:00:00Z',
        },
        'evening',
      ],
      [
        'uses start_date for night',
        {
          start_date: '2024-01-01T22:00:00Z',
        },
        'night',
      ],
      [
        'prefers start_date_local over start_date',
        {
          start_date_local: '2024-01-01T07:00:00Z',
          start_date: '2024-01-01T22:00:00Z',
        },
        'morning',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('defaults to day when no timestamp available', () => {
    test.each<Case>([
      ['defaults to day when both timestamps missing', {}, 'day'],
      [
        'defaults to day when start_date_local is undefined',
        {
          start_date_local: undefined,
        },
        'day',
      ],
      [
        'defaults to day when start_date is undefined',
        {
          start_date: undefined,
        },
        'day',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('handles different date formats', () => {
    test.each<Case>([
      [
        'handles ISO 8601 format',
        {
          start_date_local: '2024-01-01T07:00:00Z',
        },
        'morning',
      ],
      [
        'handles ISO format with milliseconds',
        {
          start_date_local: '2024-01-01T07:00:00.000Z',
        },
        'morning',
      ],
      [
        'handles ISO format with timezone offset',
        {
          start_date_local: '2024-01-01T07:00:00+00:00',
        },
        'morning',
      ],
      [
        'handles different year',
        {
          start_date_local: '2023-12-31T18:00:00Z',
        },
        'evening',
      ],
      [
        'handles leap year date',
        {
          start_date_local: '2024-02-29T15:00:00Z',
        },
        'day',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });

  describe('handles various activity types', () => {
    test.each<Case>([
      [
        'Run activity at morning',
        {
          start_date_local: '2024-01-01T07:00:00Z',
        },
        'morning',
      ],
      [
        'Ride activity at day',
        {
          start_date_local: '2024-01-01T14:00:00Z',
        },
        'day',
      ],
      [
        'Swim activity at evening',
        {
          start_date_local: '2024-01-01T18:00:00Z',
        },
        'evening',
      ],
      [
        'VirtualRide at night',
        {
          start_date_local: '2024-01-01T22:00:00Z',
        },
        'night',
      ],
      [
        'Walk activity at morning',
        {
          start_date_local: '2024-01-01T08:00:00Z',
        },
        'morning',
      ],
    ])('%#. %s', (_name, activity, expected) => {
      const result = extractTimeOfDaySignals(activity);

      expect(result).toBe(expected);
    });
  });
});
