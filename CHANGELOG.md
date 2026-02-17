# Changelog

All notable changes to this project will be documented in this file.
Please, document here only changes visible to the client app.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-02-17

### [27 Added Public API Endpoint for AI Image Generation Prompts](https://github.com/mrbalov/pace/issues/27)

### Added
- New `/strava/activities/*/image-generator/prompt` endpoint for generating AI image prompts from activity signals without authentication
- Base64-encoded signals support as query parameter for self-contained prompt generation
- Netlify function handler for the new prompt generation endpoint
- Signal validation and decoding with proper error responses for invalid inputs

## [2.0.0] - 2026-02-17

### [27 Improved Type Safety for Strava API Guardrails Validation](https://github.com/mrbalov/pace/issues/27)

### Changed
- **BREAKING**: Modified guardrails validation function signature in `StravaApiConfig` to accept strongly-typed `StravaActivity` instead of generic `Record<string, unknown>`, improving type safety and preventing runtime errors

### Removed
- Test file for fetch-activity module as part of testing strategy refactoring

## [1.12.1] - 2026-02-17

### [27 Fixed Activity Signals API Route Consistency and Enhanced Image Display](https://github.com/mrbalov/pace/issues/27)

### Added
- Image display component with download functionality in the image generation drawer
- Prettify signals utility for better formatting of activity signals in the UI display

### Changed
- Updated activity signals API endpoint from `/strava/activity/:id/signals` to `/strava/activities/:id/signals` for consistency with other activity endpoints
- Renamed server route handler file from `strava-activity.ts` to `strava-activity-signals.ts` for better semantic clarity
- Adjusted route matching priority in server to process activity signals before the generic activities route

### Fixed
- API route inconsistency that used singular "activity" instead of plural "activities" in the signals endpoint path

## [1.12.0] - 2026-02-17

### [27 Added Docker Configuration for Local Development and Production Deployment]](https://github.com/mrbalov/pace/issues/27)

### Added
- Multi-stage Dockerfile with optimized builds for both UI and server components using Node.js 24
- Production `docker-compose.yml` for orchestrating UI (Nginx) and server containers
- Development `docker-compose.dev.yml` with hot reloading support for both UI and server
- Helper script `docker-run.sh` for simplified Docker operations (build, start, stop, dev mode)
- Comprehensive `.dockerignore` file to exclude unnecessary files from Docker builds
- Docker environment configuration template `.env.example` with all required variables
- Complete Docker documentation in `DOCKER.md` with setup instructions and troubleshooting guide

### Changed
- Environment configuration now includes Docker-specific variables for container networking

## [1.11.0] - 2026-02-16

### [27 Added Strava Activity Signals View in Image Generation Interface](https://github.com/mrbalov/pace/issues/27)

### Added
- New `/strava/activity/:id/signals` API endpoint for fetching extracted activity signals
- Activity signals display component in the image generation drawer showing all extracted signals from the activity
- React hook `useStravaActivitySignalsData` for fetching and managing signals data state
- Netlify function handler for the new signals endpoint with proper authentication
- API client functions for fetching activity signals from the backend

### Changed
- Enhanced image generation drawer to display extracted activity signals before generating the image
- Refactored server routing logic to use if-else chain instead of nested ternary operators for better readability
- Updated image generation drawer to accept activity ID prop for fetching corresponding signals

## [1.10.1] - 2026-02-16

### [27 Refactored Image Generation Architecture and Improved Prompt Module Integration](https://github.com/mrbalov/pace/issues/27)

### Changed
- Refactored `activity-image-generator` package into two specialized packages for better separation of concerns:
  - `@pace/generate-strava-activity-image` - Dedicated to image generation with provider integrations
  - `@pace/get-strava-activity-image-generation-prompt` - Focused on prompt creation and validation
- Restructured activity signals into "core" and "derived" categories for clearer data flow
- Improved server route implementation to use new modular architecture
- Simplified prompt generation with default fallback support
- Enhanced forbidden content checking integration across all text processing

### Removed
- Deprecated `@pace/activity-image-generator` package (functionality split into specialized packages)
- Redundant test files from server package (strava-auth and strava-auth-callback tests)
- Duplicate prompt generation logic that was scattered across multiple modules

