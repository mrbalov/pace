## ADDED Requirements

### Requirement: Activity Type Classification
The system SHALL classify activities into defined types with appropriate subject and environment descriptions.

#### Scenario: Known activity type - Run
- **WHEN** activity type is "Run"
- **THEN** subject is "runner" and default environment is "outdoor trail"

#### Scenario: Known activity type - Yoga
- **WHEN** activity type is "Yoga"
- **THEN** subject is "person practicing yoga" and default environment is "indoor studio"

#### Scenario: Unknown safe activity type
- **WHEN** activity type is unknown but passes safety review
- **THEN** use generic subject "athlete" or "person exercising"
- **AND** use neutral environment "outdoor setting" or "training area"

#### Scenario: Unsafe or ambiguous activity type
- **WHEN** activity type is unsafe or ambiguous
- **THEN** MUST fall back to generic activity prompt
- **AND** log the unknown type for review

### Requirement: Intensity Classification
The system SHALL classify activity intensity based on multiple signals.

#### Scenario: Tag-based intensity - recovery
- **WHEN** "recovery" or "easy" tag is present
- **THEN** intensity is classified as "low"

#### Scenario: Tag-based intensity - race
- **WHEN** "race" or "workout" tag is present
- **THEN** intensity is classified as "high"

#### Scenario: Heart rate zone intensity
- **WHEN** average heart rate is available and tags absent
- **THEN** use heart rate zones to determine intensity
- **AND** default to "medium" if unclear

#### Scenario: Multiple intensity signals
- **WHEN** multiple intensity signals are present
- **THEN** use priority order: tags, heart rate, pace, elevation, duration
- **AND** first valid signal determines intensity

### Requirement: Elevation Classification
The system SHALL classify terrain based on elevation gain.

#### Scenario: Mountainous terrain
- **WHEN** elevation gain exceeds 300m
- **THEN** classify as "mountainous" or "hilly"

#### Scenario: Rolling terrain
- **WHEN** elevation gain is between 50m and 300m
- **THEN** classify as "rolling" or "moderate"

#### Scenario: Flat terrain
- **WHEN** elevation gain is less than 50m
- **THEN** classify as "flat"

#### Scenario: Missing elevation data
- **WHEN** elevation data is not available
- **THEN** use neutral terrain description

### Requirement: Time-Based Lighting
The system SHALL determine lighting based on activity time.

#### Scenario: Morning activity
- **WHEN** activity occurs between 5:00-11:00
- **THEN** apply "soft, fresh light" to scene

#### Scenario: Evening activity
- **WHEN** activity occurs between 17:00-21:00
- **THEN** apply "warm, golden light" to scene

#### Scenario: Night activity
- **WHEN** activity occurs between 21:00-5:00
- **THEN** apply "dark, dramatic atmosphere" to scene

#### Scenario: Unknown time
- **WHEN** time data is unavailable
- **THEN** use neutral daylight

### Requirement: Weather Influence
Weather conditions SHALL influence scene composition through lighting, elements, and mood.

#### Scenario: Sunny weather processing
- **WHEN** weather is sunny
- **THEN** add bright, clear, high contrast lighting
- **AND** include clear skies and defined shadows
- **AND** apply energetic, positive mood

#### Scenario: Rainy weather processing
- **WHEN** weather is rainy
- **THEN** add wet surfaces, reflections, dim lighting
- **AND** include rain effects and puddles
- **AND** apply contemplative, persistent mood

#### Scenario: Weather conflict with indoor activity
- **WHEN** weather is specified but activity is indoor
- **THEN** weather MUST be ignored
- **AND** indoor environment takes precedence

#### Scenario: Unknown weather
- **WHEN** weather data is unavailable
- **THEN** default to neutral atmosphere

### Requirement: Tag to Scene Mapping
Tags SHALL be processed to influence mood, intensity, and scene composition.

#### Scenario: Long run tag processing
- **WHEN** "long run" tag is present
- **THEN** mood becomes "determined" with medium intensity
- **AND** scene includes endurance-focused elements

#### Scenario: With kid tag processing
- **WHEN** "with kid" tag is present
- **THEN** mood becomes "playful" with low intensity
- **AND** scene includes family-friendly elements

