# Linting Guide

This project uses ESLint to enforce code quality and consistency rules defined in `project.md`.

## Quick Start

### Install Dependencies

```bash
bun install
```

### Run Linting

```bash
# Check for linting errors
bun run lint

# Auto-fix issues where possible
bun run lint:fix
```

## Enforced Rules

The ESLint configuration enforces the following key rules from `project.md`:

### ✅ Fully Automated

1. **No `let` usage**: The `let` keyword is completely forbidden. Always use `const`. Enforced via `no-restricted-syntax` rule.
2. **Prefer `const`**: Enforced via `prefer-const` rule.
3. **No nested functions**: All functions must be defined at the top level of the file. Enforced via `no-inner-declarations` rule and `no-restricted-syntax` for nested arrow functions.
4. **Explicit return types**: All functions must have explicit return type annotations. Enforced via `@typescript-eslint/explicit-function-return-type`.
5. **Type annotations**: All variables, parameters, and properties must have type annotations. Enforced via `@typescript-eslint/typedef`.
6. **JSDoc requirements**: All functions must have complete JSDoc comments with:
   - Description
   - `@param` tags with types and descriptions
   - `@returns` tag with type and description
   - Enforced via `jsdoc/require-jsdoc` and related rules.
7. **Arrow functions**: Prefer arrow function syntax. Enforced via `prefer-arrow-callback` and `arrow-body-style`.
8. **Node.js imports**: Must use `node:` prefix for Node.js built-ins. Enforced via `no-restricted-imports`.

### ⚠️ Partially Automated

Some rules require manual review:

1. **No nested arrow functions**: The `no-restricted-syntax` rule attempts to catch nested arrow functions, but this may not catch all cases. Manual review is recommended.

2. **No inline types**: While `@typescript-eslint/typedef` enforces type annotations, it doesn't prevent inline object types in function parameters. This requires manual code review or a custom ESLint rule.

   Examples that may not be caught:
   - `(param: { key: string }) => void` - inline object type
   - `fn: () => Promise<string>` - inline function type in type definition

3. **No early returns**: The project requires explicit `if...else if...else` patterns, but ESLint's `consistent-return` and `no-else-return` rules conflict with this requirement. Manual review is needed.

4. **Pure/immutable code patterns**: While we ban `let`, ensuring code is truly immutable (no mutations) requires manual review.

### 📝 Manual Review Required

The following rules from `project.md` require manual code review as they cannot be fully automated:

1. **JSDoc completeness**: While ESLint enforces JSDoc presence and basic structure, ensuring all required tags (`@throws`, `@see`, `@example`, `@internal`, `@template`) are present requires manual review.

2. **Type naming conventions**: Module-scoped type prefixes (e.g., `ActivityConfig`) cannot be automatically enforced and require manual review.

## Configuration Files

- **`eslint.config.mjs`**: Main ESLint configuration (flat config format - ESLint 9+)

## Test Files

Test files (`.test.ts`) have relaxed rules:
- JSDoc comments are not required
- `any` types are allowed
- `let` usage is allowed (for test setup)
- `no-restricted-syntax` is disabled

## Integration with CI/CD

The linting should be run as part of your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run linter
  run: bun run lint
```

## Pre-commit Hook

Consider setting up a pre-commit hook to run linting automatically:

```bash
# Using husky (if installed)
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "bun run lint"
```

## Troubleshooting

### Common Issues

1. **"Object.hasOwn is not a function" or "ESLint flat config requires ESLint 9+"**
   - **Root cause**: ESLint 9+ requires Node.js 18+ (Object.hasOwn was added in Node.js 16.9+)
   - **Solution**: Use Node.js 18+ or higher. The project specifies Node.js 24.x in `package.json` engines.
   - **Check Node version**: Run `node --version` - should show v18.x, v20.x, v22.x, or v24.x
   - **If using nvm**: Run `nvm use 24` or `nvm install 24` to switch to Node.js 24
   - **Alternative**: Use `bunx eslint packages` which may work with Bun's Node.js compatibility

2. **"Cannot find module 'typescript-eslint'"**
   - Run `bun install` to install dependencies
   - Ensure you have ESLint 9+ and typescript-eslint 8+ installed

3. **"Parsing error: Cannot read tsconfig.json"**
   - Ensure `tsconfig.json` exists in the project root
   - Check that the path in `eslint.config.mjs` is correct

4. **Too many errors after enabling linting**
   - Run `bun run lint:fix` to auto-fix many issues
   - Review the "Partially Automated" and "Manual Review Required" sections above for rules that may need adjustment

### Disabling Rules

If you need to disable a rule for a specific line or block:

```typescript
// eslint-disable-next-line no-restricted-syntax
const example = () => undefined;

// eslint-disable-block no-restricted-syntax
// ... code ...
// eslint-enable no-restricted-syntax
```

**Note**: Disabling rules should be rare and require justification. Prefer fixing the code to match the rules.

## Future Improvements

Consider creating custom ESLint rules for:
1. Detecting inline object/function types in parameters
2. Enforcing no early returns pattern
3. Validating type naming conventions with module prefixes
4. Ensuring complete JSDoc tag coverage (all required tags: `@throws`, `@see`, `@example`, `@internal`, `@template`)
