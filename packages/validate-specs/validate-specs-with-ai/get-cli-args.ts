const getCliArg = (name: string): string | undefined => {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);

  return index !== -1 ? String(args[index + 1]) : undefined;
};

const getCliArgs = () => ({
  rootDir: getCliArg('--rootDir') ?? process.cwd(),
  systemPromptPath: getCliArg('--systemPrompt'),
  userPromptPath: getCliArg('--userPrompt'),
});

export default getCliArgs;
