# Activity Prompt Generation

## Purpose

Define how textual prompts for image generation are constructed from extracted Strava activity signals. Prompt generation is a deterministic, rule-based process that transforms structured activity signals into visual descriptions, enforces global guardrails, and produces predictable and safe prompts for AI image models.

## Requirements

### Requirement: Input Contract

Prompt generation SHALL receive activity signals from the Activity Signals module and SHALL use these signals to generate prompts.

#### Scenario: Valid activity signals input
- **GIVEN** extracted activity signals from Activity Signals
- **WHEN** prompt generation is invoked
- **THEN** the module SHALL receive activity signals as input
- **AND** the module SHALL use these signals to generate prompts

#### Scenario: Missing or invalid signals
- **GIVEN** missing or invalid activity signals
- **WHEN** prompt generation is invoked
- **THEN** the module SHALL use fallback prompt generation

### Requirement: Output Contract

Prompt generation SHALL return a complete prompt structure suitable for image generation.

#### Scenario: Complete prompt structure
- **GIVEN** valid activity signals
- **WHEN** prompt generation completes
- **THEN** the module SHALL return a complete prompt structure
- **AND** the prompt SHALL comply with image generation prompt guardrails
- **AND** the prompt SHALL include all required elements for image generation

### Requirement: Signal-Based Prompt Construction

Prompts SHALL be constructed from normalized activity signals. Prompts SHALL incorporate signals for activity type, intensity, environment, mood, and style as available from the activity signals.

#### Scenario: Prompt from activity type signals
- **GIVEN** activity signals with activity type information
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate activity type signals appropriately

#### Scenario: Prompt from intensity signals
- **GIVEN** activity signals with intensity classification
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate intensity signals appropriately

#### Scenario: Prompt from environmental signals
- **GIVEN** activity signals with environmental context (elevation, time of day, weather, location)
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate environmental signals appropriately

#### Scenario: Prompt from mood signals
- **GIVEN** activity signals with mood indicators
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate mood signals appropriately

### Requirement: Activity Type Classification

Prompts SHALL classify activities into appropriate subject and environment descriptions based on activity type signals.

#### Scenario: Known activity type classification
- **GIVEN** activity signals with a known activity type
- **WHEN** generating a prompt
- **THEN** the prompt SHALL use appropriate subject and environment descriptions for that activity type

#### Scenario: Unknown activity type handling
- **GIVEN** activity signals with an unknown or ambiguous activity type
- **WHEN** generating a prompt
- **THEN** the prompt SHALL use generic subject descriptions (e.g., "athlete" or "person exercising")
- **AND** the prompt SHALL use neutral environment descriptions (e.g., "outdoor setting" or "training area")
- **AND** the prompt SHALL incorporate safe contextual signals when available

### Requirement: Intensity Classification Integration

Prompts SHALL incorporate intensity classification (low, medium, high) from activity signals to influence prompt tone and style selection.

#### Scenario: Low intensity integration
- **GIVEN** activity signals with low intensity classification
- **WHEN** generating a prompt
- **THEN** the prompt SHALL reflect calm, relaxed, or gentle characteristics

#### Scenario: Medium intensity integration
- **GIVEN** activity signals with medium intensity classification
- **WHEN** generating a prompt
- **THEN** the prompt SHALL reflect steady, focused, or moderate characteristics

#### Scenario: High intensity integration
- **GIVEN** activity signals with high intensity classification
- **WHEN** generating a prompt
- **THEN** the prompt SHALL reflect intense, demanding, or competitive characteristics

### Requirement: Elevation Classification Integration

Prompts SHALL incorporate elevation signals to influence terrain and environment descriptions.

#### Scenario: High elevation integration
- **GIVEN** activity signals indicating high elevation gain
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate mountainous or hilly terrain descriptions

#### Scenario: Moderate elevation integration
- **GIVEN** activity signals indicating moderate elevation gain
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate rolling or moderate terrain descriptions

#### Scenario: Low elevation integration
- **GIVEN** activity signals indicating low elevation gain
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate flat terrain descriptions

### Requirement: Time-Based Lighting Integration

Prompts SHALL incorporate time of day signals to influence scene lighting descriptions.

#### Scenario: Morning activity lighting
- **GIVEN** activity signals indicating morning time
- **WHEN** generating a prompt
- **THEN** the prompt SHALL describe soft, fresh lighting

