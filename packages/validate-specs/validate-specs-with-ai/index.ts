#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';
import validateSpecsWithAI from './validate-specs-with-ai';

/**
 * CLI entry point.
 */
if (import.meta.main) {
  const { default: getCliArgs } = await import('./get-cli-args.js');
  const { rootDir, systemPromptPath, userPromptPath } = getCliArgs();
  
  if (!systemPromptPath) {
    throw new Error('--systemPrompt is required');
  }
  if (!userPromptPath) {
    throw new Error('--userPrompt is required');
  }
  
  const systemPrompt = await readFile(systemPromptPath, 'utf8');
  const userPrompt = await readFile(userPromptPath, 'utf8');
  const result = await validateSpecsWithAI(rootDir, systemPrompt.trim(), userPrompt.trim());

  console.info(JSON.stringify(result, null, 2));
}

export default validateSpecsWithAI;
