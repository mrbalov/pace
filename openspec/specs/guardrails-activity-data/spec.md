# Activity Data Guardrails

## Purpose

Define guardrails for validating activity input data, user-provided text, and tags to ensure data integrity and safe processing.

## Requirements

### Requirement: Required Activity Fields

An activity input SHALL contain `type` and `sport_type` as required string fields. Optional fields MAY include `distance`, `avg_hr`, `pace`, `elevation_gain`, `time_of_day`, `weather`, `name`, `description`, `tags`, `gear`, and others from the Strava API. If required fields are missing, the system SHALL reject the activity OR handle it via a predefined fallback.

#### Scenario: Valid activity with required fields
- **GIVEN** an activity input with `type` and `sport_type` present
- **WHEN** the activity is validated
- **THEN** the activity passes required field validation

#### Scenario: Activity missing required fields
- **GIVEN** an activity input missing `type` or `sport_type`
- **WHEN** the activity is validated
- **THEN** the activity SHALL be rejected OR handled via fallback

#### Scenario: Activity with optional fields
- **GIVEN** an activity input with required fields and optional fields present
- **WHEN** the activity is validated
- **THEN** the activity passes validation regardless of optional field presence

### Requirement: Activity Value Constraints

Input values SHALL satisfy the following constraints when present: `distance > 0`, `avg_hr` in range [40, 220], `pace > 0`, `elevation_gain ≥ 0`. Values outside allowed ranges SHALL be clamped, normalized, or replaced with `unknown`. Absence of optional fields SHALL NOT be treated as an error.

#### Scenario: Valid distance value
- **GIVEN** an activity with `distance` greater than 0
- **WHEN** the activity is validated
- **THEN** the distance value passes validation

#### Scenario: Invalid distance value
- **GIVEN** an activity with `distance` less than or equal to 0
- **WHEN** the activity is validated
- **THEN** the distance SHALL be clamped, normalized, or replaced with `unknown`

#### Scenario: Valid heart rate value
- **GIVEN** an activity with `avg_hr` in range [40, 220]
- **WHEN** the activity is validated
- **THEN** the heart rate value passes validation

#### Scenario: Invalid heart rate value
- **GIVEN** an activity with `avg_hr` outside range [40, 220]
- **WHEN** the activity is validated
- **THEN** the heart rate SHALL be clamped, normalized, or replaced with `unknown`

#### Scenario: Valid pace value
- **GIVEN** an activity with `pace` greater than 0
- **WHEN** the activity is validated
- **THEN** the pace value passes validation

#### Scenario: Invalid pace value
- **GIVEN** an activity with `pace` less than or equal to 0
- **WHEN** the activity is validated
- **THEN** the pace SHALL be clamped, normalized, or replaced with `unknown`

#### Scenario: Valid elevation gain value
- **GIVEN** an activity with `elevation_gain` greater than or equal to 0
- **WHEN** the activity is validated
- **THEN** the elevation gain value passes validation

#### Scenario: Invalid elevation gain value
- **GIVEN** an activity with `elevation_gain` less than 0
- **WHEN** the activity is validated
- **THEN** the elevation gain SHALL be clamped, normalized, or replaced with `unknown`

#### Scenario: Missing optional field
- **GIVEN** an activity with required fields but missing optional fields
- **WHEN** the activity is validated
- **THEN** the absence of optional fields SHALL NOT be treated as an error

### Requirement: Activity Semantic Validation

Inputs SHALL be semantically consistent. Examples of invalid combinations include running pace faster than realistic human limits, cycling cadence outside realistic bounds, and elevation gain inconsistent with activity type. If semantic validation fails, the system SHALL prefer graceful degradation and avoid hard failure when possible.

#### Scenario: Semantically consistent activity
- **GIVEN** an activity with values consistent with its type
- **WHEN** the activity is validated
- **THEN** the activity passes semantic validation

#### Scenario: Semantically inconsistent activity
- **GIVEN** an activity with values inconsistent with its type (e.g., running pace faster than human limits)
- **WHEN** the activity is validated
- **THEN** the system SHALL prefer graceful degradation and avoid hard failure

### Requirement: User-Provided Text Sources

The system MAY ingest user-provided text from activity data fields `name`, `description`, `tags`, and `gear`. These fields SHALL be treated as untrusted input.

#### Scenario: Text from activity name
- **GIVEN** an activity with user-provided text in the `name` field
- **WHEN** the text is processed
- **THEN** the text SHALL be treated as untrusted input