#### Scenario: Daytime activity lighting
- **GIVEN** activity signals indicating daytime
- **WHEN** generating a prompt
- **THEN** the prompt SHALL describe bright, clear lighting

#### Scenario: Evening activity lighting
- **GIVEN** activity signals indicating evening time
- **WHEN** generating a prompt
- **THEN** the prompt SHALL describe warm, golden lighting

#### Scenario: Night activity lighting
- **GIVEN** activity signals indicating night time
- **WHEN** generating a prompt
- **THEN** the prompt SHALL describe dark, dramatic atmosphere

### Requirement: Weather Integration

Prompts SHALL incorporate weather signals when available to influence scene composition and mood.

#### Scenario: Sunny weather integration
- **GIVEN** activity signals with sunny weather
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate bright lighting and clear skies
- **AND** the prompt SHALL reflect energetic and positive mood

#### Scenario: Rainy weather integration
- **GIVEN** activity signals with rainy weather
- **WHEN** generating a prompt
- **THEN** the prompt SHALL incorporate rain effects and wet surfaces
- **AND** the prompt SHALL reflect contemplative and persistent mood

#### Scenario: Weather conflict resolution
- **GIVEN** activity signals with weather that conflicts with activity type (e.g., indoor activity with outdoor weather)
- **WHEN** generating a prompt
- **THEN** weather signals SHALL be ignored or adapted appropriately

### Requirement: Tag-Based Signal Integration

Prompts SHALL incorporate tag signals to influence mood, intensity, and scene composition.

#### Scenario: Recovery tag integration
- **GIVEN** activity signals with recovery tag
- **WHEN** generating a prompt
- **THEN** the prompt SHALL reflect calm mood and low intensity
- **AND** the prompt SHALL incorporate gentle and relaxed scene elements

#### Scenario: Race tag integration
- **GIVEN** activity signals with race tag
- **WHEN** generating a prompt
- **THEN** the prompt SHALL reflect intense mood and high intensity
- **AND** the prompt SHALL incorporate competitive scene elements

#### Scenario: Unrecognized tag handling
- **GIVEN** activity signals with unrecognized tags
- **WHEN** generating a prompt
- **THEN** tags SHALL pass safety validation
- **AND** safe semantic signals MAY be extracted and incorporated
- **OR** tags SHALL be ignored if no safe signal is found

### Requirement: Deterministic Style Selection

Style selection SHALL be deterministic based on activity signal characteristics. Style SHALL be selected from allowed styles: `cartoon`, `minimal`, `abstract`, and `illustrated`.

#### Scenario: High intensity style selection
- **GIVEN** activity signals with high intensity and known activity types (Run, Ride, Trail Run)
- **WHEN** selecting style
- **THEN** style SHALL be `illustrated`

#### Scenario: Recovery activity style selection
- **GIVEN** activity signals with recovery or easy tags
- **WHEN** selecting style
- **THEN** style SHALL be `minimal`

#### Scenario: High elevation style selection
- **GIVEN** activity signals with high elevation gain
- **WHEN** selecting style
- **THEN** style SHALL be `illustrated`

#### Scenario: Foggy weather style selection
- **GIVEN** activity signals with foggy weather
- **WHEN** selecting style
- **THEN** style SHALL be `abstract`

#### Scenario: Default style selection
- **GIVEN** activity signals with no specific style-determining conditions
- **WHEN** selecting style
- **THEN** style SHALL default to `cartoon`

#### Scenario: Deterministic style for identical inputs
- **GIVEN** identical activity signal inputs
- **WHEN** selecting style
- **THEN** style selection SHALL be identical

### Requirement: Mood Selection

Mood descriptors SHALL be abstract, emotional, and appropriate. Mood SHALL align with activity signal characteristics.

#### Scenario: Valid mood selection
- **GIVEN** activity signals requiring mood selection
- **WHEN** selecting mood
- **THEN** mood SHALL be abstract and emotional
- **AND** mood SHALL be non-narrative
- **AND** mood SHALL be expressed as single words or short phrases

#### Scenario: Mood alignment with signals
- **GIVEN** activity signals with explicit tag signals
- **WHEN** determining mood
- **THEN** mood SHALL align with tag signals first
- **AND** then with intensity level
- **AND** then with weather conditions
- **AND** conflicts SHALL be resolved by priority order

