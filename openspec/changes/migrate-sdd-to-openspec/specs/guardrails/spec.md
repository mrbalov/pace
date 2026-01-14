## ADDED Requirements

### Requirement: Input Field Validation
The system SHALL validate all activity input fields according to defined constraints.

#### Scenario: Required fields present
- **WHEN** an activity is submitted with type field
- **THEN** the activity is accepted for processing

#### Scenario: Required fields missing
- **WHEN** an activity is submitted without type field
- **THEN** the activity MUST be rejected or handled via predefined fallback

#### Scenario: Optional fields handling
- **WHEN** optional fields (distance, avg_hr, pace, etc.) are absent
- **THEN** absence MUST NOT be treated as an error
- **AND** processing continues with available data

### Requirement: Value Constraints
Input values SHALL satisfy defined constraints when present.

#### Scenario: Valid numeric values
- **WHEN** distance is 10km, avg_hr is 150, pace is 5:30/km, elevation_gain is 100m
- **THEN** all values are accepted as valid

#### Scenario: Out-of-range distance
- **WHEN** distance is negative or zero
- **THEN** value MUST be clamped, normalized, or replaced with unknown

#### Scenario: Out-of-range heart rate
- **WHEN** avg_hr is below 40 or above 220
- **THEN** value MUST be clamped to valid range or marked unknown

#### Scenario: Invalid elevation gain
- **WHEN** elevation_gain is negative
- **THEN** value MUST be set to 0 or marked unknown

### Requirement: Semantic Validation
Inputs SHALL be semantically consistent with realistic human performance limits.

#### Scenario: Realistic running pace
- **WHEN** running pace is within human limits (e.g., 3:00-10:00/km)
- **THEN** the pace is accepted as valid

#### Scenario: Unrealistic cycling cadence
- **WHEN** cycling cadence is outside realistic bounds (e.g., >200 rpm)
- **THEN** prefer graceful degradation over hard failure

#### Scenario: Inconsistent elevation for activity type
- **WHEN** swimming activity has elevation gain
- **THEN** handle inconsistency gracefully without failing

### Requirement: User-Provided Text Processing
The system SHALL treat all user-provided text as untrusted input requiring processing.

#### Scenario: Text from activity fields
- **WHEN** text is provided in name, description, tags, or gear fields
- **THEN** text MUST be treated as untrusted input
- **AND** text MUST NOT be copied verbatim into prompts
- **AND** only normalized semantic signals MAY influence generation

#### Scenario: Signal extraction from text
- **WHEN** processing user-provided text
- **THEN** extract semantic signals through safe processing
- **AND** ensure compliance with all content guardrails

### Requirement: Brand Name Handling
Brand names SHALL be used in prompts only under specific constraints.

#### Scenario: Valid brand usage from gear
- **WHEN** brand name originates from gear metadata
- **THEN** brand MAY be used contextually in prompt
- **AND** excessive brand emphasis MUST be avoided

#### Scenario: Brand in activity description
- **WHEN** brand name appears in activity description
- **THEN** brand MAY be referenced if contextually appropriate
- **AND** it MUST still comply with all content guardrails

#### Scenario: Hallucinated brand names
- **WHEN** system attempts to infer brand not in source data
- **THEN** the brand MUST NOT be included in prompt

### Requirement: Tag Processing
The system SHALL process activity tags according to defined rules.

#### Scenario: Built-in Strava tag handling
- **WHEN** tags like "long run", "recovery", "race" are present
- **THEN** tags MUST be normalized before use
- **AND** tags influence mood, intensity, or scene
- **AND** tags MUST NOT be rendered as literal text

#### Scenario: Conflicting tags resolution
- **WHEN** conflicting tags like "easy" and "race" are present
- **THEN** conflicts SHOULD be resolved deterministically
- **AND** higher priority tag takes precedence

#### Scenario: Tag to mood mapping
- **WHEN** "recovery" tag is present
- **THEN** mood becomes calm with low intensity
- **AND** scene reflects relaxed atmosphere

