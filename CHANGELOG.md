# Changelog

All notable changes to this project will be documented in this file.
Please, document here only changes visible to the client app.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See the [Changelog Manual](https://kb.epam.com/display/VCTXDSE/14.+Frontastic+Development+-+Changelog) for more details.

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
