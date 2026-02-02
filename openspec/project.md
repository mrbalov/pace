# Project Context

## Purpose

PACE (Personal Activity Canvas Engine) is an AI-powered Strava activity image generator that automatically transforms workout data into visually compelling, shareable images. The system analyzes Strava activity data and context to create personalized, expressive visuals for each activity, helping athletes present their performance and stories in a more engaging way.

### Key Goals

- Automatically generate AI images from Strava activity data
- Create safe, appropriate, and visually appealing content
- Provide athletes with shareable, personalized workout visuals
- Maintain strict content guardrails and safety measures

## Tech Stack
- **Runtime**: Bun (v1.3.6+) - Primary JavaScript/TypeScript runtime
- **Language**: TypeScript (v5.9.3) with strict mode enabled
- **Node Version**: 24.x (for compatibility when needed)
- **Package Manager**: Bun workspaces for monorepo structure
- **Testing**: Bun test (preferred over Jest)
- **Specification System**: OpenSpec (v0.20.0) for formal specifications
- **Build System**: Bun's built-in bundler
- **Module System**: ESNext modules (type: "module")

## Project Conventions

### Code Style

#### TypeScript Configuration
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled with `noImplicitAny`
- Bun types included

#### File Organization
- Each function has its own dedicated folder: `function-name/function-name.ts`, `function-name/index.ts`, `function-name/function-name.test.ts`
- Additional files when needed: `types.ts` for type definitions, `constants.ts` for constants
- Main entry files (CLI executables) use `#!/usr/bin/env bun` shebang at the top
- Test files are co-located with source files: `function-name/function-name.test.ts`

#### Function Organization
- Each function should have its own dedicated folder with the function file and an `index.ts` that exports the function as `export { default } from './function-name';`
- Main module `index.ts` re-exports functions: `export { default as functionName } from './submodule';`
- This pattern applies to all functions across the codebase

#### Function Definition Style
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

#### CLI Entry Points
- Use `#!/usr/bin/env bun` shebang at the top of CLI entry files
- Check `if (import.meta.main)` for CLI execution
- Use dynamic imports for CLI args: `const { default: getCliArgs } = await import('./get-cli-args');`
- Output JSON with `console.info(JSON.stringify(result, null, 2))`
- Include JSDoc comment: `/**\n * CLI entry point.\n */`
- Validate required arguments and throw descriptive errors

#### Type Definitions
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

#### Constants
- Constants in separate `constants.ts` files when needed
- Use `export const CONFIG = { ... }` pattern
- Access environment variables directly: `String(process.env.DIAL_KEY)`
- Constants use UPPER_SNAKE_CASE for keys: `MODEL`, `API_VERSION`, `API_KEY`, `TEMPERATURE`

#### Import Patterns
- Use ES modules exclusively
- Import from Node.js built-ins with `node:` prefix: `import { readFile } from 'node:fs/promises'`, `import { join } from 'node:path'`
- Import types: `import { Output } from './types'`
- Default imports: `import functionName from './function-name'`
- Group imports logically: built-ins first, then local imports
- Use explicit imports: `import { readFile } from 'node:fs/promises'` not `import * as fs from 'node:fs/promises'`

#### Error Handling
- Throw `Error` with descriptive messages
- Use explicit error checking with `if...else` (no early returns)
- Error messages are clear and actionable: `'Either rootDir or specFilePaths must be provided'`
- Check for required values before use: `if (!systemPromptPath) { throw new Error('--systemPrompt is required'); }`
- Include context in error messages when helpful: `Could not find openspec binary in node_modules. Searched from ${rootDir} up to ${currentDir}`

#### Async/Await Patterns
- Use `async/await` exclusively (no raw promises or callbacks)
- Use `Promise.all()` for parallel operations: `const [stdout, stderr] = await Promise.all([...])`
- Await all async operations explicitly
- Async functions always return `Promise<Type>`

#### Variable Naming
- **NEVER use `let`**: The `let` keyword is FORBIDDEN. Always use `const` for all variable declarations.
- **Code MUST be pure and immutable**: Avoid mutations. Use immutable patterns:
  - Instead of reassigning variables, create new constants with descriptive names
  - Use functional patterns: `const updatedConfig = { ...currentConfig, accessToken: newToken }`
  - For loops that need iteration counters, use `Array.from()` with index, or refactor to use `Array.map()`, `Array.reduce()`, or other functional methods
  - If reassignment is truly necessary, refactor the code to avoid it (e.g., use recursion, array methods, or extract to separate functions)
- Variable names are descriptive and camelCase: `rootDir`, `specFilePaths`, `userPrompt`
- Boolean flags use `has` prefix: `hasRootDir`, `hasSpecFilePaths`
- Temporary variables use descriptive names: `originalArgv`, `tempDir`, `candidateBin`

