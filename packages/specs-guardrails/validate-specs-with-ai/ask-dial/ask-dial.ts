#!/usr/bin/env bun

import { CONFIG } from './constants';
import { DialResponse } from './types';

/**
 * Sends a prompt to the DIAL AI service and returns parsed response.
 *
 * Makes a POST request to the DIAL (AI Proxy) service with system and user
 * prompts. The service returns a JSON response that is parsed and returned
 * as the specified type. Handles errors and validates response structure.
 *
 * The function expects the AI response content to be valid JSON that can be
 * parsed into the specified type T. The response is wrapped in a DialResponse
 * structure from the API.
 *
 * @template T - Expected response type (must be a record/object type)
 * @param {string} systemPrompt - System prompt providing context and instructions to the AI
 * @param {string} userPrompt - User prompt with the actual request/question
 * @returns {Promise<T>} Promise resolving to parsed JSON response of type T
 * @throws {Error} Throws error if:
 *   - DIAL_KEY environment variable is not set
 *   - API returns an error response
 *   - Response content is missing or invalid JSON
 *
 * @see {@link https://ai-proxy.lab.epam.com/ | DIAL AI Proxy Service}
 *
 * @example
 * ```typescript
 * const result = await askDial<ValidationOutput>(
 *   'You are a specification validator...',
 *   'Validate these specs: ...'
 * );
 * ```
 */
const askDial = async <T extends Record<string, unknown>>(
  systemPrompt: string,
  userPrompt: string,
): Promise<T> => {
  if (!process.env.DIAL_KEY) {
    throw new Error('DIAL_KEY is not set');
  }

  const body = JSON.stringify({
    temperature: CONFIG.TEMPERATURE,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  const response = await fetch(
    `https://ai-proxy.lab.epam.com/openai/deployments/${CONFIG.MODEL}/chat/completions?api-version=${CONFIG.API_VERSION}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': CONFIG.API_KEY,
        'Content-Length': Buffer.byteLength(body).toString(),
      },
      body,
    },
  );
  const json = (await response.json()) as DialResponse;
  const contentRaw = json.choices?.[0]?.message?.content;
  const content = contentRaw ? (JSON.parse(contentRaw) as T) : null;

  if (json.error) {
    throw new Error(json.error.message ?? 'Unknown DIAL error.');
  } else if (!content) {
    throw new Error('No content in DIAL response.');
  } else {
    return content;
  }
};

export default askDial;
