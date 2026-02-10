# Project Conventions

See @openspec/project.md for the complete project conventions.

## Quick Reference

**Critical Rules from project.md:**
- NEVER use `let` - always use `const` 
- Arrow functions only: `const fn = () => {}`
- JSDoc required for ALL functions
- No nested functions - top level only
- No early returns - use `if...else` chains
- Module-scoped types with prefixes
- Run `bun run test` and `bun run lint` after changes