#### Conditional Logic
- **EARLY RETURNS ARE FORBIDDEN**: The early-return pattern is strictly forbidden. All `if` conditions must be clear, logical, and structured. Always use `if...else if...else` instead of early returns.
- Use descriptive boolean variables for conditions: `const hasRootDir = rootDir !== undefined;`
- Check conditions explicitly: `if (!hasRootDir && !hasSpecFilePaths) { ... }`
- Use nullish coalescing when appropriate: `rootDir ?? process.cwd()`
- All conditional branches must be explicit and complete - no shortcuts or guard clauses that return early

#### File Operations
- Use `node:fs/promises` for async file operations: `readFile`, `writeFile`, `mkdir`, `rm`
- Use `node:path` utilities: `join`, `resolve`, `dirname`
- Trim content when reading: `content.trim()`
- Sort results when returning arrays: `return result.sort()`
- Use `withFileTypes: true` option for directory reading when needed

#### Process Operations
- Use `Bun.spawn()` for subprocess execution
- Capture stdout and stderr separately
- Use `Promise.all()` for parallel stream reading: `const [stdout, stderr] = await Promise.all([...])`
- Check exit codes explicitly: `const exitCode = await proc.exited;`
- Use `Response` API for reading streams: `new Response(proc.stdout).text()`

#### String Operations
- Use template literals for multi-line strings
- Use `.trim()` for whitespace handling
- Use `.split(',').map(path => path.trim())` for comma-separated values
- Use template literals for string interpolation: `` `${userPrompt}\n\n--- BEGIN SPECIFICATIONS ---` ``

#### Naming Conventions
- Modules: PascalCase reflecting purpose (e.g., `ActivityGuardrails`)
- Interfaces: PascalCase, matching module names
- Files: kebab-case for function folders (e.g., `get-cli-args/`), lowercase for configs
- Functions: camelCase (e.g., `getCliArgs`, `validateSpecsWithAI`)
- Types: PascalCase (e.g., `ValidationResult`, `DialResponse`)

### Architectual Patterns
- **Modular Architecture**: Modules with clear boundaries
- **Dependency Injection**: Explicit dependencies injected into modules
- **Single Responsibility Principle**: Each module has one clear purpose
- **Interface-First Design**: Well-defined TypeScript interfaces for all modules
- **Specification-Driven Development**: Formal specs guide implementation
- **Guardrails Pattern**: Validation modules for activity and specs content safety

### Linting

#### ESLint Configuration

- **Linter**: ESLint 9+ with TypeScript and JSDoc plugins (flat config format)
- **Configuration**: `eslint.config.mjs` at project root (modern flat config)
- **Run linting**: `bun run lint` from root directory
- **Auto-fix issues**: `bun run lint:fix` from root directory
- **Enforced Rules**:
  - No `let` usage (always use `const`)
  - No nested functions
  - Explicit return types required
  - JSDoc comments required for all functions
  - Type annotations required
  - Prefer arrow functions
  - Node.js built-ins must use `node:` prefix
- **Limitations**: Some rules from project.md require manual review (see `LINTING.md` for details)
- **Code Quality Requirements**: See "Code Quality Requirements" section below for requirements about running tests and linter together after code changes

### Testing

#### Main Principles

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

#### Test File Rules

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

#### Test Execution Requirements

- **MUST run tests after code changes**: After making any code changes, ALL tests MUST be run and fixed in case of issues.
- **Test command**: Use `bun run test` from the root directory to run all tests across all packages.
- **Fix failing tests**: If any tests fail after code changes, they MUST be fixed before the changes are considered complete.
- **Test before committing**: Ensure all tests pass before committing code changes.

#### Code Quality Requirements

- **MUST run tests and linter after every code change**: After making any code changes, BOTH tests and linter MUST be run, results MUST be reviewed, and issues MUST be fixed.
- **Tests and linting MUST work in parallel**: Tests and linting MUST always pass together. Code changes are not complete until both tests pass AND linting passes.
- **Linter commands**:
  - Run linter: Use `bun run lint` from the root directory to check for linting errors
  - Fix linter issues: Prefer using `bun run lint:fix` command to auto-fix linting issues where possible
  - Manual fixes: For issues that cannot be auto-fixed, manually fix them according to the rules in `LINTING.md`
- **Review results**: Always review both test results and linting results to ensure code quality
- **Fix all issues**: All failing tests and linting errors MUST be fixed before the changes are considered complete
- **Before committing**: Ensure both all tests pass AND linting passes before committing code changes

### Git Workflow
- **Repository**: GitHub (github.com/mrbalov/pace)
- **Branch Strategy**: Feature branches with descriptive names
- **Commit Conventions**: Clear, descriptive commit messages
- **Code Review**: Required before merging to main
- **CI/CD**: GitHub Actions for automated testing and validation

### Bun-Specific Conventions
- Use `bun` instead of `node` for running files
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of npm/yarn/pnpm
- Use `bun run <script>` for package.json scripts
- Use `bunx` instead of `npx`
- Leverage Bun's built-in APIs (Bun.serve, Bun.file, etc.)
- Automatic .env loading (no dotenv needed)

## Domain Context

### Strava Integration
- **Webhook-based**: System triggered by Strava webhooks for new activities
- **Activity Data**: Fetches complete activity details via Strava API
- **Authentication**: OAuth2 for Strava API access