### Fixed
- Improved error handling in image generation pipeline with proper fallback to default prompts
- Consistent parameter passing for forbidden content checking across all signal extractors

## [1.10.0] - 2026-02-16

### [27 Added AI Image Generation Prompt Module and Enhanced Activity Signal Classification](https://github.com/mrbalov/pace/issues/27)

### Added
- New `@pace/get-strava-activity-image-generation-prompt` package for generating AI image prompts from Strava activity signals
- Prompt assembly module with style-specific quality keywords and character limit truncation
- Prompt validation module to ensure safe and appropriate content generation
- Mood classification for activities (Energetic, Contemplative, Triumphant, Peaceful, Focused)
- Style classification for image generation (Illustrated, Photographic, Cartoon, Abstract, Minimalist)
- Atmosphere classification based on activity context (Vibrant, Serene, Dramatic, Dynamic, Ethereal)
- Terrain classification (flat, rolling, hilly, mountainous) based on elevation data
- Environment classification (Urban, Rural, Trail, Indoor, Coastal, Mountain)
- Subject classification for image composition (athlete, landscape, activity-specific subjects)

### Changed
- Enhanced signal extraction in `@pace/get-strava-activity-signals` package with new classification modules
- Improved signal validation with expanded field validation for new classifiers
- Updated type definitions to include new signal classifications and derived signals
- Refactored signal extraction to support richer contextual data for image generation

### Fixed
- Renamed test file from `extract-tag.signals.test.ts` to `extract-tag-signals.test.ts` for consistency

## [1.9.1] - 2026-02-11

### [23 Refactored Activity Signals Usage and Extracted Shared Validation Components](https://github.com/mrbalov/pace/issues/23)

### Added
- New `@pace/check-forbidden-content` shared package for content validation across multiple packages
- Simplified `validate-prompt` module in activity-image-generator package

### Changed
- Refactored `activity-image-generator` package to use `@pace/get-strava-activity-signals` for signal extraction instead of internal implementation
- Moved forbidden content checking from multiple packages to shared `@pace/check-forbidden-content` package
- Improved separation of concerns with activity-image-generator now focused solely on prompt creation and image generation

### Removed
- Signal extraction modules from activity-image-generator package (moved to get-strava-activity-signals)
- Complex guardrails system from activity-image-generator package (replaced with simpler validation)
- Duplicate forbidden content checking implementations across packages

## [1.9.0] - 2026-02-11

### [23 Refactored Strava Activity Signals Package Structure and Added New Signal Extractors](https://github.com/mrbalov/pace/issues/23)

### Added
- Brand signals extraction module for detecting brand mentions in activity data
- Movement activity detection module to identify if an activity involves physical movement

### Changed
- Renamed package from `@pace/strava-activity-signals` to `@pace/get-strava-activity-signals` for better naming consistency
- Restructured package organization by moving signal extraction modules to package root level for flatter hierarchy
- Simplified module imports by eliminating nested directory structure

## [1.8.0] - 2026-02-11

### [23 Added Strava Activity Signals Extraction Package](https://github.com/mrbalov/pace/issues/23)

### Added
- New `@pace/strava-activity-signals` package for extracting semantic signals from Strava activity data
- Activity validation module to ensure data integrity before processing
- Intensity classification based on activity pace (Easy, Moderate, Hard, Threshold, Max Effort)
- Elevation classification based on total elevation gain (Flat, Rolling, Hilly, Mountainous)
- Time of day signal extraction from activity timestamps (Early Morning, Morning, Midday, Afternoon, Evening, Night)
- Tag extraction and normalization from activity metadata
- Semantic context extraction from activity name and description using NER techniques
- Forbidden content checking to filter inappropriate language
- Pace calculation utility converting speed to seconds per kilometer
- Text sanitization utility for cleaning and normalizing user input
- Comprehensive signal validation with sanitization fallbacks
- Full test coverage for all signal extraction modules (3689 lines of tests and implementation)

## [1.7.0] - 2026-02-10

### [28 Introduced Test-Driven Development (TDD) Enforcement and Enhanced Development Workflow](https://github.com/mrbalov/pace/issues/28)

