import { readFile } from 'node:fs/promises';

/**
 * Builds a user prompt with embedded specification contents.
 *
 * Reads all specification files and embeds their contents into the user prompt
 * in a structured format. Each spec is numbered and includes its file path.
 * This allows the AI to validate specifications with full context.
 *
 * The output format includes:
 * - Original user prompt
 * - Separator: "--- BEGIN SPECIFICATIONS ---"
 * - Numbered specifications with paths and content
 * - Separator: "--- END SPECIFICATIONS ---"
 *
 * @param {string[]} specFilePaths - Array of file paths to specification files to include
 * @param {string} userPrompt - Base user prompt describing the validation task
 * @returns {Promise<string>} Promise resolving to formatted prompt string with embedded specifications
 *
 * @example
 * ```typescript
 * const prompt = await buildUserPrompt(
 *   ['/path/to/spec1.md', '/path/to/spec2.md'],
 *   'Validate these specifications'
 * );
 * ```
 */
const buildUserPrompt = async (specFilePaths: string[], userPrompt: string): Promise<string> => {
  const specs = [];

  for (const filePath of specFilePaths) {
    const content = await readFile(filePath, 'utf8');

    specs.push({
      path: filePath,
      content: content.trim(),
    });
  }

  const specificationContents = specs.map((spec, index) => (
    `
    [SPEC ${index + 1}]
    PATH: ${spec.path}

    ${spec.content}
    `
  )).join('\n\n');

  return (
    `
    ${userPrompt}

    --- BEGIN SPECIFICATIONS ---

    ${specificationContents}

    --- END SPECIFICATIONS ---
    `
  ).trim();
};

export default buildUserPrompt;
