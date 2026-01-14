# Change: Complete Migration from Self-Grown SDD to OpenSpec

## Why
The project has partially migrated from a self-grown SDD format to OpenSpec. The migration needs to be completed to ensure consistency and leverage OpenSpec's validation and management capabilities.

## What Changes
- Migrate remaining specifications from `/specs` to OpenSpec format
- Map existing zero specification to meta capability in OpenSpec
- Map existing guardrails specification to guardrails capability in OpenSpec  
- Map existing prompt-generation specification to prompt-generation capability in OpenSpec
- Map existing system-architecture specification to system-architecture capability in OpenSpec
- Preserve all existing requirements and scenarios while adapting to OpenSpec format

## Impact
- Affected specs: meta, guardrails, prompt-generation, system-architecture
- Affected code: None (documentation-only change)
- Benefits: Unified specification system, automated validation, better change management