### AI Image Generation
- **Prompt-Based**: Converts activity data to text prompts
- **External API**: Uses third-party AI image generation services
- **Style Variety**: Supports multiple artistic styles and moods
- **Safety First**: All prompts validated through guardrails

### Modules
1. **Activity Guardrails**: Validates input, output, and intermediate contents to ensure the final system output follows system rules and principles
2. **Activity**: Strava API integration and data retrieval
3. **Activity Signals**: Semantic signal extraction from activity data
4. **Activity Prompt Generation**: AI prompt creation from signals
5. **Image Generation**: AI image generation management
6. **Specs Guardrails**: Specification validation and compliance enforcement

## Important Constraints

### Safety & Content
- **Strict Guardrails**: All content must pass safety validation
- **No PII**: No personal identifiable information in generated content
- **Family-Friendly**: All generated images must be appropriate for all audiences
- **Fallback Mechanisms**: Safe defaults for any validation failures

### Technical Constraints
- **Stateless Modules**: All modules designed for horizontal scaling
- **Rate Limiting**: Respect API rate limits for Strava and AI services
- **Error Resilience**: Failures in one module shouldn't cascade
- **Performance**: Quick response times for webhook processing

### Compliance Requirements
- **Specification Compliance**: Must adhere to all formal specifications
- **Validation**: Automated spec validation via specs-guardrails script
- **Documentation**: Comprehensive specs for all major components

## External Dependencies

### APIs & Services
- **Strava API**: Primary data source for activity information
- **AI Image Generation API**: External service for image creation (provider TBD)

### Development Tools
- **GitHub**: Version control and CI/CD
- **OpenSpec**: Specification validation and management
- **Bun Runtime**: JavaScript/TypeScript execution environment

### Future Integrations (Planned)
- Multiple AI model providers for image generation
- User preference management system
- Batch processing capabilities

## Guardrails

Guardrails are explicit constraints that ensure predictable, safe, and consistent behavior of AI-driven components. Guardrails are part of the system specification. Any behavior not allowed by guardrails is considered undefined and must be prevented or safely handled by the implementation.

These guardrails apply to the whole system. Code that violates these guardrails is considered incorrect, even if it appears to work.

The complete guardrails specification is availablehere:

- **[Activity Data Guardrails](openspec/specs/guardrails-activity-data/spec.md)**: Activity data validation, user-provided text processing, tag handling, and so on
- **[Image Generation Prompt Guardrails](openspec/specs/guardrails-image-generation-prompt/spec.md)**: Image generation prompt content rules and limits
- **[Image Generation Guardrails](openspec/specs/guardrails-image-generation/spec.md)**: Image style, output characteristics, retry/fallback strategies, failure handling, and determinism

## System Architecture

### Core Principles

1. **Single Responsibility**: Each module has one clear purpose.
2. **Loose Coupling**: Modules communicate through well-defined interfaces.
3. **High Cohesion**: Related functionality is grouped together.
4. **Dependency Injection**: Dependencies are explicit and injected.
5. **Testability**: Each module can be tested in isolation.
6. **Resilience**: Failures in one module don't cascade.

### User Journey

```mermaid
graph TD
    User[User]
    Strava[Strava]
    System[System]
        
    %% Data Flow and Dependencies
    User -->|1. Upload activity| Strava
    Strava -->|2. Trigger the image-generating system| System
    System -->|3. Provide user with an AI-generated image| User
    User -->|4. Upload an AI-generated image| Strava
    
    %% Styling
    classDef user fill:#fffccc,stroke:#ccc000,stroke-width:2px,color:#000
    classDef external fill:#ffcccc,stroke:#cc0000,stroke-width:2px,color:#000
    classDef core fill:#ccddff,stroke:#0066cc,stroke-width:2px,color:#000
    
    class User user
    class Strava external
    class System core
```

The system is designed as a modular architecture with clear separation of concerns and well-defined interfaces between components.

### Modules

1. **Activity Guardrails:** Validates input, output, and intermediate contents to ensure the final system output follows system rules and principles.
2. **Activity:** Manages Strava API integration and activity data retrieval.
3. **Activity Signals:** Extracts semantic signals from raw Strava activity data.
4. **Activity Prompt Generation:** Generates text prompts for image generation based on extracted Strava activity signals.
5. **Image Generation:** Generates Strava activity image based on the prompt derived from the activity data.
6. **Specs Guardrails:** Validates OpenSpec specifications to ensure compliance and prevent invalid behavior.

#### Module Dependency Graph