### Requirement: Scene Composition

Scenes SHALL be properly composed with appropriate elements based on activity signals.

#### Scenario: Environment selection
- **GIVEN** activity signals with environmental context
- **WHEN** composing a scene
- **THEN** the scene SHALL include primary environment based on activity type
- **AND** terrain features based on elevation signals
- **AND** lighting based on time of day signals
- **AND** weather elements when applicable

#### Scenario: Composition rules
- **GIVEN** activity signals requiring scene composition
- **WHEN** building scene composition
- **THEN** the scene SHALL feature 1-3 visual subjects
- **AND** avoid cluttered backgrounds
- **AND** maintain focus on the activity
- **AND** be appropriate for selected style

#### Scenario: Scene building priority
- **GIVEN** activity signals requiring scene composition
- **WHEN** adding scene elements
- **THEN** base environment SHALL be added first
- **AND** then terrain modifiers
- **AND** then weather effects
- **AND** then time-based lighting
- **AND** then mood-based atmosphere
- **AND** earlier elements SHALL take precedence in conflicts

### Requirement: Prompt Assembly

Prompts SHALL follow the defined structure and length constraints. Prompts SHALL not exceed 600 characters.

#### Scenario: Prompt structure compliance
- **GIVEN** activity signals ready for prompt assembly
- **WHEN** assembling the final prompt
- **THEN** the prompt SHALL follow the required structure
- **AND** include style, subject, activity context, mood, and scene elements
- **AND** comply with image generation prompt guardrails

#### Scenario: Length limit enforcement
- **GIVEN** a prompt exceeding 600 characters
- **WHEN** assembling the prompt
- **THEN** scene details SHALL be truncated first
- **AND** core subject and style SHALL always be preserved
- **AND** the prompt SHALL not exceed 600 characters

### Requirement: Prompt Validation

Generated prompts SHALL be validated before returning using the Activity Guardrails module.

#### Scenario: Successful validation
- **GIVEN** a generated prompt
- **WHEN** validating the prompt
- **THEN** the prompt SHALL comply with image generation prompt guardrails
- **AND** style SHALL be from allowed set
- **AND** all required fields SHALL be populated
- **AND** brand usage SHALL be compliant if applicable

#### Scenario: Validation failure handling
- **GIVEN** a generated prompt that fails validation
- **WHEN** validation fails
- **THEN** the system SHALL sanitize and retry once
- **AND** if still invalid, the system SHALL use fallback prompt

### Requirement: Fallback Prompt

A safe fallback prompt SHALL always be available when valid prompt generation fails.

#### Scenario: Fallback activation
- **GIVEN** a scenario where valid prompt cannot be generated
- **WHEN** fallback is needed
- **THEN** fallback prompt SHALL be used
- **AND** fallback prompt SHALL use safe, minimal defaults
- **AND** fallback prompt SHALL comply with all guardrails

#### Scenario: Fallback guarantees
- **GIVEN** any unrecoverable error or unsafe activity type
- **WHEN** using fallback
- **THEN** fallback SHALL be used for any unrecoverable error
- **AND** fallback SHALL be used for unsafe or ambiguous activity types
- **AND** fallback SHALL comply with all guardrails
- **AND** fallback SHALL always produce a valid prompt

### Requirement: Determinism

The system SHALL produce identical outputs for identical inputs.

#### Scenario: Identical input processing
- **GIVEN** identical activity signal inputs
- **WHEN** processing the signals
- **THEN** the system SHALL produce identical prompt text
- **AND** identical style selection
- **AND** identical mood selection
- **AND** identical scene composition
- **AND** random variation SHALL NOT be allowed

### Requirement: Error Handling

The system SHALL handle all errors gracefully and always produce valid output.

#### Scenario: Error prevention
- **GIVEN** any input during prompt generation
- **WHEN** processing the input
- **THEN** the system SHALL NOT throw exceptions for invalid input
- **AND** the system SHALL NOT return partial results
- **AND** the system SHALL NOT produce empty prompts
- **AND** the system SHALL NOT generate unsafe content

#### Scenario: Error recovery
- **GIVEN** any error during prompt generation
- **WHEN** an error occurs
- **THEN** the error SHALL result in fallback behavior
- **AND** the system SHALL always produce a valid output
