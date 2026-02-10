import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import getCliArgs from './get-cli-args';

type Case = [
  string,
  {
    argv: string[];
    expected: {
      rootDir?: string;
      specFilePaths?: string[];
      systemPromptPath?: string;
      userPromptPath?: string;
    };
  },
];

describe('get-cli-args', () => {
  const testState = { originalArgv: process.argv };

  beforeEach(() => {
    testState.originalArgv = process.argv;
  });

  afterEach(() => {
    process.argv = testState.originalArgv;
  });

  test.each<Case>([
    [
      'returns undefined for all arguments when no flags provided',
      {
        argv: ['node', 'script.js'],
        expected: {
          rootDir: undefined,
          specFilePaths: undefined,
          systemPromptPath: undefined,
          userPromptPath: undefined,
        },
      },
    ],
    [
      'extracts root directory path correctly',
      {
        argv: ['node', 'script.js', '--rootDir', '/path/to/root'],
        expected: {
          rootDir: '/path/to/root',
        },
      },
    ],
    [
      'extracts system prompt path correctly',
      {
        argv: ['node', 'script.js', '--systemPrompt', '/path/to/system.txt'],
        expected: {
          systemPromptPath: '/path/to/system.txt',
        },
      },
    ],
    [
      'extracts user prompt path correctly',
      {
        argv: ['node', 'script.js', '--userPrompt', '/path/to/user.txt'],
        expected: {
          userPromptPath: '/path/to/user.txt',
        },
      },
    ],
    [
      'extracts single spec file path correctly',
      {
        argv: ['node', 'script.js', '--specFilePaths', '/path/to/spec.md'],
        expected: {
          specFilePaths: ['/path/to/spec.md'],
        },
      },
    ],
    [
      'extracts multiple spec file paths separated by commas',
      {
        argv: ['node', 'script.js', '--specFilePaths', '/path/to/spec1.md,/path/to/spec2.md'],
        expected: {
          specFilePaths: ['/path/to/spec1.md', '/path/to/spec2.md'],
        },
      },
    ],
    [
      'trims whitespace from spec file paths',
      {
        argv: ['node', 'script.js', '--specFilePaths', ' /path/to/spec1.md , /path/to/spec2.md '],
        expected: {
          specFilePaths: ['/path/to/spec1.md', '/path/to/spec2.md'],
        },
      },
    ],
    [
      'handles all arguments together',
      {
        argv: [
          'node',
          'script.js',
          '--rootDir',
          '/root',
          '--systemPrompt',
          '/system.txt',
          '--userPrompt',
          '/user.txt',
          '--specFilePaths',
          '/spec1.md,/spec2.md',
        ],
        expected: {
          rootDir: '/root',
          systemPromptPath: '/system.txt',
          userPromptPath: '/user.txt',
          specFilePaths: ['/spec1.md', '/spec2.md'],
        },
      },
    ],
    [
      'handles paths with spaces',
      {
        argv: ['node', 'script.js', '--rootDir', '/path with spaces/to/root'],
        expected: {
          rootDir: '/path with spaces/to/root',
        },
      },
    ],
    [
      'handles relative paths',
      {
        argv: ['node', 'script.js', '--rootDir', './relative/path'],
        expected: {
          rootDir: './relative/path',
        },
      },
    ],
    [
      'handles empty spec file paths string',
      {
        argv: ['node', 'script.js', '--specFilePaths', ''],
        expected: {
          specFilePaths: [''],
        },
      },
    ],
    [
      'handles multiple consecutive commas in spec file paths',
      {
        argv: ['node', 'script.js', '--specFilePaths', '/spec1.md,,/spec2.md'],
        expected: {
          specFilePaths: ['/spec1.md', '', '/spec2.md'],
        },
      },
    ],
    [
      'handles arguments in different order',
      {
        argv: [
          'node',
          'script.js',
          '--userPrompt',
          '/user.txt',
          '--rootDir',
          '/root',
          '--systemPrompt',
          '/system.txt',
        ],
        expected: {
          rootDir: '/root',
          systemPromptPath: '/system.txt',
          userPromptPath: '/user.txt',
        },
      },
    ],
    [
      'returns undefined when flag exists but value is missing',
      {
        argv: ['node', 'script.js', '--rootDir'],
        expected: {
          rootDir: undefined,
        },
      },
    ],
  ])('%#. %s', (_name, { argv, expected }) => {
    process.argv = argv;
    const result = getCliArgs();

    if (expected.rootDir !== undefined) {
      expect(result.rootDir).toStrictEqual(expected.rootDir);
    }
    if (expected.specFilePaths !== undefined) {
      expect(result.specFilePaths).toStrictEqual(expected.specFilePaths);
    }
    if (expected.systemPromptPath !== undefined) {
      expect(result.systemPromptPath).toStrictEqual(expected.systemPromptPath);
    }
    if (expected.userPromptPath !== undefined) {
      expect(result.userPromptPath).toStrictEqual(expected.userPromptPath);
    }
  });
});