### Requirement: Prompt Content Restrictions
Prompts SHALL include only allowed content and exclude all forbidden content.

#### Scenario: Allowed content in prompt
- **WHEN** generating a prompt
- **THEN** it MAY include generic human figures, nature/gym/urban environments, emotional tone, artistic descriptors
- **AND** contextual brand references when allowed

#### Scenario: Forbidden content detection
- **WHEN** prompt would include real persons, political symbols, explicit content, military scenes, or text
- **THEN** forbidden content MUST be removed or replaced
- **AND** generation MUST NOT proceed without sanitization

#### Scenario: Prompt length limit
- **WHEN** prompt exceeds 400 characters
- **THEN** prompt MUST be truncated or simplified
- **AND** core subject and style MUST be preserved

### Requirement: Visual Style Restrictions
The system SHALL only generate images in allowed visual styles.

#### Scenario: Allowed style selection
- **WHEN** selecting a visual style
- **THEN** only cartoon, minimal, abstract, or illustrated styles are allowed
- **AND** style selection SHOULD be deterministic for same input

#### Scenario: Forbidden style attempt
- **WHEN** photorealistic or hyper-detailed style is requested
- **THEN** the system MUST NOT generate such images
- **AND** it MUST fall back to an allowed style

#### Scenario: Style consistency
- **WHEN** same activity classification is processed multiple times
- **THEN** style selection SHOULD be identical
- **AND** random variation MUST stay within allowed boundaries

### Requirement: Image Output Validation
Generated images SHALL satisfy defined output constraints.

#### Scenario: Valid image output
- **WHEN** image is generated
- **THEN** it MUST have 1:1 or 16:9 aspect ratio
- **AND** contain no text elements
- **AND** have 1-3 primary visual subjects
- **AND** include neutral, non-distracting background

#### Scenario: Output validation failure
- **WHEN** generated image fails validation
- **THEN** a retry MAY be attempted
- **OR** a fallback MUST be used
- **AND** system MUST always return valid image

### Requirement: Retry and Fallback Strategy
The system SHALL implement defined retry and fallback mechanisms.

#### Scenario: Retry on generation failure
- **WHEN** image generation fails
- **THEN** maximum 2 retries are allowed
- **AND** each retry MUST simplify the prompt

#### Scenario: Fallback after retries exhausted
- **WHEN** all retries fail
- **THEN** switch to minimal or abstract style
- **AND** use predefined safe prompt
- **AND** always return a valid image

#### Scenario: Invalid response handling
- **WHEN** generation produces partial results, corrupted files, or empty responses
- **THEN** system MUST NOT return these
- **AND** fallback mechanism MUST activate

### Requirement: Failure Handling and Logging
Failures SHALL be properly logged and handled gracefully.

#### Scenario: Failure logging
- **WHEN** any failure occurs
- **THEN** it MUST be logged with reason and context
- **AND** classified as input, prompt, generation, or validation failure

#### Scenario: User-facing error handling
- **WHEN** internal error occurs
- **THEN** user-facing behavior MUST be silent or graceful
- **AND** avoid exposing internal errors
- **AND** always produce valid outcome

### Requirement: Determinism and Predictability
The system SHALL produce deterministic results for identical inputs.

#### Scenario: Identical input processing
- **WHEN** identical inputs are provided
- **THEN** classification and style decisions SHOULD be identical
- **AND** randomness MUST be bounded and controlled

### Requirement: Guardrails as Contract
Guardrails SHALL be part of the public system contract.

#### Scenario: Guardrail compliance
- **WHEN** code is written
- **THEN** it MUST comply with all guardrails
- **AND** violations are considered incorrect even if appearing to work

#### Scenario: Guardrail changes
- **WHEN** guardrails are modified
- **THEN** it constitutes a behavioral change
- **AND** changes MUST be versioned and reviewed