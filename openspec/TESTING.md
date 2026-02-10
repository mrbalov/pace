# Testing

## Main Principles

- **Test Runner**: Bun test (not Jest, despite jest.config.js presence)
- **Coverage Requirements**: 
  - Minimum 80% coverage for all metrics (branches, functions, lines, statements)
  - 100% coverage for critical paths
- **Test Types**:
  - Unit tests for each module in isolation
  - Integration tests for module interactions
  - End-to-end tests for complete flows
- **Test Location**: Tests alongside source files
- **Mocking**: Dependency injection for easy mocking

## Test File Rules

- Wrap every test suit with `describe('entity-name', () => {...});` block.
- Arrange test case type as `type Case = [...]` at the test file root.
- Use `test.each<Case>([...])(...)` test style.
- Provide a code-agnostic and business-user-friendly test case name.
- Always split arrays and objects to be multiline for better readability.
- Use the test function according to the following approach: `(_name, ...) => {...}`.
- Use the following test case name template: `%#. %s`.
- For verifying object responses, use `.toStrictEqual(...)` instead of `.toBe(...)`.
- Use business-friendly names for test cases and avoid using complex technical words and variable names.
- Use names for test cases based on behavior rather than implementation details.
- When possible, avoid using mocks to make sure system components interact correctly.

## Test Execution Requirements

- **MUST run tests after code changes**: After making any code changes, ALL tests MUST be run and fixed in case of issues.
- **Test command**: Use `bun run test` from the root directory to run all tests across all packages.
- **Fix failing tests**: If any tests fail after code changes, they MUST be fixed before the changes are considered complete.
- **Test before committing**: Ensure all tests pass before committing code changes.

## Code Quality Requirements

- **MUST run tests and linter after every code change**: After making any code changes, BOTH tests and linter MUST be run, results MUST be reviewed, and issues MUST be fixed.
- **Tests and linting MUST work in parallel**: Tests and linting MUST always pass together. Code changes are not complete until both tests pass AND linting passes.
- **Linter commands**:
  - Run linter: Use `bun run lint` from the root directory to check for linting errors
  - Fix linter issues: Prefer using `bun run lint:fix` command to auto-fix linting issues where possible
  - Manual fixes: For issues that cannot be auto-fixed, manually fix them according to the rules in [LINTING.md](./LINTING.md)
- **Review results**: Always review both test results and linting results to ensure code quality
- **Fix all issues**: All failing tests and linting errors MUST be fixed before the changes are considered complete
- **Before committing**: Ensure both all tests pass AND linting passes before committing code changes