```mermaid
graph TD
    %% External Systems
    Strava[Strava]
    ImageGenAPI[External AI Image Generation API]
    
    %% Core Modules
    ActivityGuardrails[Activity Guardrails]
    Activity[Activity]
    ActivitySignals[Activity Signals]
    ActivityPromptGeneration[Activity Prompt Generation]
    ImageGeneration[Image Generation]
    
    %% Data Flow and Dependencies
    Strava -->|1. Provide an activity ID via a web hook| Activity
    Activity -->|2. Fetch full activity data by ID| Strava
    Activity -->|3. Validate raw activity data| ActivityGuardrails
    Activity -->|4. Raw activity data| ActivitySignals
    ActivitySignals -->|5. Validate extracted activity signals| ActivityGuardrails
    ActivitySignals -->|6. Extracted activity signals| ActivityPromptGeneration
    ActivityPromptGeneration -->|7. Validate prepared image generation prompt| ActivityGuardrails
    ActivityPromptGeneration -->|8. Image generation prompt| ImageGeneration
    ImageGeneration -->|9. API Request| ImageGenAPI
    
    %% Styling
    classDef external fill:#ffcccc,stroke:#cc0000,stroke-width:2px,color:#000
    classDef core fill:#ccddff,stroke:#0066cc,stroke-width:2px,color:#000
    classDef data fill:#ffffcc,stroke:#cccc00,stroke-width:1px,stroke-dasharray: 5 5
    
    class Strava,ImageGenAPI external
    class ActivityGuardrails,Activity,ActivitySignals,ActivityPromptGeneration,ImageGeneration core
```

#### Module Dependency Matrix

| Module                         | Direct Dependencies                            | Purpose of Dependency                    |
|--------------------------------|------------------------------------------------|------------------------------------------|
| **Activity Guardrails**        | None                                           | N/A                                      |
| **Activity**                   | 1. Activity Guardrails                         | 1. Content validation                    |
| **Activity Signals**           | 1. Activity Guardrails                         | 1. Signal validation                     |
| **Activity Prompt Generation** | 1. Activity Signals<br/>2. Activity Guardrails | 1. Signal input<br/>2. Prompt validation |
| **Image Generation**           | 1. Activity Prompt Generation                  | 2. Prompt source                         |
| **Specs Guardrails**           | None                                           | N/A                                      |

#### Activity Guardrails

**Purpose**: Validates input, output, and intermediate contents to ensure the final system output follows system rules and principles.

**Responsibilities**:
- Validate content against forbidden lists.
- Check for prohibited patterns.
- Sanitize user input and system output.
- Enforce compliance rules.
- Validate input, output, and intermediate contents.

**Dependencies**:
- None

**Interface**:
```typescript
interface ActivityGuardrails {
  validateActivity(activity: Activity): ValidationResult
  validateActivitySignals(signals: ActivitySignals): ValidationResult
  validateActivityImagePrompt(prompt: ActivityImagePrompt): ValidationResult
}
```

#### Activity

**Purpose**: Manages Strava API integration and activity data retrieval.

**Responsibilities**:
- Authenticate with Strava API.
- Fetch activity data.
- Transform API responses to internal format.

**Dependencies**:
- Activity Guardrails

**Interface**:
```typescript
interface Activity {
  fetchActivity(activityId: string): Promise<Activity>;
}
```

#### Activity Signals

**Purpose**: Extracts semantic signals from raw Strava activity data.

**Responsibilities**:
- Parse user-provided text safely.
- Extract activity signals from the Strava API response: subject, style, mood, scene, and others.

**Dependencies**:
- Activity Guardrails

**Interface**:
```typescript
interface ActivitySignals {
  getSignals(activity: Activity): Promise<ActivitySignals>;
}
```

#### Activity Prompt Generation

**Purpose**: Generates text prompts for image generation based on extracted Strava activity signals.

**Responsibilities**:
- Apply prompt generation rules.
- Select appropriate style.
- Compose scene descriptions.
- Validate prompt safety.

**Dependencies**:
- Activity Signals
- Activity Guardrails

**Interface**:
```typescript
interface ActivityPromptGeneration {
  generatePrompt(signals: ActivitySignals): ActivityImagePrompt
  getFallbackPrompt(): ActivityImagePrompt
}
```

#### Image Generation

**Purpose**: Generates Strava activity image based on the prompt derived from the activity data.

**Responsibilities**:
- Submit prompts to image generation API.
- Handle generation retries.
- Manage rate limiting.

**Dependencies**:
- Activity Prompt Generation

**Interface**:
```typescript
interface ImageGeneration {
  generateImage(prompt: ActivityImagePrompt): Promise<ActivityImage>
  regenerateWithFallback(prompt: ActivityImagePrompt): Promise<ActivityImage>
}
```

#### Specs Guardrails

**Purpose**: Protects specification contents from invalid behavior by validating OpenSpec specifications.

**Responsibilities**:
- Validate OpenSpec specifications using OpenSpec CLI.
- Validate OpenSpec specifications using AI-based validation.
- Ensure specification compliance with OpenSpec rules.
- Detect specification violations and inconsistencies.

**Dependencies**:
- OpenSpec CLI (external tool)
- AI external service (for AI-based validation)

**Interface**:
```typescript
interface SpecsGuardrails {
  validateSpecsWithAI(
    systemPrompt: string,
    userPrompt: string,
    rootDir?: string,
    specFilePaths?: string[]
  ): Promise<ValidationResult>
  validateSpecsWithOpenspec(rootDir: string): Promise<ValidationResult>
}
```

