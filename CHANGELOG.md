# Changelog

All notable changes to this project will be documented in this file.
Please, document here only changes visible to the client app.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

See the [Changelog Manual](https://kb.epam.com/display/VCTXDSE/14.+Frontastic+Development+-+Changelog) for more details.

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
