# Change: Migrate existing SDD specifications to OpenSpec format

## Why
The project currently uses a self-grown Software Design Document (SDD) approach with a multi-level specification architecture. We need to migrate to OpenSpec to benefit from standardized tooling, validation, and better maintainability while preserving all existing requirements and architectural decisions.

## What Changes
- **ADDED**: Meta specification capability defining how specifications are structured
- **ADDED**: Guardrails capability for global safety and content constraints  
- **ADDED**: Prompt generation capability for AI prompt creation from Strava activities
- **ADDED**: System architecture capability defining modular service architecture
- Migrate all existing requirements from `/specs` folder to OpenSpec format
- Preserve the hierarchical level system (0-3) within OpenSpec structure
- Map RFC 2119 keywords usage to OpenSpec conventions
- Note: Specification validation rules from `/specs/specification-validation/` are replaced by OpenSpec's built-in validation tooling

## Impact
- Affected specs: All existing specifications (0-zero, 1-guardrails, 2-prompt-generation, 3-system-architecture)
- Affected code: No immediate code changes, but future development will follow OpenSpec patterns
- Migration path: One-time migration preserving all existing requirements
- Benefits: Standardized validation, better tooling support, clearer change management
- Validation: OpenSpec's built-in validation replaces the manual validation checklists