### Data Flow

#### Primary Flow: New Activity to AI Image Generation

1. **Input**: Activity ID from the Strava web hook.
2. **Activity**: Fetches activity from the Strava API.
3. **Activity Guardrails**: Validates raw activity data for safety.
4. **Activity Signals**: Extracts semantic signals from the raw Strava activity data.
5. **Activity Prompt Generation**: Creates image prompt based on extracted activity signals.
6. **Activity Guardrails**: Validates image prompt for safety.
7. **Image Generation**: Generates image using the prompt.
8. **Output**: Generated image URL is shared with the requestor.

#### Error Flow

1. Any module failure triggers error logging.
2. Fallback mechanisms activate for persistent failures.
3. System returns a safe default output.

### Testing Strategy

#### Unit Testing

- Each module **MUST** be tested in isolation.
- Mock dependencies are injected.
- 100% coverage for critical paths.
- Edge cases and error conditions.

#### Integration Testing

- Test module interactions.
- Verify data flow.
- Test error propagation.
- Validate contracts.

#### End-to-End Testing

- Complete flow validation.
- Failure scenario testing.

### Deployment Considerations

#### Module Packaging

- Each module as separate package.
- Clear version management.
- Dependency declaration.
- Build automation.

#### Configuration Management

- Environment-specific configs.
- Secret management.

#### Scalability

- Stateless module design.
- Horizontal scaling capability.
- Rate limiting.

### Future Extensions

The architecture supports future additions:
- New activity types.
- Additional image styles.
- Multiple AI model providers.
- User preferences.

## Core Functionality

The system operates as a **rule-based, deterministic pipeline** that:

