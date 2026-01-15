#!/usr/bin/env bun

import getSpecFilePaths from './get-spec-file-paths';
import { Output } from './types';
import buildUserPrompt from './build-user-prompt';
import askDial from './ask-dial';

const validateSpecsWithAI = async (
  rootDir: string,
  systemPrompt: string,
  userPrompt: string
): Promise<Output> => {
  const specFilePaths = await getSpecFilePaths(rootDir);
  const usePromptWithSpecs = await buildUserPrompt(specFilePaths, userPrompt);

  return askDial<Output>(systemPrompt, usePromptWithSpecs);
};

export default validateSpecsWithAI;
