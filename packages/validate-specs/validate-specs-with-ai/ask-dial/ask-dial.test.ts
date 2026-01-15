import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import askDial from './ask-dial';

type Case = [
  string,
  {
    systemPrompt: string;
    userPrompt: string;
    dialKey: string;
    responseBody: any;
    shouldThrow: boolean;
    expectedError?: string;
    expectedResult?: any;
  }
];

describe('ask-dial', () => {
  let originalEnv: string | undefined;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalEnv = process.env.DIAL_KEY;
    originalFetch = global.fetch;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.DIAL_KEY = originalEnv;
    } else {
      delete process.env.DIAL_KEY;
    }
    global.fetch = originalFetch;
  });

  test.each<Case>([
    [
      'throws error when DIAL_KEY environment variable is not set',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: '',
        responseBody: {},
        shouldThrow: true,
        expectedError: 'DIAL_KEY is not set',
      },
    ],
    [
      'returns parsed JSON content from successful response',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  result: 'VALID',
                  spec_count: 1,
                }),
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: {
          result: 'VALID',
          spec_count: 1,
        },
      },
    ],
    [
      'handles empty system prompt',
      {
        systemPrompt: '',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: JSON.stringify({ result: 'VALID' }),
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: {
          result: 'VALID',
        },
      },
    ],
    [
      'handles empty user prompt',
      {
        systemPrompt: 'System prompt',
        userPrompt: '',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: JSON.stringify({ result: 'VALID' }),
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: {
          result: 'VALID',
        },
      },
    ],
    [
      'handles very long prompts',
      {
        systemPrompt: 'A'.repeat(10000),
        userPrompt: 'B'.repeat(10000),
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: JSON.stringify({ result: 'VALID' }),
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: {
          result: 'VALID',
        },
      },
    ],
    [
      'handles prompts with special characters',
      {
        systemPrompt: 'System @#$%^&*() prompt',
        userPrompt: 'User 测试 🚀 prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: JSON.stringify({ result: 'VALID' }),
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: {
          result: 'VALID',
        },
      },
    ],
    [
      'throws error when API returns error object',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          error: {
            message: 'API error occurred',
          },
        },
        shouldThrow: true,
        expectedError: 'API error occurred',
      },
    ],
    [
      'throws error when API returns error without message',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          error: {},
        },
        shouldThrow: true,
        expectedError: 'Unknown DIAL error.',
      },
    ],
    [
      'throws error when response has no content',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {},
            },
          ],
        },
        shouldThrow: true,
        expectedError: 'No content in DIAL response.',
      },
    ],
    [
      'throws error when response has no choices',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [],
        },
        shouldThrow: true,
        expectedError: 'No content in DIAL response.',
      },
    ],
    [
      'handles complex JSON response content',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  validated_scope: 'FULL_SPECIFICATION_SET',
                  result: 'VALID',
                  spec_count: 5,
                  notes: [
                    'Note 1',
                    'Note 2',
                  ],
                  violations: [],
                }),
              },
            },
          ],
        },
        shouldThrow: false,
        expectedResult: {
          validated_scope: 'FULL_SPECIFICATION_SET',
          result: 'VALID',
          spec_count: 5,
          notes: [
            'Note 1',
            'Note 2',
          ],
          violations: [],
        },
      },
    ],
    [
      'handles response with invalid JSON content',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                content: 'not valid json',
              },
            },
          ],
        },
        shouldThrow: true,
        expectedError: undefined,
      },
    ],
  ])('%#. %s', async (_name, { systemPrompt, userPrompt, dialKey, responseBody, shouldThrow, expectedError, expectedResult }) => {
    if (dialKey) {
      process.env.DIAL_KEY = dialKey;
    } else {
      delete process.env.DIAL_KEY;
    }

    global.fetch = mock(() =>
      Promise.resolve({
        json: () => Promise.resolve(responseBody),
      } as Response)
    ) as typeof fetch;

    if (shouldThrow) {
      await expect(askDial(systemPrompt, userPrompt)).rejects.toThrow(expectedError);
    } else {
      const result = await askDial(systemPrompt, userPrompt);

      expect(result).toStrictEqual(expectedResult);
    }
  });

  test('sends correct request to DIAL API', async () => {
    process.env.DIAL_KEY = 'test-key';

    const mockFetch = mock(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({ result: 'VALID' }),
                },
              },
            ],
          }),
      } as Response)
    ) as typeof fetch;

    global.fetch = mockFetch;

    await askDial('System prompt', 'User prompt');

    expect(mockFetch).toHaveBeenCalled();
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toContain('ai-proxy.lab.epam.com');
    expect(callArgs[0]).toContain('chat/completions');
    expect(callArgs[1]?.method).toStrictEqual('POST');
    expect(callArgs[1]?.headers).toBeDefined();
    expect(callArgs[1]?.headers?.['Content-Type']).toStrictEqual('application/json');
    expect(callArgs[1]?.headers?.['Api-Key']).toBeDefined();
  });

  test('includes correct messages in request body', async () => {
    process.env.DIAL_KEY = 'test-key';

    let requestBody: any;

    const mockFetch = mock((url, options) => {
      requestBody = JSON.parse(options?.body as string);
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({ result: 'VALID' }),
                },
              },
            ],
          }),
      } as Response);
    }) as typeof fetch;

    global.fetch = mockFetch;

    await askDial('Test system', 'Test user');

    expect(requestBody.messages).toHaveLength(2);
    expect(requestBody.messages[0]).toStrictEqual({
      role: 'system',
      content: 'Test system',
    });
    expect(requestBody.messages[1]).toStrictEqual({
      role: 'user',
      content: 'Test user',
    });
    expect(requestBody.temperature).toBeDefined();
  });
});
