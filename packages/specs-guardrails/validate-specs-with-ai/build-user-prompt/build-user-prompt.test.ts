import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import buildUserPrompt from './build-user-prompt';

type Case = [
  string,
  {
    specContents: string[];
    userPrompt: string;
    expectedContains: string[];
  },
];

describe('build-user-prompt', () => {
  const testState = { tempDir: '' };

  beforeEach(async () => {
    testState.tempDir = join(tmpdir(), `test-build-user-prompt-${Date.now()}`);
    await mkdir(testState.tempDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testState.tempDir, { recursive: true, force: true });
  });

  test.each<Case>([
    [
      'combines user prompt with single specification file',
      {
        specContents: ['Specification content one'],
        userPrompt: 'Validate these specifications',
        expectedContains: [
          'Validate these specifications',
          '--- BEGIN SPECIFICATIONS ---',
          '--- END SPECIFICATIONS ---',
          '[SPEC 1]',
          'Specification content one',
        ],
      },
    ],
    [
      'formats single specification with correct path and content',
      {
        specContents: ['Check the rules'],
        userPrompt: 'Check the rules',
        expectedContains: ['Check the rules', '[SPEC 1]', 'Check the rules'],
      },
    ],
    [
      'handles multiple specifications in correct order',
      {
        specContents: ['First spec', 'Second spec', 'Third spec'],
        userPrompt: 'Review all specs',
        expectedContains: [
          'Review all specs',
          '[SPEC 1]',
          '[SPEC 2]',
          '[SPEC 3]',
          'First spec',
          'Second spec',
          'Third spec',
        ],
      },
    ],
    [
      'preserves user prompt text exactly',
      {
        specContents: ['Test content'],
        userPrompt: 'Please validate the following specifications carefully',
        expectedContains: ['Please validate the following specifications carefully'],
      },
    ],
    [
      'trims whitespace from specification content',
      {
        specContents: ['   \n  Content with whitespace  \n  '],
        userPrompt: 'Test prompt',
        expectedContains: ['Content with whitespace'],
      },
    ],
    [
      'numbers specifications sequentially starting from one',
      {
        specContents: ['One', 'Two', 'Three'],
        userPrompt: 'Validate',
        expectedContains: ['[SPEC 1]', '[SPEC 2]', '[SPEC 3]'],
      },
    ],
    [
      'includes full file path for each specification',
      {
        specContents: ['Path test'],
        userPrompt: 'Check paths',
        expectedContains: ['PATH:'],
      },
    ],
    [
      'handles empty user prompt gracefully',
      {
        specContents: ['Some content'],
        userPrompt: '',
        expectedContains: ['--- BEGIN SPECIFICATIONS ---'],
      },
    ],
    [
      'handles user prompt with newlines',
      {
        specContents: ['Content'],
        userPrompt: 'Line one\nLine two\nLine three',
        expectedContains: ['Line one\nLine two\nLine three'],
      },
    ],
    [
      'handles user prompt with special characters',
      {
        specContents: ['Content'],
        userPrompt: 'Check for @#$%^&*() characters',
        expectedContains: ['Check for @#$%^&*() characters'],
      },
    ],
    [
      'handles very long user prompt',
      {
        specContents: ['Content'],
        userPrompt: 'A'.repeat(1000),
        expectedContains: ['A'.repeat(1000)],
      },
    ],
    [
      'handles user prompt with unicode characters',
      {
        specContents: ['Content'],
        userPrompt: 'Validate 测试 🚀 émojis',
        expectedContains: ['Validate 测试 🚀 émojis'],
      },
    ],
  ])('%#. %s', async (_name, { specContents, userPrompt, expectedContains }) => {
    await Promise.all(
      specContents.map(async (content, i) => {
        const specFile = join(testState.tempDir, `spec${Number(i) + 1}.spec.md`);
        await writeFile(specFile, content);
      }),
    );

    const specFilePaths = Array.from({ length: specContents.length }, (_, i) =>
      join(testState.tempDir, `spec${Number(i) + 1}.spec.md`),
    );

    const result = await buildUserPrompt(specFilePaths, userPrompt);

    for (const expected of expectedContains) {
      expect(result).toContain(expected);
    }
  });

  test('reads and includes actual specification file content', async () => {
    const specFile = join(testState.tempDir, 'test.spec.md');
    const specContent = '# Test Specification\n\nThis is a test specification.';
    await writeFile(specFile, specContent);

    const result = await buildUserPrompt([specFile], 'Validate this');

    expect(result).toContain(specContent);
    expect(result).toContain('PATH: ' + specFile);
    expect(result).toContain('[SPEC 1]');
  });

  test('handles specification files with complex markdown content', async () => {
    const specFile = join(testState.tempDir, 'complex.spec.md');
    const specContent =
      '# Title\n\n## Section\n\n- Item 1\n- Item 2\n\n```typescript\ncode block\n```';
    await writeFile(specFile, specContent);

    const result = await buildUserPrompt([specFile], 'Check complex');

    expect(result).toContain(specContent);
  });

  test('handles empty specification file', async () => {
    const specFile = join(testState.tempDir, 'empty.spec.md');
    await writeFile(specFile, '');

    const result = await buildUserPrompt([specFile], 'Check empty');

    expect(result).toContain('[SPEC 1]');
    expect(result).toContain('PATH: ' + specFile);
  });
});