### Added
- TDD skill documentation with comprehensive guidelines for test-first development approach
- TDD enforcement hooks that require test files to exist before implementation files are created
- Session line budget tracking (1000 lines per session) with automatic counter reset on new sessions
- Line budget verification hook (`tddLineBudget.sh`) that tracks code changes and enforces limits
- Session initialization hook (`initSession.sh`) that displays TDD workflow reminders and current line usage
- Quick reference documentation files for project conventions (`.claude/rules/project-conventions.md`) and OpenSpec workflow (`.claude/rules/openspec-workflow.md`)
- VSCode configuration with recommended extensions and format-on-save settings for TypeScript, JavaScript, and JSON files
- Test failure blocking in verification hooks to ensure tests pass before proceeding

### Changed
- Updated Claude Code settings to integrate TDD enforcement hooks with PreToolUse triggers on Edit and Write operations
- Modified startup hook from simple skip-acknowledgments message to session initialization with TDD reminders
- Enhanced verification hooks to block on test failures instead of just reporting them
- Simplified CLAUDE.md to reference external documentation files (@AGENTS.md and @openspec/project.md) for better maintainability
- Updated create-changelog skill to include ticket IDs in changelog entry titles and improved documentation formatting
- Applied Prettier formatting consistently across entire codebase (143 files) for uniform code style
- Enhanced GitHub Actions workflow with more descriptive job names identifying tools used (Bun Test Runner, ESLint, Prettier)

### Fixed
- Test enforcement now properly blocks file writes when tests fail
- Session line tracking properly handles null session IDs

## [1.6.1] - 2026-02-09

### [28 Added Prettier Code Formatting to Development Workflow](https://github.com/mrbalov/pace/issues/28)

### Added
- Prettier configuration (`.prettierrc`) for consistent code formatting across the monorepo
- Prettier ignore patterns (`.prettierignore`) to exclude unnecessary files from formatting
- Prettier formatting integration to the Claude Code development verification hook for automatic code formatting during development
- Husky git hooks for enforcing code quality checks before pushing:
  - Pre-push hook that runs ESLint linting and Prettier format checking before allowing pushes
- Husky package as a dev dependency with initialize script

### Changed
- Enhanced code verification hook to run Prettier check alongside ESLint for comprehensive code quality checks
- Applied Prettier formatting across the entire codebase for consistent style
- Updated VSCode settings to integrate Prettier formatting
- Refined ESLint configuration for better compatibility with Prettier
- Added "prepare" npm script to automatically initialize Husky hooks on installation

## [1.6.0] - 2026-02-09

### [28 Added Claude Code Development Hooks and Cleanup](https://github.com/mrbalov/pace/issues/28)

### Added
- Claude Code development hooks for enhanced workflow automation:
  - Dangerous command blocking hook to prevent accidental destructive operations
  - Event logging hook for debugging Claude Code interactions
  - Automatic code verification hook that runs ESLint fixes and tests on file changes
- Claude Code project settings configuration with pre/post tool use hooks

### Changed
- ESLint `no-console` rule severity from warning to error for stricter code quality
- TypeScript ESLint configuration with proper project root directory settings
- Code formatting in emoji constants from single to double quotes for consistency
- Test command simplified from `bun test ./packages` to `bun test packages`

### Removed
- Unused server image storage infrastructure including cleanup functions and storage module
- Netlify `/images/*` route redirect as image handling was removed

### Fixed
- Test file extension from `.tsx` to `.ts` for non-React component test file

## [1.5.2] - 2026-02-05

### Fixed OAuth Success Redirect to UI Origin

### Fixed
- OAuth success redirect now correctly uses the `UI_ORIGIN` environment variable instead of hardcoded root path, ensuring proper navigation after authentication

## [1.5.1] - 2026-02-05

### Refactored OAuth URL Parameter Cleanup Hook

### Fixed
- OAuth parameter cleanup not executing on first render due to incorrect React state usage in `useRemoveAuthUrlParameters` hook

### Changed
- Refactored `useRemoveAuthUrlParameters` hook into modular architecture with separate constants, utility function, and hook files for better maintainability
- Extracted authentication parameters ('code', 'state', 'scope') into dedicated constants file
- Moved URL manipulation logic from React hook into standalone `removeAuthParams` utility function