#### Scenario: Text from activity description
- **GIVEN** an activity with user-provided text in the `description` field
- **WHEN** the text is processed
- **THEN** the text SHALL be treated as untrusted input

#### Scenario: Text from tags
- **GIVEN** an activity with user-provided text in the `tags` field
- **WHEN** the text is processed
- **THEN** the text SHALL be treated as untrusted input

#### Scenario: Text from gear
- **GIVEN** an activity with user-provided text in the `gear` field
- **WHEN** the text is processed
- **THEN** the text SHALL be treated as untrusted input

### Requirement: User-Provided Text Usage

User-provided text SHALL NOT be copied verbatim into prompts. User-provided text SHALL be processed through signal extraction and SHALL comply with all prompt and content guardrails. Only normalized semantic signals MAY influence prompt generation.

#### Scenario: Text not copied verbatim
- **GIVEN** user-provided text from activity data
- **WHEN** generating a prompt
- **THEN** the text SHALL NOT be copied verbatim into the prompt

#### Scenario: Text processed through signal extraction
- **GIVEN** user-provided text from activity data
- **WHEN** processing the text
- **THEN** the text SHALL be processed through signal extraction

#### Scenario: Normalized signals influence prompt
- **GIVEN** user-provided text that has been processed and normalized
- **WHEN** generating a prompt
- **THEN** only normalized semantic signals MAY influence prompt generation

### Requirement: Brand Name Usage

Brand names MAY be used in prompts under the following constraints: brands SHALL originate from gear metadata or activity name or description, brands SHALL NOT be inferred or hallucinated, brand usage SHALL be contextual (e.g., equipment reference), and excessive brand emphasis SHALL be avoided. Brand names SHALL comply with all other content guardrails.

#### Scenario: Brand from gear metadata
- **GIVEN** an activity with brand information in gear metadata
- **WHEN** generating a prompt
- **THEN** the brand MAY be used contextually in the prompt

#### Scenario: Brand from activity name
- **GIVEN** an activity with brand information in the activity name
- **WHEN** generating a prompt
- **THEN** the brand MAY be used contextually in the prompt

#### Scenario: Brand not inferred
- **GIVEN** an activity without explicit brand information
- **WHEN** generating a prompt
- **THEN** brands SHALL NOT be inferred or hallucinated

#### Scenario: Brand usage contextual
- **GIVEN** an activity with valid brand information
- **WHEN** generating a prompt
- **THEN** brand usage SHALL be contextual and excessive brand emphasis SHALL be avoided

### Requirement: Supported Tag Types

The system MAY process built-in Strava tags, including but not limited to `long run`, `recovery`, `race`, `commute`, `with kid`, `easy`, and `workout`. Tags MAY be represented as structured fields, normalized enums, or keywords extracted from metadata.

#### Scenario: Processing Strava tags
- **GIVEN** an activity with built-in Strava tags
- **WHEN** processing the activity
- **THEN** the system MAY process the tags

#### Scenario: Tag representation formats
- **GIVEN** tags from an activity
- **WHEN** representing the tags
- **THEN** tags MAY be represented as structured fields, normalized enums, or keywords

### Requirement: Tag Handling Rules

Tags SHALL be normalized before use. Tags SHALL influence mood, intensity, and scene. Tags SHALL NOT be rendered as literal text in images. Conflicting tags SHOULD be resolved deterministically.

#### Scenario: Tags normalized before use
- **GIVEN** tags from an activity
- **WHEN** using the tags
- **THEN** tags SHALL be normalized before use

#### Scenario: Tags influence mood and intensity
- **GIVEN** normalized tags from an activity
- **WHEN** generating an image
- **THEN** tags SHALL influence mood, intensity, and scene

#### Scenario: Tags not rendered as text
- **GIVEN** tags from an activity
- **WHEN** generating an image
- **THEN** tags SHALL NOT be rendered as literal text in the image

#### Scenario: Conflicting tags resolved
- **GIVEN** an activity with conflicting tags
- **WHEN** processing the tags
- **THEN** conflicting tags SHOULD be resolved deterministically

#### Scenario: Recovery tag influences mood
- **GIVEN** an activity with `recovery` tag
- **WHEN** generating an image
- **THEN** the tag SHALL influence mood toward calm and low intensity

#### Scenario: Race tag influences intensity
- **GIVEN** an activity with `race` tag
- **WHEN** generating an image
- **THEN** the tag SHALL influence intensity toward competitive and intense energy

#### Scenario: With kid tag influences scene
- **GIVEN** an activity with `with kid` tag
- **WHEN** generating an image
- **THEN** the tag SHALL influence scene toward playful or warm atmosphere