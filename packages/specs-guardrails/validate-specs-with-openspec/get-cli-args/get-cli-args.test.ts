import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import getCliArgs from './get-cli-args';

type Case = [
  string,
  {
    argv: string[];
    expectedRootDir: string;
  },
];

describe('get-cli-args', () => {
  const testState = { originalArgv: process.argv, originalCwd: process.cwd() };

  beforeEach(() => {
    testState.originalArgv = process.argv;
    testState.originalCwd = process.cwd();
  });

  afterEach(() => {
    process.argv = testState.originalArgv;
    process.chdir(testState.originalCwd);
  });

  test.each<Case>([
    [
      'returns current working directory when no rootDir flag provided',
      {
        argv: ['node', 'script.js'],
        expectedRootDir: process.cwd(),
      },
    ],
    [
      'extracts root directory path correctly',
      {
        argv: ['node', 'script.js', '--rootDir', '/path/to/root'],
        expectedRootDir: '/path/to/root',
      },
    ],
    [
      'handles absolute paths',
      {
        argv: ['node', 'script.js', '--rootDir', '/absolute/path/to/directory'],
        expectedRootDir: '/absolute/path/to/directory',
      },
    ],
    [
      'handles relative paths',
      {
        argv: ['node', 'script.js', '--rootDir', './relative/path'],
        expectedRootDir: './relative/path',
      },
    ],
    [
      'handles paths with spaces',
      {
        argv: ['node', 'script.js', '--rootDir', '/path with spaces/to/root'],
        expectedRootDir: '/path with spaces/to/root',
      },
    ],
    [
      'handles paths with special characters',
      {
        argv: ['node', 'script.js', '--rootDir', '/path/with-special_chars/123'],
        expectedRootDir: '/path/with-special_chars/123',
      },
    ],
    [
      'handles root directory path',
      {
        argv: ['node', 'script.js', '--rootDir', '/'],
        expectedRootDir: '/',
      },
    ],
    [
      'handles home directory path',
      {
        argv: ['node', 'script.js', '--rootDir', '~'],
        expectedRootDir: '~',
      },
    ],
    [
      'handles empty string as root directory',
      {
        argv: ['node', 'script.js', '--rootDir', ''],
        expectedRootDir: '',
      },
    ],
    [
      'handles very long path',
      {
        argv: [
          'node',
          'script.js',
          '--rootDir',
          '/very/long/path/with/many/segments/that/goes/on/and/on',
        ],
        expectedRootDir: '/very/long/path/with/many/segments/that/goes/on/and/on',
      },
    ],
    [
      'handles path with unicode characters',
      {
        argv: ['node', 'script.js', '--rootDir', '/path/测试/目录'],
        expectedRootDir: '/path/测试/目录',
      },
    ],
    [
      'handles path with dots',
      {
        argv: ['node', 'script.js', '--rootDir', '../parent/../current'],
        expectedRootDir: '../parent/../current',
      },
    ],
    [
      'returns current working directory when flag exists but value is missing',
      {
        argv: ['node', 'script.js', '--rootDir'],
        expectedRootDir: process.cwd(),
      },
    ],
  ])('%#. %s', (_name, { argv, expectedRootDir }) => {
    process.argv = argv;
    const result = getCliArgs();

    expect(result.rootDir).toStrictEqual(expectedRootDir);
  });

  test('always returns an object with rootDir property', () => {
    process.argv = ['node', 'script.js'];
    const result = getCliArgs();

    expect(result).toHaveProperty('rootDir');
    expect(typeof result.rootDir).toStrictEqual('string');
  });
});
