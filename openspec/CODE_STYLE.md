# Code Style

## TypeScript Configuration
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled with `noImplicitAny`
- Bun types included

## File Organization
- Each function has its own dedicated folder: `function-name/function-name.ts`, `function-name/index.ts`, `function-name/function-name.test.ts`
- Additional files when needed: `types.ts` for type definitions, `constants.ts` for constants
- Main entry files (CLI executables) use `#!/usr/bin/env bun` shebang at the top
- Test files are co-located with source files: `function-name/function-name.test.ts`

## Function Organization
- Each function should have its own dedicated folder with the function file and an `index.ts` that exports the function as `export { default } from './function-name';`
- Main module `index.ts` re-exports functions: `export { default as functionName } from './submodule';`
- This pattern applies to all functions across the codebase

## Function Definition Style
- Functions use arrow function syntax: `const functionName = async (...): Promise<Type> => { ... }`
- Functions are `const` declarations, not function declarations
- Return types are explicitly specified: `Promise<Output>`, `Promise<string[]>`, etc.
- No early returns - uses explicit `if...else if...else` pattern
- **NEVER use nested functions**: All functions MUST be defined at the top level of the file. Nested functions (functions defined inside other functions) are FORBIDDEN as they lead to poor performance. When decomposing a function into smaller pieces, extract each helper function to the top level of the file and pass necessary parameters explicitly. Use the `@internal` tag in JSDoc to mark helper functions that are not part of the public API.
- **JSDoc comments are REQUIRED for EVERY function**: ALL functions (exported, internal, public, private) MUST have JSDoc comments (`/** ... */`) directly above the function definition. This is mandatory with no exceptions. JSDoc MUST include:
  - **Description**: Clear description of what the function does and its purpose
  - **`@param` tags**: One tag per parameter with **explicit type in curly braces** and description (e.g., `@param {string} activityId - The activity ID to validate`). Types MUST always be specified using JSDoc type syntax (`{Type}`, `{Promise<Type>}`, `{Type | null}`, etc.). Optional parameters use square brackets: `@param {string} [optionalParam] - Description`.
  - **`@returns` tag**: **Explicit return type in curly braces** and description (e.g., `@returns {Promise<Activity>} Promise resolving to validated Activity object`). Return types MUST always be specified using JSDoc type syntax. For void returns, use `@returns {void}`.
  - **`@throws` tags**: Document all error conditions the function may throw (if applicable)
  - **`@see` tags**: Links to external resources (API documentation, RFCs, standards) when relevant
  - **`@example` tags**: Usage examples when helpful for understanding
  - **`@internal` tag**: Mark internal/private helper functions that are not part of the public API
  - **`@template` tags**: For generic functions, document type parameters (e.g., `@template T - The return type of the function`)

## CLI Entry Points
- Use `#!/usr/bin/env bun` shebang at the top of CLI entry files
- Check `if (import.meta.main)` for CLI execution
- Use dynamic imports for CLI args: `const { default: getCliArgs } = await import('./get-cli-args');`
- Output JSON with `console.info(JSON.stringify(result, null, 2))`
- Include JSDoc comment: `/**\n * CLI entry point.\n */`
- Validate required arguments and throw descriptive errors

## Type Definitions
- Types are in separate `types.ts` files within the same directory
- Use `export type` for type exports
- Use union types for enums: `type Status = 'VALID' | 'INVALID'`
- Types use PascalCase: `ValidationResult`, `DialResponse`, `Output`
- **Module-scoped types MUST use module name prefix**: Types defined within a module package MUST be prefixed with the module name (e.g., `ActivityConfig`, `ActivityError`, `ActivityValidationResult`). This ensures type names are unambiguous across modules and clearly indicate their scope.
- **Type comments MUST use JSDoc format**: All type definitions and their properties MUST be documented using JSDoc comments (`/** ... */`). Inline comments (`//`) are not allowed for type documentation. Property-level documentation should use JSDoc format directly above the property.
- Optional properties use `?:` syntax
- Array types use `Array<Type>` or `Type[]` syntax consistently
- **NEVER use inline types**: All types MUST be defined as named type definitions. Inline types in function parameters, return types, variable declarations, or anywhere else are FORBIDDEN. Types MUST be defined either:
  - At the top of the file (for file-local types)
  - In a `types.ts` file within the same directory (preferred for shared types)
  - Examples of FORBIDDEN inline types: `(param: { key: string }) => void`, `let data: { id: number }`, `fn: () => Promise<string>`
  - Examples of REQUIRED approach: Define `type ParamType = { key: string }` and use `(param: ParamType) => void`

