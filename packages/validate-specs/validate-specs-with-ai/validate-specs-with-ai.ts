#!/usr/bin/env bun

import getSpecFilePaths from './get-spec-file-paths';
import { Output } from './types';
import buildUserPrompt from './build-user-prompt';
import askDial from './ask-dial';

const validateSpecsWithAI = async (
  systemPrompt: string,
  userPrompt: string,
  rootDir?: string,
  specFilePaths?: string[]
): Promise<Output> => {
  // Validate that exactly one of rootDir or specFilePaths is provided
  const hasRootDir = rootDir !== undefined;
  const hasSpecFilePaths = specFilePaths !== undefined;

  if (!hasRootDir && !hasSpecFilePaths) {
    throw new Error('Either rootDir or specFilePaths must be provided');
  }

  if (hasRootDir && hasSpecFilePaths) {
    throw new Error('Only one of rootDir or specFilePaths can be provided, not both');
  }

  // Get spec file paths either from rootDir or use provided specFilePaths
  const finalSpecFilePaths = hasRootDir
    ? await getSpecFilePaths(rootDir!)
    : specFilePaths!;

  const userPromptWithSpecs = await buildUserPrompt(finalSpecFilePaths, userPrompt);

  return askDial<Output>(systemPrompt, userPromptWithSpecs);
};

export default validateSpecsWithAI;
