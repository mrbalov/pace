# Specs Validation with AI

## Purpose

Define requirements for AI-based validation of OpenSpec specifications to ensure deterministic, rule-bound, and auditable validation processes.

## Requirements

### Requirement: AI Validation Determinism

An AI validator SHALL produce identical output for identical inputs. An AI validator SHALL NOT depend on execution order, use randomness, or use probabilistic interpretation.

#### Scenario: Identical inputs produce identical outputs
- **GIVEN** identical specification inputs
- **WHEN** validation is performed
- **THEN** the validator SHALL produce identical output

#### Scenario: No execution order dependency
- **GIVEN** specifications provided in different orders
- **WHEN** validation is performed
- **THEN** the validator SHALL produce identical results regardless of order

#### Scenario: No randomness in validation
- **GIVEN** a validation process
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT introduce randomness

### Requirement: AI Validation Rule-Bound Behavior

An AI validator SHALL validate specifications strictly against OpenSpec rules. An AI validator SHALL treat specifications as static text. An AI validator SHALL NOT infer unstated intent, invent rules, or assume correctness.

#### Scenario: Validation against OpenSpec rules
- **GIVEN** specifications to validate
- **WHEN** validation is performed
- **THEN** the validator SHALL validate strictly against OpenSpec rules

#### Scenario: Specifications treated as static text
- **GIVEN** specification content
- **WHEN** validation is performed
- **THEN** the validator SHALL treat specifications as authoritative, static text

#### Scenario: No intent inference
- **GIVEN** a specification with ambiguous or incomplete content
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT infer unstated intent

#### Scenario: No rule invention
- **GIVEN** a specification that doesn't explicitly state a rule
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT invent rules

### Requirement: AI Validation Prohibited Behaviors

An AI validator SHALL NOT suggest fixes, propose implementations, rewrite specifications, or introduce new rules.

#### Scenario: No fix suggestions
- **GIVEN** a validation that identifies violations
- **WHEN** validation output is produced
- **THEN** the validator SHALL NOT suggest fixes

#### Scenario: No implementation proposals
- **GIVEN** a validation process
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT propose implementations

#### Scenario: No specification rewriting
- **GIVEN** specifications with violations
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT rewrite specifications

### Requirement: OpenSpec Format Compliance

The validator SHALL validate that specifications follow OpenSpec format requirements. Specifications SHALL contain Requirements sections with Requirement headers. Each Requirement SHALL have at least one Scenario. Scenarios SHALL use the proper format with GIVEN/WHEN/THEN structure.

#### Scenario: Requirements section present
- **GIVEN** a specification file
- **WHEN** validating format compliance
- **THEN** the specification SHALL contain a Requirements section

#### Scenario: Requirement headers present
- **GIVEN** a specification file
- **WHEN** validating format compliance
- **THEN** requirements SHALL use ### Requirement: headers

#### Scenario: Scenarios present for requirements
- **GIVEN** a requirement in a specification
- **WHEN** validating format compliance
- **THEN** the requirement SHALL have at least one scenario

#### Scenario: Scenario format compliance
- **GIVEN** a scenario in a specification
- **WHEN** validating format compliance
- **THEN** the scenario SHALL use #### Scenario: header and GIVEN/WHEN/THEN structure

### Requirement: Cross-Spec Compatibility Validation

The validator SHALL detect rule conflicts, rule shadowing, rule duplication, and behavioral overlaps between specifications.

#### Scenario: Rule conflict detection
- **GIVEN** multiple specifications with conflicting rules
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report conflicts

#### Scenario: Rule shadowing detection
- **GIVEN** specifications that redefine existing rules under different names
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report shadowing

#### Scenario: Rule duplication detection
- **GIVEN** specifications with semantically equivalent rules
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report duplication

#### Scenario: Behavioral overlap detection
- **GIVEN** multiple specifications affecting the same behavior
- **WHEN** validation is performed
- **THEN** the validator SHALL verify ownership is explicit and one spec is authoritative

### Requirement: Cross-Spec Constraint Validation

The validator SHALL verify that specifications do not contradict each other, weaken requirements, or introduce unauthorized exceptions.

#### Scenario: Contradiction detection
- **GIVEN** specifications with contradictory requirements
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report contradictions

#### Scenario: Requirement weakening detection
- **GIVEN** a specification that weakens a requirement from another specification
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report weakening

#### Scenario: Unauthorized exception detection
- **GIVEN** a specification that introduces exceptions without authorization
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report unauthorized exceptions

### Requirement: Global Determinism Validation

The validator SHALL verify that combined application of all specifications results in deterministic outcomes, no conflicting randomness sources, and no order-dependent interpretation.

#### Scenario: Deterministic outcome verification
- **GIVEN** a complete set of specifications
- **WHEN** validating global determinism
- **THEN** the validator SHALL verify combined application results in deterministic outcomes

#### Scenario: Randomness source conflict detection
- **GIVEN** specifications that introduce conflicting randomness sources
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report conflicts