## Constants
- Constants in separate `constants.ts` files when needed
- Use `export const CONFIG = { ... }` pattern
- Access environment variables directly: `String(process.env.DIAL_KEY)`
- Constants use UPPER_SNAKE_CASE for keys: `MODEL`, `API_VERSION`, `API_KEY`, `TEMPERATURE`

## Import Patterns
- Use ES modules exclusively
- Import from Node.js built-ins with `node:` prefix: `import { readFile } from 'node:fs/promises'`, `import { join } from 'node:path'`
- Import types: `import { Output } from './types'`
- Default imports: `import functionName from './function-name'`
- Group imports logically: built-ins first, then local imports
- Use explicit imports: `import { readFile } from 'node:fs/promises'` not `import * as fs from 'node:fs/promises'`

## Error Handling
- Throw `Error` with descriptive messages
- Use explicit error checking with `if...else` (no early returns)
- Error messages are clear and actionable: `'Either rootDir or specFilePaths must be provided'`
- Check for required values before use: `if (!systemPromptPath) { throw new Error('--systemPrompt is required'); }`
- Include context in error messages when helpful: `Could not find openspec binary in node_modules. Searched from ${rootDir} up to ${currentDir}`

## Async/Await Patterns
- Use `async/await` exclusively (no raw promises or callbacks)
- Use `Promise.all()` for parallel operations: `const [stdout, stderr] = await Promise.all([...])`
- Await all async operations explicitly
- Async functions always return `Promise<Type>`

## Variable Naming
- **NEVER use `let`**: The `let` keyword is FORBIDDEN. Always use `const` for all variable declarations.
- **Code MUST be pure and immutable**: Avoid mutations. Use immutable patterns:
  - Instead of reassigning variables, create new constants with descriptive names
  - Use functional patterns: `const updatedConfig = { ...currentConfig, accessToken: newToken }`
  - For loops that need iteration counters, use `Array.from()` with index, or refactor to use `Array.map()`, `Array.reduce()`, or other functional methods
  - If reassignment is truly necessary, refactor the code to avoid it (e.g., use recursion, array methods, or extract to separate functions)
- Variable names are descriptive and camelCase: `rootDir`, `specFilePaths`, `userPrompt`
- Boolean flags use `has` prefix: `hasRootDir`, `hasSpecFilePaths`
- Temporary variables use descriptive names: `originalArgv`, `tempDir`, `candidateBin`

## Conditional Logic
- **EARLY RETURNS ARE FORBIDDEN**: The early-return pattern is strictly forbidden. All `if` conditions must be clear, logical, and structured. Always use `if...else if...else` instead of early returns.
- Use descriptive boolean variables for conditions: `const hasRootDir = rootDir !== undefined;`
- Check conditions explicitly: `if (!hasRootDir && !hasSpecFilePaths) { ... }`
- Use nullish coalescing when appropriate: `rootDir ?? process.cwd()`
- All conditional branches must be explicit and complete - no shortcuts or guard clauses that return early

## File Operations
- Use `node:fs/promises` for async file operations: `readFile`, `writeFile`, `mkdir`, `rm`
- Use `node:path` utilities: `join`, `resolve`, `dirname`
- Trim content when reading: `content.trim()`
- Sort results when returning arrays: `return result.sort()`
- Use `withFileTypes: true` option for directory reading when needed

## Process Operations
- Use `Bun.spawn()` for subprocess execution
- Capture stdout and stderr separately
- Use `Promise.all()` for parallel stream reading: `const [stdout, stderr] = await Promise.all([...])`
- Check exit codes explicitly: `const exitCode = await proc.exited;`
- Use `Response` API for reading streams: `new Response(proc.stdout).text()`

## String Operations
- Use template literals for multi-line strings
- Use `.trim()` for whitespace handling
- Use `.split(',').map(path => path.trim())` for comma-separated values
- Use template literals for string interpolation: `` `${userPrompt}\n\n--- BEGIN SPECIFICATIONS ---` ``

## Naming Conventions
- Modules: PascalCase reflecting purpose (e.g., `ActivityGuardrails`)
- Interfaces: PascalCase, matching module names
- Files: kebab-case for function folders (e.g., `get-cli-args/`), lowercase for configs
- Functions: camelCase (e.g., `getCliArgs`, `validateSpecsWithAI`)
- Types: PascalCase (e.g., `ValidationResult`, `DialResponse`)
