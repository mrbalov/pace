const getCliArg = (name: string): string | undefined => {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);

  return index !== -1 ? String(args[index + 1]) : undefined;
};

const getCliArgs = () => {
  const rootDirArg = getCliArg('--rootDir');
  const specFilePathsArg = getCliArg('--specFilePaths');
  
  return {
    rootDir: rootDirArg ? rootDirArg : undefined,
    specFilePaths: specFilePathsArg ? specFilePathsArg.split(',').map(path => path.trim()) : undefined,
    systemPromptPath: getCliArg('--systemPrompt'),
    userPromptPath: getCliArg('--userPrompt'),
  };
};

export default getCliArgs;