#### Scenario: Unrecognized tag processing
- **WHEN** unrecognized tag is encountered
- **THEN** perform safety check first
- **AND** extract safe semantic signals if possible
- **OR** ignore tag completely if no safe signal

### Requirement: Deterministic Style Selection
Style selection SHALL be deterministic based on activity characteristics.

#### Scenario: High intensity athletic activity
- **WHEN** intensity is high AND activity is Run/Ride/Trail Run
- **THEN** select "illustrated" style

#### Scenario: Recovery activity
- **WHEN** tags contain "recovery" OR "easy"
- **THEN** select "minimal" style

#### Scenario: High elevation activity
- **WHEN** elevation exceeds 500m
- **THEN** select "illustrated" style

#### Scenario: Foggy weather
- **WHEN** weather is foggy
- **THEN** select "abstract" style

#### Scenario: Default style
- **WHEN** no specific conditions match
- **THEN** select "cartoon" style

### Requirement: Mood Selection
The system SHALL select appropriate moods aligned with activity signals.

#### Scenario: Calm mood selection
- **WHEN** intensity is low or recovery tag present
- **THEN** select mood from "calm", "peaceful", "serene"

#### Scenario: Intense mood selection
- **WHEN** intensity is high or race tag present
- **THEN** select mood from "intense", "powerful", "explosive"

#### Scenario: Mood conflict resolution
- **WHEN** multiple mood signals conflict
- **THEN** resolve by priority: tags, intensity, weather, time, duration

### Requirement: Scene Composition
Scenes SHALL be composed with appropriate environment, terrain, lighting, and weather.

#### Scenario: Complete scene building
- **WHEN** composing a scene
- **THEN** add base environment from activity type
- **AND** add terrain modifiers from elevation
- **AND** add weather effects if specified
- **AND** add time-based lighting
- **AND** add mood-based atmosphere

#### Scenario: Scene element conflicts
- **WHEN** scene elements conflict
- **THEN** earlier elements in build order take precedence
- **AND** maintain focus on the activity

#### Scenario: Visual subject limits
- **WHEN** composing scene
- **THEN** include 1-3 primary visual subjects
- **AND** avoid cluttered backgrounds
- **AND** ensure appropriate for selected style

### Requirement: Prompt Assembly
The system SHALL assemble prompts following a defined structure and constraints.

#### Scenario: Standard prompt assembly
- **WHEN** assembling a prompt
- **THEN** follow template: "A [style] illustration of a [subject] [activity_context]. Style: [style_descriptor]. Mood: [mood]. Scene: [environment] with [scene_details]."

#### Scenario: Prompt length exceeded
- **WHEN** assembled prompt exceeds 400 characters
- **THEN** truncate scene details first
- **AND** preserve core subject and style

### Requirement: Output Contract
Prompt generation SHALL return all required fields with valid content.

#### Scenario: Complete output
- **WHEN** prompt generation completes
- **THEN** return Subject, Style, Mood, and Scene fields
- **AND** all fields MUST be non-empty

#### Scenario: Output validation
- **WHEN** validating output
- **THEN** ensure prompt complies with guardrails
- **AND** style is from allowed set
- **AND** all fields are populated

### Requirement: Fallback Prompt
The system SHALL provide a safe fallback prompt for any failure condition.

#### Scenario: Fallback activation
- **WHEN** valid prompt cannot be generated
- **THEN** use fallback: "A simple abstract illustration of an outdoor activity"
- **AND** style: "Minimal", mood: "Calm", scene: "Neutral outdoor atmosphere with soft colors"

#### Scenario: Fallback safety
- **WHEN** fallback is used
- **THEN** it MUST comply with all guardrails
- **AND** always produce a valid image
- **AND** be used for any unrecoverable error

### Requirement: Error Handling
The system SHALL handle all errors gracefully without exceptions.

#### Scenario: Invalid input handling
- **WHEN** invalid input is provided
- **THEN** MUST NOT throw exceptions
- **AND** MUST NOT return partial results
- **AND** activate fallback behavior

#### Scenario: Processing error
- **WHEN** error occurs during processing
- **THEN** MUST NOT produce empty prompts
- **AND** MUST NOT generate unsafe content
- **AND** result in fallback behavior