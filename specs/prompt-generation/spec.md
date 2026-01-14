# Prompt Generation

## Purpose
This capability defines how textual prompts for image generation are constructed from Strava activity data. The prompt generation is based on the Strava activity API response.

Prompt generation is a **deterministic, rule-based process** that:
- Transforms structured activity input into visual descriptions
- Extracts semantic signals from user-provided text
- Enforces global guardrails
- Produces predictable and safe prompts for AI image models

## Requirements

### Requirement: Input Contract
Prompt generation MUST receive required fields and MAY use optional fields.

#### Scenario: Required fields present
- **WHEN** prompt generation is invoked
- **THEN** it MUST receive `type` and `sport_type` fields
- **AND** if required fields are missing, generation MUST NOT proceed

#### Scenario: Optional fields handling
- **WHEN** optional fields like `name`, `description`, `distance`, `average_heartrate` are present
- **THEN** they MAY be used to enhance the prompt
- **AND** their absence MUST NOT cause failure

### Requirement: Output Contract
Prompt generation MUST return a complete prompt structure.

#### Scenario: Complete output structure
- **WHEN** prompt generation completes
- **THEN** it MUST return Subject (main prompt text)
- **AND** Style (visual style from allowed set)
- **AND** Mood (emotion description)
- **AND** Scene (environment description)
- **AND** all fields MUST be present and non-empty

### Requirement: User Text Signal Extraction
User-provided text MUST be processed to extract semantic signals.

#### Scenario: Signal extraction from text
- **WHEN** processing user text from `name`, `description`, or `gear`
- **THEN** only normalized semantic signals MUST be extracted
- **AND** these signals MAY influence mood, intensity, environment, scene, and other aspects

#### Scenario: Brand name extraction
- **WHEN** brand names are found in user text
- **THEN** they MUST be handled according to guardrails
- **AND** used only contextually when allowed

### Requirement: Activity Type Classification
Activities MUST be classified into appropriate subject and environment.

#### Scenario: Known activity type
- **WHEN** activity type is Run
- **THEN** subject is "runner" and default environment is "outdoor trail"

#### Scenario: Unknown activity type - safe
- **WHEN** activity type is unknown but passes safety review
- **THEN** MUST use generic subject "athlete" or "person exercising"
- **AND** MUST use neutral environment "outdoor setting" or "training area"
- **AND** MAY incorporate safe contextual signals

#### Scenario: Unknown activity type - unsafe
- **WHEN** activity type is unknown and unsafe or ambiguous
- **THEN** MUST fall back to generic activity prompt
- **AND** MUST log the unknown type
- **AND** MUST use the fallback prompt structure

### Requirement: Intensity Classification
Intensity MUST be classified based on available signals.

#### Scenario: Explicit tag-based intensity
- **WHEN** tags like `recovery`, `easy`, or `race` are present
- **THEN** intensity is classified as low, low, or high respectively

#### Scenario: Heart rate-based intensity
- **WHEN** heart rate data is available and no explicit tags
- **THEN** intensity is determined from heart rate zones

#### Scenario: Default intensity
- **WHEN** no intensity signals are available
- **THEN** intensity defaults to `medium`

### Requirement: Elevation Classification
Elevation MUST influence terrain description.

#### Scenario: Mountainous terrain
- **WHEN** elevation_gain > 300m
- **THEN** terrain is classified as `mountainous` or `hilly`

#### Scenario: Rolling terrain
- **WHEN** elevation_gain is between 50 and 300m
- **THEN** terrain is classified as `rolling` or `moderate`

#### Scenario: Flat terrain
- **WHEN** elevation_gain < 50m
- **THEN** terrain is classified as `flat`

### Requirement: Time-Based Lighting
Time of day MUST influence scene lighting.

#### Scenario: Morning activity
- **WHEN** activity occurs between 5:00-11:00
- **THEN** lighting is described as soft, fresh light

#### Scenario: Evening activity
- **WHEN** activity occurs between 17:00-21:00
- **THEN** lighting is described as warm, golden light

#### Scenario: Night activity
- **WHEN** activity occurs between 21:00-5:00
- **THEN** atmosphere is dark and dramatic

### Requirement: Weather Integration
Weather conditions MUST influence scene composition.

#### Scenario: Sunny weather
- **WHEN** weather is sunny
- **THEN** lighting is bright with clear skies and defined shadows
- **AND** mood is energetic and positive

#### Scenario: Rainy weather
- **WHEN** weather is rainy
- **THEN** scene includes rain effects, puddles, wet surfaces
- **AND** mood is contemplative and persistent

#### Scenario: Weather conflicts
- **WHEN** weather conflicts with activity (e.g., indoor yoga with rain)
- **THEN** weather MUST be ignored

### Requirement: Tag-Based Mood Modification
Tags MUST influence mood and scene modifiers.

#### Scenario: Recovery tag
- **WHEN** `recovery` tag is present
- **THEN** mood is calm with low intensity
- **AND** scene is gentle and relaxed

