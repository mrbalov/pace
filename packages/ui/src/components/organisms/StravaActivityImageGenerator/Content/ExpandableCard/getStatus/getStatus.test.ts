import { describe, test, expect } from 'bun:test';

import getStatus from './getStatus';
import { Status } from '../types';
import { Input } from './types';

type Case = [string, Input, Status];

describe('getStatus', () => {
  test.each<Case>([
    [
      'loading state showing spinner',
      {
        isLoading: true,
        isLoaded: false,
        hasContent: false,
      },
      'loading',
    ],
    [
      'loading state even when loaded with content',
      {
        isLoading: true,
        isLoaded: true,
        hasContent: true,
      },
      'loading',
    ],
    [
      'loading state even when loaded without content',
      {
        isLoading: true,
        isLoaded: true,
        hasContent: false,
      },
      'loading',
    ],
    [
      'loading state even when not loaded but has content',
      {
        isLoading: true,
        isLoaded: false,
        hasContent: true,
      },
      'loading',
    ],
    [
      'successful completion showing content',
      {
        isLoading: false,
        isLoaded: true,
        hasContent: true,
      },
      'loaded',
    ],
    [
      'failed operation showing error',
      {
        isLoading: false,
        isLoaded: true,
        hasContent: false,
      },
      'error',
    ],
    [
      'waiting for operation to start',
      {
        isLoading: false,
        isLoaded: false,
        hasContent: false,
      },
      'pending',
    ],
    [
      'waiting for operation even with available content',
      {
        isLoading: false,
        isLoaded: false,
        hasContent: true,
      },
      'pending',
    ],
  ])('%#. %s', (_name, input, expected) => {
    const result = getStatus(input);

    expect(result).toBe(expected);
  });
});