## [1.5.0] - 2026-02-05

### Comprehensive UI Refactoring and Enhanced Component Architecture

### Added
- Interactive `ActivityEmoji` component with animated sport emojis cycling through 100+ activity variations with skin tone support
- Footer component displaying project credits, powered-by services, and external links
- Custom `useTheme` hook for centralized theme state management and persistence
- Constants file consolidating all external links (GitHub, blog, services)
- Dedicated error and guest view components for ActivitiesPage
- Warning message in image generation drawer about AI limitations
- TypeScript type definitions file for shared types across the application

### Changed
- Refactored ActivitiesPage from monolithic 400+ line component into modular architecture with separate concerns (Activities, ActivitiesList, ImageGenerationDrawer)
- Restructured Header component into dedicated folder with ActivityEmoji integration in logo
- Updated App component to use Geist UI's Page component for proper layout structure with Header, Content, and Footer sections
- Enhanced ImageGenerationDrawer with improved component composition and user warnings about AI-generated content
- Migrated theme management from inline logic to centralized `useTheme` hook
- Simplified main.tsx entry point by extracting theme initialization logic
- Improved Preloader component API by renaming `fullHeight` prop to `withFullHeight` for clarity
- Reorganized HomePage components to use Grid layout for better responsive design

### Removed
- External link buttons from Header (moved to Footer for cleaner navigation)
- Inline theme management code from main.tsx (replaced with useTheme hook)
- Redundant activity type formatting logic (centralized to formatActivityType utility)

## [1.4.0] - 2026-02-03

### Enhanced Home Page Component Architecture and User Experience

### Added
- New `Deferred` component for smooth content transitions with configurable timeout
- Custom hook `useRemoveAuthUrlParameters` for OAuth parameter cleanup
- Separate `Guest` and `Member` view components for better code organization

### Changed
- Refactored HomePage into modular component architecture with dedicated folder structure
- Updated all UI components to use theme palette directly for better theme consistency
- Improved loading transitions using deferred rendering pattern
- Reduced button scale from 0.8 to 0.6 across Header and ThemeSwitcher for consistent sizing
- Enhanced Preloader and ActivitiesPage components with direct theme palette usage

## [1.3.0] - 2026-02-03

### Improved Home Page UX and Navigation

### Added
- External link buttons in header for GitHub repository and website
- Dedicated `server:dev` script for running the server in development mode
- Separate Guest and Member view components for better code organization

### Changed
- Redesigned home page with centered layout and improved visual hierarchy
- Enhanced header navigation with icon-only buttons for cleaner appearance
- Updated button styling with consistent scaling (0.8) and auto-sizing across all buttons
- Improved home page text styling with better color contrast and typography
- Simplified authentication flow presentation with distinct guest and member experiences

## [1.2.0] - 2026-02-03

### Refactored Provider API Key Management

### Changed
- Restructured provider API key handling from single `providerApiKey` parameter to `providerApiKeys` object for better extensibility
- Introduced `ImageGenerationProviderApiKeys` interface to define provider-specific API key structure
- Updated `getProvider()` to accept and pass structured API keys to providers
- Modified environment variable structure in `env.ts` to use nested `providerApiKeys` object instead of flat `pollinationsApiKey`
- Provider instances now receive only API keys relevant to their implementation

## [1.1.0] - 2026-02-03

### Enhanced Pollinations Provider Configuration and Authorization

### Added
- Optional API key support for Pollinations image generation provider via `POLLINATIONS_API_KEY` environment variable
- Bearer token authorization when API key is provided to Pollinations API
- New `env.ts` module to centralize environment variable management

### Changed
- Updated Pollinations API base URL from `https://image.pollinations.ai/prompt/` to `https://gen.pollinations.ai/image/`
- Relocated image dimension constants to provider-specific configuration in `pollinations/constants.ts`
- Simplified `getProvider` function to use default parameter instead of environment variable fallback logic
- Image generation pipeline now accepts optional `providerApiKey` parameter for authentication

## [1.0.0] - 2027-02-03

### Initial Release
