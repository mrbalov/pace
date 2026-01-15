const getCliArg = (name: string): string | undefined => {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);

  if (index === -1 || args[index + 1] === undefined) {
    return undefined;
  } else {
    return String(args[index + 1]);
  }
};

const getCliArgs = () => ({
  rootDir: getCliArg('--rootDir') ?? process.cwd(),
});

export default getCliArgs;
