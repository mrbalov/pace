# Migration Design: SDD to OpenSpec

## Context
The project currently uses a self-grown Software Design Document (SDD) approach with a hierarchical level system (0-3). We're migrating to OpenSpec to leverage standardized tooling while preserving all existing requirements and architectural decisions.

## Goals / Non-Goals

### Goals
- Preserve all existing requirements and constraints from the SDD system
- Map the hierarchical level system to OpenSpec capabilities
- Maintain the same validation and guardrail principles
- Enable better tooling support through OpenSpec
- Keep the same behavioral specifications intact

### Non-Goals
- Changing any existing requirements or behaviors
- Modifying the core architecture
- Altering the validation rules
- Restructuring the service boundaries

## Decisions

### Decision: Capability Mapping
Each SDD level maps to an OpenSpec capability:
- Level 0 (Meta) → `meta` capability
- Level 1 (Guardrails) → `guardrails` capability
- Level 2 (Domain) → Individual domain capabilities (`prompt-generation`, etc.)
- Level 3 (Integration) → `system-architecture` capability

**Rationale**: OpenSpec uses capabilities instead of numbered levels, but we preserve the hierarchical relationships through dependencies.

### Decision: Requirement Format Conversion
Convert SDD's RFC 2119 keyword format to OpenSpec's requirement/scenario format:
- Each MUST/SHALL statement becomes a requirement
- Each validation rule becomes a scenario
- Preserve all RFC 2119 keywords within requirement text

**Rationale**: OpenSpec uses scenarios for testable specifications while SDD uses declarative statements. Scenarios make requirements more concrete and testable.

### Decision: Preserve Hierarchical Dependencies
Maintain the level-based dependency system within OpenSpec:
- Higher-level capabilities cannot depend on lower-level ones
- Explicit dependency declarations in each capability
- Validation ensures no circular dependencies

**Rationale**: The hierarchical system prevents architectural violations and maintains clear boundaries.

## Mapping Strategy

### SDD Structure → OpenSpec Structure

| SDD Component | OpenSpec Component | Notes |
|---------------|-------------------|-------|
| `specs/0-zero.spec.md` | `specs/meta/spec.md` | Meta-specification rules |
| `specs/1-guardrails.spec.md` | `specs/guardrails/spec.md` | Global constraints |
| `specs/2-prompt-generation.spec.md` | `specs/prompt-generation/spec.md` | Domain logic |
| `specs/3-system-architecture.spec.md` | `specs/system-architecture/spec.md` | Integration rules |
| Front matter | Removed | OpenSpec doesn't use front matter |
| RFC 2119 keywords | Preserved in text | Still used within requirements |
| Version numbers | Tracked via changes | OpenSpec manages versions differently |

### Requirement Transformation Pattern

**SDD Format:**
```markdown
Inputs **MUST** be semantically consistent.

Examples of invalid combinations:
- Running pace faster than realistic human limits
```

**OpenSpec Format:**
```markdown
### Requirement: Semantic Validation
Inputs SHALL be semantically consistent with realistic human performance limits.

#### Scenario: Realistic running pace
- **WHEN** running pace is within human limits
- **THEN** the pace is accepted as valid
```

## Risks / Trade-offs

### Risk: Loss of Specification Detail
**Mitigation**: Carefully review each requirement to ensure all details are preserved in scenarios.

### Risk: Dependency Confusion
**Mitigation**: Document the level mapping clearly and maintain the same dependency rules.

### Trade-off: Different Versioning Approach
OpenSpec uses change-based versioning rather than file-based versions. This provides better change tracking but requires adjustment to the workflow.

## Migration Plan

### Phase 1: Structure Creation
1. Create OpenSpec capability directories
2. Set up change proposal for migration
3. Create delta specs for each capability

### Phase 2: Content Migration
1. Transform each SDD spec to OpenSpec format
2. Convert rules to requirements with scenarios
3. Preserve all constraints and validations

### Phase 3: Validation
1. Run OpenSpec validation on all migrated specs
2. Verify no requirements were lost
3. Confirm dependency relationships preserved

### Phase 4: Cleanup
1. Archive original specs folder
2. Update documentation references
3. Commit migration changes

## Validation Checklist

- [ ] All Level 0 rules migrated to meta capability
- [ ] All Level 1 guardrails migrated to guardrails capability
- [ ] All Level 2 domain specs migrated to respective capabilities
- [ ] All Level 3 integration specs migrated to system-architecture
- [ ] Hierarchical dependencies preserved
- [ ] RFC 2119 keywords maintained
- [ ] All requirements have at least one scenario
- [ ] OpenSpec validation passes

## Open Questions
- Should we maintain the level numbers in capability names for clarity?
- How should we handle the specification validation rules that were in the separate folder?
- Should future specs follow the same hierarchical pattern?