#### Scenario: Race tag
- **WHEN** `race` tag is present
- **THEN** mood is intense with high intensity
- **AND** scene is competitive

#### Scenario: Unrecognized tag
- **WHEN** an unrecognized tag is encountered
- **THEN** it MUST pass safety check
- **AND** safe semantic signals MAY be extracted
- **OR** tag is ignored if no safe signal found

### Requirement: Deterministic Style Selection
Style selection MUST be deterministic based on activity characteristics.

#### Scenario: High intensity activity
- **WHEN** intensity is high AND activity is Run, Ride, or Trail Run
- **THEN** style is `illustrated`

#### Scenario: Recovery activity
- **WHEN** tags contain `recovery` OR `easy`
- **THEN** style is `minimal`

#### Scenario: High elevation activity
- **WHEN** elevation > 500m
- **THEN** style is `illustrated`

#### Scenario: Foggy weather
- **WHEN** weather is foggy
- **THEN** style is `abstract`

#### Scenario: Default style
- **WHEN** no specific conditions match
- **THEN** style defaults to `cartoon`

### Requirement: Mood Selection
Mood descriptors MUST be abstract and appropriate.

#### Scenario: Valid mood selection
- **WHEN** selecting a mood
- **THEN** it MUST be abstract and emotional
- **AND** MUST be non-narrative
- **AND** MUST be single words or short phrases

#### Scenario: Mood alignment
- **WHEN** determining mood
- **THEN** it MUST align with explicit tag signals first
- **AND** then intensity level
- **AND** then weather conditions
- **AND** conflicts MUST be resolved by priority order

### Requirement: Scene Composition
Scenes MUST be properly composed with appropriate elements.

#### Scenario: Environment selection
- **WHEN** composing a scene
- **THEN** it MUST include primary environment based on activity type
- **AND** terrain features based on elevation
- **AND** lighting based on time of day
- **AND** weather elements if applicable

#### Scenario: Composition rules
- **WHEN** building scene composition
- **THEN** it MUST feature 1-3 visual subjects
- **AND** avoid cluttered backgrounds
- **AND** maintain focus on the activity
- **AND** be appropriate for selected style

#### Scenario: Scene building priority
- **WHEN** adding scene elements
- **THEN** base environment is added first
- **AND** then terrain modifiers
- **AND** then weather effects
- **AND** then time-based lighting
- **AND** then mood-based atmosphere
- **AND** earlier elements take precedence in conflicts

### Requirement: Prompt Assembly
Prompts MUST follow the defined structure and length constraints.

#### Scenario: Prompt structure
- **WHEN** assembling the final prompt
- **THEN** it MUST follow the template structure
- **AND** include style illustration, subject, activity context
- **AND** specify style descriptor, mood, and scene

#### Scenario: Length limit exceeded
- **WHEN** prompt exceeds 400 characters
- **THEN** scene details MUST be truncated first
- **AND** core subject and style MUST always be preserved

### Requirement: Prompt Validation
Generated prompts MUST be validated before returning.

#### Scenario: Successful validation
- **WHEN** validating a prompt
- **THEN** it MUST comply with guardrails
- **AND** style MUST be from allowed set
- **AND** all required fields MUST be populated
- **AND** brand usage MUST be compliant

#### Scenario: Validation failure
- **WHEN** validation fails
- **THEN** system MUST sanitize and retry once
- **AND** if still invalid, MUST use fallback

### Requirement: Fallback Prompt
A safe fallback prompt MUST always be available.

#### Scenario: Fallback activation
- **WHEN** a valid prompt cannot be generated
- **THEN** fallback MUST be used with:
  - Subject: "A simple abstract illustration of an outdoor activity"
  - Style: "minimal"
  - Mood: "calm"
  - Scene: "Neutral outdoor atmosphere with soft colors"

#### Scenario: Fallback guarantees
- **WHEN** using fallback
- **THEN** it MUST be used for any unrecoverable error
- **AND** MUST be used for unsafe or ambiguous activity types
- **AND** MUST comply with all guardrails
- **AND** MUST always produce a valid image

### Requirement: Determinism
The system MUST produce identical outputs for identical inputs.

#### Scenario: Identical input processing
- **WHEN** given identical inputs
- **THEN** system MUST produce identical prompt text
- **AND** identical style selection
- **AND** identical mood selection
- **AND** identical scene composition
- **AND** random variation is NOT allowed

### Requirement: Error Handling
The system MUST handle all errors gracefully.

#### Scenario: Error prevention
- **WHEN** processing any input
- **THEN** system MUST NOT throw exceptions for invalid input
- **AND** MUST NOT return partial results
- **AND** MUST NOT produce empty prompts
- **AND** MUST NOT generate unsafe content

#### Scenario: Error recovery
- **WHEN** any error occurs
- **THEN** it MUST result in fallback behavior
- **AND** always produce a valid output