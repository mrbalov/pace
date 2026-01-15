import { readFile } from 'node:fs/promises';

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
