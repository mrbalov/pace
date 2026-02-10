## Project Rules

- [AGENTS.md](./AGENTS.md)
- [AGENTS.md](./openspec/AGENTS.md)
- [project.md](./openspec/project.md)
- [CODE_STYLE.md](./openspec/CODE_STYLE.md)
- [LINTING.md](./openspec/LINTING.md)
- [TESTING.md](./openspec/TESTING.md)

## Test-Driven Development

1. Write tests FIRST before any implementation, follow [TESTING.md](./openspec/TESTING.md)
2. Present tests to the user with: "Please review and approve tests"
3. WAIT for explicit user approval before proceeding
4. NEVER write implementation code until tests are approved

## Critical Project Rules

**NEVER use `let` - always use `const`**
**Arrow functions only** - `const fn = () => {}` not `function fn() {}`
**JSDoc required for ALL functions** - `/** @param {Type} param @returns {Type} */`
**No nested functions** - define all functions at top level
**No early returns** - use `if...else if...else` patterns
**Entity folder** - always create entity folder to keep implementation and tests together
**Module-scoped types** - prefix types with module name (e.g., `ActivityConfig`)
**Run tests after code changes** - `bun run test` from root
**Run linter after code changes** - `bun run lint` from root
**Always pause for human approval after generating tests** — do not proceed until approved

Default to using Bun and TypeScript instead of Node.js and JavaScript.