#### Scenario: Order dependency detection
- **GIVEN** specifications with order-dependent interpretation
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report order dependencies

### Requirement: Validation AI Prompts

The validator SHALL use canonical AI prompts defined for specification validation. The system prompt SHALL instruct the AI to act as a formal specification validation engine that validates specifications against OpenSpec rules. The user prompt SHALL provide instructions for validating a complete set of specifications and the expected output format.

The canonical system prompt SHALL be:

```
You are a formal specification validation engine.

Your task is to validate a **COMPLETE SET** of provided specifications as a single system.

You **MUST** comply with:
- The OpenSpec rules

You **MUST** treat all specifications as authoritative, static text.
You **MUST NOT** assume intent.
You **MUST NOT** invent rules.
You **MUST NOT** infer missing behavior.
You **MUST NOT** suggest fixes or improvements.

You **MUST** validate:
- Each specification individually
- The combined behavior of all provided specifications together

You **MUST** apply:
- All general checks
- All cross-spec compatibility checks

You **MUST** detect:
- OpenSpec rule violations
- Cross-level conflicts
- Rule shadowing
- Rule duplication
- Constraint violations
- Non-determinism introduced by combination

You **MUST** produce deterministic output.
Identical inputs **MUST** result in identical output.

You **MUST** output **ONLY** valid JSON. No prose. No markdown. No explanations.
```

The canonical user prompt SHALL be:

```
Validate the following complete specification set.

This input represents the **SUBSET** of specifications.
All provided specifications **MUST** be validated together as a system.

Instructions:
- Validate every specification against the OpenSpec
- Validate cross-spec interactions and conflicts
- Determine a single global validation result

If **ANY** mandatory check fails → result **MUST** be **INVALID**.

Return a **SINGLE** validation result using this contract:

{
  "result": "VALID | INVALID",
  "violations": [
    {
      "spec_id": "<id or null if global>",
      "rule": "<meta rule reference>",
      "description": "<precise, mechanical description>"
    }
  ],
  "notes": []
}

Now validate the following specifications:
```

#### Scenario: System prompt usage
- **GIVEN** a validation process is initiated
- **WHEN** configuring the AI validator
- **THEN** the system prompt SHALL instruct the AI to act as a formal specification validation engine

#### Scenario: System prompt content
- **GIVEN** the system prompt
- **WHEN** examining the prompt content
- **THEN** the prompt SHALL specify compliance with OpenSpec rules, treating specifications as static text, and prohibiting intent inference

#### Scenario: User prompt usage
- **GIVEN** specifications to validate
- **WHEN** constructing the validation request
- **THEN** the user prompt SHALL provide instructions for validating the complete specification set

#### Scenario: User prompt output format
- **GIVEN** the user prompt
- **WHEN** examining the prompt content
- **THEN** the prompt SHALL specify the expected JSON output format with result and violations fields

#### Scenario: Prompt determinism
- **GIVEN** identical specifications
- **WHEN** using the canonical prompts
- **THEN** the prompts SHALL ensure deterministic validation output

### Requirement: Validation Output Contract

The validator SHALL produce output in a defined JSON format. The output SHALL include a validation result, violations array, and optional notes. The result SHALL be VALID or INVALID.

#### Scenario: JSON output format
- **GIVEN** a validation process completes
- **WHEN** output is produced
- **THEN** the output SHALL be valid JSON

#### Scenario: Result field present
- **GIVEN** validation output
- **WHEN** examining the output
- **THEN** the output SHALL contain a result field with value VALID or INVALID

#### Scenario: Violations array present
- **GIVEN** validation output
- **WHEN** examining the output
- **THEN** the output SHALL contain a violations array

#### Scenario: Violation structure
- **GIVEN** a violation in the output
- **WHEN** examining the violation
- **THEN** the violation SHALL contain spec_id, rule, and description fields

### Requirement: Validation Process Scope

The validator SHALL validate each specification individually and the combined behavior of all specifications together. The validator SHALL validate a complete set of specifications as a single system.

#### Scenario: Individual specification validation
- **GIVEN** a set of specifications
- **WHEN** validation is performed
- **THEN** each specification SHALL be validated individually

#### Scenario: Combined system validation
- **GIVEN** a set of specifications
- **WHEN** validation is performed
- **THEN** the combined behavior of all specifications SHALL be validated together

#### Scenario: Complete set validation
- **GIVEN** a complete set of specifications
- **WHEN** validation is performed
- **THEN** all specifications SHALL be validated together as a single system

### Requirement: Validation Failure Handling

If validation cannot be completed due to incomplete or inconsistent inputs, the validator SHALL return INVALID result with appropriate violation description.

#### Scenario: Incomplete input handling
- **GIVEN** incomplete specification inputs
- **WHEN** validation is attempted
- **THEN** the validator SHALL return INVALID result with violation describing incomplete inputs

#### Scenario: Inconsistent input handling
- **GIVEN** inconsistent specification inputs
- **WHEN** validation is attempted
- **THEN** the validator SHALL return INVALID result with violation describing inconsistency