1. **Ingests Strava activity data** via the [Strava API](https://developers.strava.com/).
2. **Extracts semantic signals** from activity metadata (type, distance, heart rate, elevation, tags, etc.).
3. **Generates text prompts** following strict safety and content guardrails
4. **Creates artistic images** using AI image generation models.
5. **Validates outputs** to ensure compliance with all system constraints.

### Strava Get Activity API

[The Strava Get Activity API is described in detail here.](https://developers.strava.com/docs/reference/#api-Activities-getActivityById) The endpoint returns the requested activity that is owned by the authenticated athlete. Requires `activity:read` for `Everyone` and `Followers` activities. Requires `activity:read_all` for `Only Me` activities. Review the Strava documentation periodically and update this section when Strava API changes are recognized.

```text
GET /activities/{activityId}
```

#### Parameters

- `id: string` - The identifier of the  Required.

#### Sample Response

```json
{
  "id" : 12345678987654321,
  "resource_state" : 3,
  "external_id" : "garmin_push_12345678987654321",
  "upload_id" : 98765432123456789,
  "athlete" : {
    "id" : 134815,
    "resource_state" : 1
  },
  "name" : "Happy Friday",
  "distance" : 28099,
  "moving_time" : 4207,
  "elapsed_time" : 4410,
  "total_elevation_gain" : 516,
  "type" : "Ride",
  "sport_type" : "MountainBikeRide",
  "start_date" : "2018-02-16T14:52:54Z",
  "start_date_local" : "2018-02-16T06:52:54Z",
  "timezone" : "(GMT-08:00) America/Los_Angeles",
  "utc_offset" : -28800,
  "start_latlng" : [ 37.83, -122.26 ],
  "end_latlng" : [ 37.83, -122.26 ],
  "achievement_count" : 0,
  "kudos_count" : 19,
  "comment_count" : 0,
  "athlete_count" : 1,
  "photo_count" : 0,
  "map" : {
    "id" : "a1410355832",
    "polyline" : "ki{eFvqfiVqAWQIGEEKAYJgBVqDJ{BHa@jAkNJw@Pw@V{APs@^aABQAOEQGKoJ_FuJkFqAo@{A}@sH{DiAs@Q]?WVy@`@oBt@_CB]KYMMkB{AQEI@WT{BlE{@zAQPI@ICsCqA_BcAeCmAaFmCqIoEcLeG}KcG}A}@cDaBiDsByAkAuBqBi@y@_@o@o@kB}BgIoA_EUkAMcACa@BeBBq@LaAJe@b@uA`@_AdBcD`@iAPq@RgALqAB{@EqAyAoOCy@AmCBmANqBLqAZkB\\iCPiBJwCCsASiCq@iD]eA]y@[i@w@mAa@i@k@g@kAw@i@Ya@Q]EWFMLa@~BYpAFNpA`Aj@n@X`@V`AHh@JfB@xAMvAGZGHIDIAWOEQNcC@sACYK[MSOMe@QKKKYOs@UYQISCQ?Q@WNo@r@OHGAGCKOQ_BU}@MQGG]Io@@c@FYNg@d@s@d@ODQAMOMaASs@_@a@SESAQDqBn@a@RO?KK?UBU\\kA@Y?WMo@Iy@GWQ_@WSSGg@AkABQB_Ap@_A^o@b@Q@o@IS@OHi@n@OFS?OI}@iAQMQGQC}@DOIIUK{@IUOMyBo@kASOKIQCa@L[|AgATWN[He@?QKw@FOPCh@Fx@l@TDLELKl@aAHIJEX@r@ZTDV@LENQVg@RkA@c@MeA?WFOPMf@Ej@Fj@@LGHKDM?_@_@iC?a@HKRIl@NT?FCHMFW?YEYGWQa@GYBiAIq@Gq@L_BHSHK|@WJETSLQZs@z@_A~@uA^U`@G\\CRB\\Tl@p@Th@JZ^bB`@lAHLXVLDP?LGFSKiDBo@d@wBVi@R]VYVE\\@`@Lh@Fh@CzAk@RSDQA]GYe@eAGWSiBAWBWBIJORK`@KPOPSTg@h@}Ad@o@F[E_@EGMKUGmAEYGMIMYKs@?a@J}@@_BD_@HQJMx@e@LKHKHWAo@UoAAWFmAH}@?w@C[YwAAc@HSNM|Ao@rA}@zAq@`@a@j@eAxAuBXQj@MXSR[b@gAFg@?YISOGaAHi@Xw@v@_@d@WRSFqARUHQJc@d@m@`A[VSFUBcAEU@WFULUPa@v@Y~@UrBc@dBI~@?l@P~ABt@N`HEjA]zAEp@@p@TrBCl@CTQb@k@dAg@jAU^KJYLK@k@A[Js@d@a@b@]RgBl@[FMAw@[]G]?m@D_@F]P[Vu@t@[TMF_@Do@E_@@q@P]PWZUZw@vAkAlAGJOj@IlAMd@OR{@p@a@d@sBpD]v@a@`Aa@n@]TODgBVk@Pe@^cBfBc@Rs@La@RSPm@|@wCpDS^Wp@QZML{@l@qBbCYd@k@lAIVCZBZNTr@`@RRHZANIZQPKDW@e@CaASU?I@YTKRQx@@\\VmALYRQLCL?v@P|@D\\GJEFKDM@OCa@COOYIGm@YMUCM@]JYr@uAx@kAt@}@jAeAPWbAkBj@s@bAiAz@oAj@m@VQlAc@VQ~@aA`Au@p@Q`AIv@MZORUV_@p@iB|AoCh@q@dAaANUNWH[N{AJ[^m@t@_Av@wA\\a@`@W`@In@Al@B^E`@Wl@u@\\[VQ\\K`@Eb@?R@dAZP@d@CRExAs@\\Yt@{@LG\\MjAATINOXo@d@kAl@_AHYBOCe@QiBCm@Fq@\\wADo@AyGEeBWuB@YHu@Tu@Lk@VcCTo@d@aA\\WJE`@G~@FP?VI\\U~@sANO`@SfAMj@U\\WjAsAXS`@UNENALBHFFL?^Ml@Uj@]b@q@RUJSPkChEc@XcAb@sA|@]PaA\\OJKNER?TDTNj@Jn@?p@OfC@ZR`B@VCV_@n@{@l@WbACv@OlABnAPl@LNNHbBBNBLFFJ@^GLg@x@i@|AMP[X}@XOJKPET?l@LhAFXp@fBDRCd@S\\_@Ps@PQ@}A]S?QDe@V]b@MR[fAKt@ErAF~CANILYDKGIKe@{@Yy@e@sB[gA[c@e@YUCU?WBUHUNQPq@`AiArAMV[^e@Zc@JQJKNMz@?r@Bb@PfAAfA@VVbADn@E`@KHSEe@SMAKDKFM\\^dDCh@m@LoAQ_@@MFOZLfBEl@QbASd@KLQBOAaAc@QAQ@QHc@v@ONMJOBOCg@c@]O[EMBKFGL?RHv@ARERGNe@h@{@h@WVGNDt@JLNFPFz@LdBf@f@PJNHPF`ADPJJJDl@I`@B^Tp@bALJNDNALIf@i@PGPCt@DNE`@Uv@[dAw@RITGRCtAARBPJLPJRZxB?VEX_@vAAR?RDNHJJBh@UnBm@h@IRDRJNNJPNbBFRJLLBLCzAmAd@Uf@Gf@?P@PFJNHPFTH`BDTHNJJJ@LG`@m@^YPER@RDPHNNJRLn@HRLN^VNPHTFX@\\UlDFb@FHh@NP@HKPsB?}ASkCQ{@[y@q@}@cA{@KOCQDa@t@{CFGJCf@Nl@ZtA~@r@p@`@h@rAxBd@rA\\fARdAPjANrB?f@AtBCd@QfBkAjJOlBChA?rBFrBNlBdAfKFzAC~@Iz@Mz@Sv@s@jBmAxBi@hAWt@Sv@Qx@O`BA`@?dAPfBVpAd@`BfBlFf@fBdA~Cr@pAz@fApBhBjAt@H?IL?FBFJLx@^lHvDvh@~XnElCbAd@pGhDbAb@nAr@`Ad@`GhDnBbAxCbBrWhNJJDPARGP_@t@Qh@]pAUtAoA`Ny@jJApBBNFLJFJBv@Hb@HBF?\\",
    "resource_state" : 3,
    "summary_polyline" : "ki{eFvqfiVsBmA`Feh@qg@iX`B}JeCcCqGjIq~@kf@cM{KeHeX`@_GdGkSeBiXtB}YuEkPwFyDeAzAe@pC~DfGc@bIOsGmCcEiD~@oBuEkFhBcBmDiEfAVuDiAuD}NnDaNiIlCyDD_CtJKv@wGhD]YyEzBo@g@uKxGmHpCGtEtI~AuLrHkAcAaIvEgH_EaDR_FpBuBg@sNxHqEtHgLoTpIiCzKNr[sB|Es\\`JyObYeMbGsMnPsAfDxAnD}DBu@bCx@{BbEEyAoD`AmChNoQzMoGhOwX|[yIzBeFKg[zAkIdU_LiHxK}HzEh@vM_BtBg@xGzDbCcF~GhArHaIfByAhLsDiJuC?_HbHd@nL_Cz@ZnEkDDy@hHwJLiCbIrNrIvN_EfAjDWlEnEiAfBxDlFkBfBtEfDaAzBvDKdFx@|@XgJmDsHhAgD`GfElEzOwBnYdBxXgGlSc@bGdHpW|HdJztBnhAgFxc@HnCvBdA"
  },
  "trainer" : false,
  "commute" : false,
  "manual" : false,
  "private" : false,
  "flagged" : false,
  "gear_id" : "b12345678987654321",
  "from_accepted_tag" : false,
  "average_speed" : 6.679,
  "max_speed" : 18.5,
  "average_cadence" : 78.5,
  "average_temp" : 4,
  "average_watts" : 185.5,
  "weighted_average_watts" : 230,
  "kilojoules" : 780.5,
  "device_watts" : true,
  "has_heartrate" : false,
  "max_watts" : 743,
  "elev_high" : 446.6,
  "elev_low" : 17.2,
  "pr_count" : 0,
  "total_photo_count" : 2,
  "has_kudoed" : false,
  "workout_type" : 10,
  "suffer_score" : null,
  "description" : "",
  "calories" : 870.2,
  "segment_efforts" : [ {
    "id" : 12345678987654321,
    "resource_state" : 2,
    "name" : "Tunnel Rd.",
    "activity" : {
      "id" : 12345678987654321,
      "resource_state" : 1
    },
    "athlete" : {
      "id" : 134815,
      "resource_state" : 1
    },
    "elapsed_time" : 2038,
    "moving_time" : 2038,
    "start_date" : "2018-02-16T14:56:25Z",
    "start_date_local" : "2018-02-16T06:56:25Z",
    "distance" : 9434.8,
    "start_index" : 211,
    "end_index" : 2246,
    "average_cadence" : 78.6,
    "device_watts" : true,
    "average_watts" : 237.6,
    "segment" : {
      "id" : 673683,
      "resource_state" : 2,
      "name" : "Tunnel Rd.",
      "activity_type" : "Ride",
      "distance" : 9220.7,
      "average_grade" : 4.2,
      "maximum_grade" : 25.8,
      "elevation_high" : 426.5,
      "elevation_low" : 43.4,
      "start_latlng" : [ 37.8346153, -122.2520872 ],
      "end_latlng" : [ 37.8476261, -122.2008944 ],
      "climb_category" : 3,
      "city" : "Oakland",
      "state" : "CA",
      "country" : "United States",
      "private" : false,
      "hazardous" : false,
      "starred" : false
    },
    "kom_rank" : null,
    "pr_rank" : null,
    "achievements" : [ ],
    "hidden" : false
  } ],
  "splits_metric" : [ {
    "distance" : 1001.5,
    "elapsed_time" : 141,
    "elevation_difference" : 4.4,
    "moving_time" : 141,
    "split" : 1,
    "average_speed" : 7.1,
    "pace_zone" : 0
  } ],
  "laps" : [ {
    "id" : 4479306946,
    "resource_state" : 2,
    "name" : "Lap 1",
    "activity" : {
      "id" : 1410355832,
      "resource_state" : 1
    },
    "athlete" : {
      "id" : 134815,
      "resource_state" : 1
    },
    "elapsed_time" : 1573,
    "moving_time" : 1569,
    "start_date" : "2018-02-16T14:52:54Z",
    "start_date_local" : "2018-02-16T06:52:54Z",
    "distance" : 8046.72,
    "start_index" : 0,
    "end_index" : 1570,
    "total_elevation_gain" : 276,
    "average_speed" : 5.12,
    "max_speed" : 9.5,
    "average_cadence" : 78.6,
    "device_watts" : true,
    "average_watts" : 233.1,
    "lap_index" : 1,
    "split" : 1
  } ],
  "gear" : {
    "id" : "b12345678987654321",
    "primary" : true,
    "name" : "Tarmac",
    "resource_state" : 2,
    "distance" : 32547610
  },
  "partner_brand_tag" : null,
  "photos" : {
    "primary" : {
      "id" : null,
      "unique_id" : "3FDGKL3-204E-4867-9E8D-89FC79EAAE17",
      "urls" : {
        "100" : "https://xxxxx.cloudfront.net/Bv93zv5t_mr57v0wXFbY_JyvtucgmU5Ym6N9z_bKeUI-128x96.jpg",
        "600" : "https://xxxxx.cloudfront.net/Bv93zv5t_mr57v0wXFbY_JyvtucgmU5Ym6N9z_bKeUI-768x576.jpg"
      },
      "source" : 1
    },
    "use_primary_photo" : true,
    "count" : 2
  },
  "highlighted_kudosers" : [ {
    "destination_url" : "strava://athletes/12345678987654321",
    "display_name" : "Marianne V.",
    "avatar_url" : "https://xxxxx.cloudfront.net/pictures/athletes/12345678987654321/12345678987654321/3/medium.jpg",
    "show_name" : true
  } ],
  "hide_from_home" : false,
  "device_name" : "Garmin Edge 1030",
  "embed_token" : "18e4615989b47dd4ff3dc711b0aa4502e4b311a9",
  "segment_leaderboard_opt_out" : false,
  "leaderboard_opt_out" : false
}
```

### Supported Activity Types

The system supports all Strava activity types including but not limited to:
- **Running**: Run, Trail Run, Virtual Run.
- **Cycling**: Ride, Virtual Ride, E-Bike Ride.
- **Water**: Swim, Surfing, Canoeing, Kayaking.
- **Winter**: Alpine Ski, Backcountry Ski, Nordic Ski, Snowboard.
- **Fitness**: Workout, Yoga, Weight Training, CrossFit.
- **Walking**: Walk, Hike.
- **Other**: Rock Climbing, Golf, Soccer, Tennis, and more.

### Visual Styles

The system generates images in four allowed artistic styles:
- **Cartoon**: Colorful, friendly illustrations.
- **Minimal**: Simple, clean designs.
- **Abstract**: Artistic, non-literal representations.
- **Illustrated**: Detailed, artistic renderings.

Photorealistic and hyper-detailed styles are explicitly forbidden to maintain artistic consistency and avoid uncanny valley effects.

### Image Characteristics

Generated images feature:
- **Aspect ratios**: `1:1` or `16:9`.
- **Subjects**: 1-3 primary visual elements.
- **No text elements**: Pure visual representation.
- **Neutral backgrounds**: Non-distracting, activity-focused.
- **Safe content**: Family-friendly, inclusive imagery.
- **Brands:** Allowed in a friendly and non-intrusive manner.

### Activity Signal Processing

The system processes multiple data points to create contextually appropriate images. The system MUST follow these principles:
- User text (activity names, descriptions, tags) undergoes semantic extraction.
- Only normalized, safe signals influence image generation.
- Brand names may be used contextually when originating from the activity data.

#### Intensity Classification

- **Low**: Recovery, easy, relaxed activities.
- **Medium**: Steady, focused, moderate efforts. 
- **High**: Intense, demanding, race-level activities.

#### Environmental Context

- **Elevation**: Flat, rolling, or mountainous terrain.
- **Time of day**: Morning freshness, daylight brightness, evening warmth, and night drama.
- **Weather**: When available, influences atmosphere and mood.
- **Location**: Country/region for appropriate scenery.

#### Semantic Tags

Strava tags influence mood and scene composition:
- `recovery` → Calm, gentle atmosphere.
- `race` → Competitive, intense energy.
- `with kid` → Playful, family-friendly scenes.
- `long run` → Endurance-focused imagery.
- `commute` → Urban, routine settings.
- And others provided by Strava.

### Activity Prompt Generation Pipeline

1. **Input Validation**: Ensure required fields are present.
2. **Signal Extraction**: Process user text safely.
3. **Classification**: Determine activity type, intensity, environment, and other characteristics.
4. **Style Selection**: Choose appropriate visual style deterministically.
5. **Mood Mapping**: Align emotional tone with activity characteristics.
6. **Scene Composition**: Build environment and atmosphere.
7. **Prompt Assembly**: Construct text prompt (≤ 600  characters).
8. **Validation**: Ensure compliance with all guardrails.
9. **Fallback**: Use safe defaults if validation fails.

### Error Handling and Resilience

The system implements multiple layers of resilience:
- **Retry logic**: Maximum 2 retries with prompt simplification.
- **Fallback prompts**: Safe, minimal defaults when generation fails.
- **Graceful degradation**: Prefer partial success over complete failure.
- **Silent failures**: User-facing errors are handled gracefully.
- **Always valid output**: System never returns empty or corrupted results.

### Determinism and Predictability

- Given identical inputs, the system **MUST** produce identical classification and style decisions.
- Randomness is bounded and controlled.
- Behavior is predictable and reproducible.

### Safety First

- All content **MUST** pass through multiple layers of guardrails.
- User-provided text is never copied verbatim into prompts.
- Forbidden content (real persons, political symbols, violence, etc.) is strictly prohibited.
- Fallback mechanisms ensure the system always produces valid, safe outputs.
