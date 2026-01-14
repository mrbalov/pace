# Guardrails Specification

## Purpose
This capability defines the global guardrails for PACE. Guardrails are explicit constraints that ensure predictable, safe, and consistent behavior of AI-driven components.

Guardrails are part of the system specification. Any behavior not allowed by this document is considered undefined and must be prevented or safely handled by the implementation.

## Scope
These guardrails apply to:
- Activity ingestion
- Prompt generation
- Image generation
- Output validation
- Failure and fallback behavior

## Requirements

### Requirement: Required Activity Fields
An activity input MUST contain required fields and MAY contain optional fields. All fields MUST be properly validated.

#### Scenario: Valid activity with required fields
- **WHEN** an activity is submitted with `type` and `sport_type` fields
- **THEN** the activity is accepted for processing

#### Scenario: Missing required fields
- **WHEN** an activity is submitted without `type` and/or `sport_type` field(s)
- **THEN** the activity MUST be rejected
- **AND** an appropriate error is returned

#### Scenario: Optional fields present
- **WHEN** an activity includes optional fields like `distance`, `avg_hr`, `pace`, and others
- **THEN** these fields MAY be used if present
- **AND** their absence MUST NOT be treated as an error

### Requirement: Value Constraints
Input values MUST satisfy defined constraints when present.

#### Scenario: Valid value ranges
- **WHEN** an activity has `distance` field
- **THEN** it MUST be greater than 0
- **AND** `avg_hr` if present MUST be between 40 and 220
- **AND** `pace` if present MUST be greater than 0
- **AND** `elevation_gain` if present MUST be greater than or equal to 0

#### Scenario: Out-of-range values
- **WHEN** values are outside allowed ranges
- **THEN** they MUST be clamped, normalized, or replaced with `unknown`
- **AND** processing continues with safe values

### Requirement: Semantic Validation
Inputs MUST be semantically consistent with activity type.

#### Scenario: Consistent activity data
- **WHEN** activity data is semantically valid
- **THEN** processing continues normally

#### Scenario: Inconsistent combinations
- **WHEN** semantic validation fails (e.g., unrealistic running pace)
- **THEN** the system SHOULD prefer graceful degradation
- **AND** avoid hard failure when possible

### Requirement: User-Provided Text Processing
The system MUST safely process user-provided text from activity fields.

#### Scenario: Text from supported sources
- **WHEN** text is provided in `activity.name`, `activity.description`, `activity.tags`, or `activity.gear`
- **THEN** it MUST be treated as untrusted input
- **AND** MUST NOT be copied verbatim into prompts
- **AND** MUST be processed through signal extraction
- **AND** only normalized semantic signals MAY influence prompt generation

### Requirement: Brand Name Usage
Brand names MAY be used in prompts under specific constraints.

#### Scenario: Valid brand usage
- **WHEN** brand names originate from gear metadata or activity description
- **THEN** they MAY be used contextually (e.g., equipment reference)
- **AND** MUST NOT be inferred or hallucinated
- **AND** excessive brand emphasis MUST be avoided

#### Scenario: Brand compliance
- **WHEN** brand names are included
- **THEN** they MUST still comply with all other content guardrails

### Requirement: Tag Processing
The system MUST properly process and normalize activity tags.

#### Scenario: Built-in Strava tags
- **WHEN** tags like `long run`, `recovery`, `race`, `commute` are present
- **THEN** they MUST be normalized before use
- **AND** MUST influence mood, intensity, or scene
- **AND** MUST NOT be rendered as literal text in images

#### Scenario: Conflicting tags
- **WHEN** conflicting tags are present
- **THEN** they SHOULD be resolved deterministically
- **AND** processing continues with resolved tags

### Requirement: Prompt Content Restrictions
Prompts MUST include only allowed content and exclude forbidden content.

#### Scenario: Allowed content in prompts
- **WHEN** generating prompts
- **THEN** they MAY include generic human figures, nature/gym/urban environments, emotional tone, artistic descriptors, and contextual brand references

#### Scenario: Forbidden content detection
- **WHEN** forbidden content is detected (real persons, political symbols, explicit content, military scenes, text instructions)
- **THEN** it MUST be removed or replaced
- **AND** generation MUST NOT proceed without sanitization

#### Scenario: Prompt size limits
- **WHEN** a prompt exceeds 400 characters
- **THEN** it MUST be truncated or simplified

### Requirement: Visual Style Restrictions
The system MUST enforce allowed visual styles and prevent forbidden styles.

#### Scenario: Allowed style selection
- **WHEN** selecting a visual style
- **THEN** only `cartoon`, `minimal`, `abstract`, or `illustrated` styles are allowed
- **AND** style selection SHOULD be deterministic for the same activity classification

#### Scenario: Forbidden style prevention
- **WHEN** attempting to generate photorealistic, hyper-detailed, or ultra-realistic art
- **THEN** the system MUST NOT generate such styles
- **AND** MUST use an allowed style instead

### Requirement: Image Output Validation
Generated images MUST satisfy specific output requirements.

#### Scenario: Valid image output
- **WHEN** an image is generated
- **THEN** it MUST have aspect ratio of 1:1 or 16:9
- **AND** MUST contain no text elements
- **AND** MUST have 1-3 primary visual subjects
- **AND** MUST have neutral, non-distracting background
- **AND** MUST contain only safe content

#### Scenario: Output validation failure
- **WHEN** output validation fails
- **THEN** a retry MAY be attempted
- **OR** a fallback MUST be used

### Requirement: Retry and Fallback Strategy
The system MUST implement proper retry and fallback mechanisms.

#### Scenario: Retry attempts
- **WHEN** image generation fails
- **THEN** maximum 2 retries are allowed
- **AND** each retry MUST simplify the prompt

#### Scenario: Fallback activation
- **WHEN** all retries fail
- **THEN** the system MUST switch to `minimal` or `abstract` style
- **AND** use a predefined safe prompt
- **AND** always return a valid image

#### Scenario: Response guarantees
- **WHEN** the system completes processing
- **THEN** it MUST never return partial results, corrupted files, or empty responses

### Requirement: Failure Handling
Failures MUST be properly logged and handled gracefully.

#### Scenario: Failure logging
- **WHEN** a failure occurs
- **THEN** it MUST be logged with reason and context
- **AND** classified as input, prompt, generation, or validation failure

#### Scenario: User-facing behavior
- **WHEN** handling failures for users
- **THEN** behavior MUST be silent or graceful
- **AND** avoid exposing internal errors
- **AND** always produce a valid outcome

### Requirement: Determinism and Predictability
The system SHOULD provide consistent behavior for identical inputs.

#### Scenario: Identical input processing
- **WHEN** given identical inputs
- **THEN** classification and style decisions SHOULD be identical
- **AND** randomness MUST be bounded and controlled
