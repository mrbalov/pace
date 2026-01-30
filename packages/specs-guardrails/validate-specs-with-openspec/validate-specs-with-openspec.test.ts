import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
type Case = [
  string,
  {
    rootDir: string;
    exitCode: number;
    stdout: string;
    stderr: string;
    shouldThrow: boolean;
    expectedError?: string;
    expectedSuccess: boolean;
  }
];

describe('validate-specs-with-openspec', () => {
  const testState = { tempDir: '', originalSpawn: Bun.spawn };

  beforeEach(async () => {
    testState.tempDir = join(tmpdir(), `test-validate-specs-with-openspec-${Date.now()}`);
    await mkdir(testState.tempDir, { recursive: true });
    testState.originalSpawn = Bun.spawn;
    
    // Mock existsSync to return true for any path ending with node_modules/.bin/openspec
    const actualFs = await import('node:fs');
    void mock.module('node:fs', () => ({
      ...actualFs,
      existsSync: (path: string) => {
        if (typeof path === 'string' && path.endsWith('node_modules/.bin/openspec')) {
          return true;
        }
        return actualFs.existsSync(path);
      },
    }));
  });

  afterEach(async () => {
    await rm(testState.tempDir, { recursive: true, force: true });
    Bun.spawn = testState.originalSpawn;
  });

  test.each<Case>([
    [
      'returns success when openspec validation passes',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: '',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'returns failure when openspec validation fails',
      {
        rootDir: '/test/path',
        exitCode: 1,
        stdout: JSON.stringify({
          items: [
            {
              id: 'test-id',
              type: 'spec',
              valid: false,
              issues: [
                {
                  level: 'ERROR',
                  path: '/test/path',
                  message: 'Validation failed',
                },
              ],
              durationMs: 100,
            },
          ],
          summary: {
            totals: {
              items: 1,
              passed: 0,
              failed: 1,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 1,
                passed: 0,
                failed: 1,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: 'Error message',
        shouldThrow: false,
        expectedSuccess: false,
      },
    ],
    [
      'handles empty validation results',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: '',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'handles multiple validation items',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: JSON.stringify({
          items: [
            {
              id: 'item1',
              type: 'spec',
              valid: true,
              issues: [],
              durationMs: 50,
            },
            {
              id: 'item2',
              type: 'change',
              valid: true,
              issues: [],
              durationMs: 75,
            },
          ],
          summary: {
            totals: {
              items: 2,
              passed: 2,
              failed: 0,
            },
            byType: {
              change: {
                items: 1,
                passed: 1,
                failed: 0,
              },
              spec: {
                items: 1,
                passed: 1,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: '',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'handles stderr output',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: 'Warning message',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'handles different exit codes',
      {
        rootDir: '/test/path',
        exitCode: 2,
        stdout: JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: '',
        shouldThrow: false,
        expectedSuccess: false,
      },
    ],
    [
      'handles validation items with issues',
      {
        rootDir: '/test/path',
        exitCode: 1,
        stdout: JSON.stringify({
          items: [
            {
              id: 'item1',
              type: 'spec',
              valid: false,
              issues: [
                {
                  level: 'ERROR',
                  path: '/path1',
                  message: 'Error 1',
                },
                {
                  level: 'WARNING',
                  path: '/path2',
                  message: 'Warning 1',
                },
              ],
              durationMs: 100,
            },
          ],
          summary: {
            totals: {
              items: 1,
              passed: 0,
              failed: 1,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 1,
                passed: 0,
                failed: 1,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: '',
        shouldThrow: false,
        expectedSuccess: false,
      },
    ],
    [
      'handles different version strings',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '2.5.1',
        }),
        stderr: '',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'handles whitespace in stdout',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: '  \n  ' + JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }) + '  \n  ',
        stderr: '',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'handles whitespace in stderr',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        }),
        stderr: '  \n  Error message  \n  ',
        shouldThrow: false,
        expectedSuccess: true,
      },
    ],
    [
      'throws error when stdout is not valid JSON',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: 'not valid json',
        stderr: '',
        shouldThrow: true,
        expectedError: 'Failed to parse openspec JSON output',
        expectedSuccess: false,
      },
    ],
    [
      'throws error when JSON parsing fails',
      {
        rootDir: '/test/path',
        exitCode: 0,
        stdout: '{ invalid json }',
        stderr: '',
        shouldThrow: true,
        expectedError: 'Failed to parse openspec JSON output',
        expectedSuccess: false,
      },
    ],
  ])('%#. %s', async (_name, { rootDir, exitCode, stdout, stderr, shouldThrow, expectedError, expectedSuccess }) => {
    const mockProc = {
      stdout: new Response(stdout).body as ReadableStream,
      stderr: new Response(stderr).body as ReadableStream,
      exited: Promise.resolve(exitCode),
    };

    Bun.spawn = mock(() => mockProc) as unknown as typeof Bun.spawn;

    // Re-import the function to get the mocked version
    const { default: validateSpecsWithOpenspec } = await import('./validate-specs-with-openspec');

    if (shouldThrow) {
      expect(validateSpecsWithOpenspec(rootDir)).rejects.toThrow(expectedError);
    } else {
      const result = await validateSpecsWithOpenspec(rootDir);

      expect(result.success).toStrictEqual(expectedSuccess);
      expect(result.exitCode).toStrictEqual(exitCode);
      expect(result.stderr).toStrictEqual(stderr.trim());
      expect(result.version).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.summary).toBeDefined();
    }
  });

  test('calls openspec with correct arguments', async () => {
    const mockSpawn = mock(() => ({
        stdout: new Response(JSON.stringify({
          items: [],
          summary: {
            totals: {
              items: 0,
              passed: 0,
              failed: 0,
            },
            byType: {
              change: {
                items: 0,
                passed: 0,
                failed: 0,
              },
              spec: {
                items: 0,
                passed: 0,
                failed: 0,
              },
            },
          },
          version: '1.0.0',
        })).body as ReadableStream,
        stderr: new Response('').body as ReadableStream,
        exited: Promise.resolve(0),
      } as unknown));

    Bun.spawn = mockSpawn as typeof Bun.spawn;

    // Re-import the function to get the mocked version
    const { default: validateSpecsWithOpenspec } = await import('./validate-specs-with-openspec');

    await validateSpecsWithOpenspec('/test/path');

    expect(mockSpawn).toHaveBeenCalled();
    const callArgs = mockSpawn.mock.calls[0];
    expect(callArgs[0]).toContain('bun');
    expect(callArgs[0]).toContain('validate');
    expect(callArgs[0]).toContain('--all');
    expect(callArgs[0]).toContain('--strict');
    expect(callArgs[0]).toContain('--no-interactive');
    expect(callArgs[0]).toContain('--json');
  });
});
