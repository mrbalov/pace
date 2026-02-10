import { describe, test, expect } from 'bun:test';
import sum from './sum';

type Case = [
  string,
  {
    a: number;
    b: number;
    expected: number;
  },
];

describe('sum', () => {
  test.each<Case>([
    [
      'adds two positive integers',
      {
        a: 5,
        b: 3,
        expected: 8,
      },
    ],
    [
      'adds two negative integers',
      {
        a: -5,
        b: -3,
        expected: -8,
      },
    ],
    [
      'adds positive and negative integer',
      {
        a: 10,
        b: -4,
        expected: 6,
      },
    ],
    [
      'adds negative and positive integer',
      {
        a: -10,
        b: 4,
        expected: -6,
      },
    ],
    [
      'adds two decimals',
      {
        a: 1.5,
        b: 2.3,
        expected: 3.8,
      },
    ],
    [
      'adds zero to positive number',
      {
        a: 0,
        b: 5,
        expected: 5,
      },
    ],
    [
      'adds positive number to zero',
      {
        a: 5,
        b: 0,
        expected: 5,
      },
    ],
    [
      'adds zero to zero',
      {
        a: 0,
        b: 0,
        expected: 0,
      },
    ],
    [
      'adds two negative decimals',
      {
        a: -1.5,
        b: -2.3,
        expected: -3.8,
      },
    ],
    [
      'adds large numbers',
      {
        a: 1000000,
        b: 2000000,
        expected: 3000000,
      },
    ],
  ])('%s', (_name, { a, b, expected }) => {
    const result = sum(a, b);
    expect(result).toBe(expected);
  });
});
