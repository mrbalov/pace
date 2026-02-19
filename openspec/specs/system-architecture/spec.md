# System Architecture Requirements

## Purpose

Define architectural requirements for the TORQ system's modular architecture to ensure robust, deterministic, and safe image generation from Strava activity data.

## Requirements

### Requirement: Core Functionality Pipeline

The system SHALL operate as a rule-based, deterministic pipeline that ingests Strava activity data via the Strava API, extracts semantic signals from activity metadata, generates text prompts following strict safety and content guardrails, creates artistic images using AI image generation models, and validates outputs to ensure compliance with all system constraints.

#### Scenario: Complete activity processing pipeline
- **GIVEN** a Strava activity ID from a webhook
- **WHEN** the system processes the activity
- **THEN** the system SHALL ingest activity data, extract signals, generate prompts, create images, and validate outputs in sequence

#### Scenario: Deterministic pipeline behavior
- **GIVEN** identical activity inputs
- **WHEN** the system processes the activities
- **THEN** the pipeline SHALL produce deterministic results

### Requirement: Primary Data Flow

The system SHALL process activities through the following sequence: Activity fetches data from Strava API, Activity Guardrails validates raw activity data, Activity Signals extracts semantic signals, Activity Prompt Generation creates image prompts, Activity Guardrails validates prompts, and Image Generation produces final output.

#### Scenario: Successful activity processing flow
- **GIVEN** a valid activity ID from Strava webhook
- **WHEN** the system processes the activity
- **THEN** each module SHALL be invoked in sequence: Activity → Activity Guardrails → Activity Signals → Activity Prompt Generation → Activity Guardrails → Image Generation

#### Scenario: Module dependency enforcement
- **GIVEN** an activity being processed
- **WHEN** modules interact
- **THEN** modules SHALL only communicate through defined interfaces and follow dependency relationships

#### Scenario: Error flow handling
- **GIVEN** a module failure during processing
- **WHEN** an error occurs
- **THEN** error logging SHALL be triggered, fallback mechanisms SHALL activate, and the system SHALL return a safe default output

### Requirement: Module Orchestration

The system SHALL consist of five core modules: Activity Guardrails, Activity, Activity Signals, Activity Prompt Generation, and Image Generation. Each module SHALL have a single responsibility and communicate through well-defined interfaces.

#### Scenario: Activity Guardrails independence
- **GIVEN** the Activity Guardrails module
- **WHEN** validating content
- **THEN** the module SHALL operate independently without dependencies on other modules

#### Scenario: Activity integration
- **GIVEN** the Activity module
- **WHEN** fetching activity data
- **THEN** the module SHALL depend on Activity Guardrails for validation and SHALL fetch data from Strava API

#### Scenario: Activity Signals extraction
- **GIVEN** the Activity Signals module
- **WHEN** extracting signals from activity data
- **THEN** the module SHALL depend on Activity Guardrails for validation and SHALL produce normalized semantic signals

#### Scenario: Activity Prompt Generation composition
- **GIVEN** the Activity Prompt Generation module
- **WHEN** generating prompts
- **THEN** the module SHALL depend on Activity Signals for input and Activity Guardrails for validation

#### Scenario: Image Generation execution
- **GIVEN** the Image Generation module
- **WHEN** generating images
- **THEN** the module SHALL depend on Activity Prompt Generation for prompts and SHALL submit requests to external AI image generation API

### Requirement: Supported Activity Types

The system SHALL support all Strava activity types including but not limited to: Running (Run, Trail Run, Virtual Run), Cycling (Ride, Virtual Ride, E-Bike Ride), Water activities (Swim, Surfing, Canoeing, Kayaking), Winter activities (Alpine Ski, Backcountry Ski, Nordic Ski, Snowboard), Fitness activities (Workout, Yoga, Weight Training, CrossFit), Walking activities (Walk, Hike), and other activities (Rock Climbing, Golf, Soccer, Tennis, and more).

#### Scenario: Running activity support
- **GIVEN** a Run, Trail Run, or Virtual Run activity
- **WHEN** the system processes the activity
- **THEN** the system SHALL successfully extract signals and generate appropriate images

#### Scenario: Cycling activity support
- **GIVEN** a Ride, Virtual Ride, or E-Bike Ride activity
- **WHEN** the system processes the activity
- **THEN** the system SHALL successfully extract signals and generate appropriate images

#### Scenario: Water activity support
- **GIVEN** a Swim, Surfing, Canoeing, or Kayaking activity
- **WHEN** the system processes the activity
- **THEN** the system SHALL successfully extract signals and generate appropriate images

#### Scenario: Winter activity support
- **GIVEN** an Alpine Ski, Backcountry Ski, Nordic Ski, or Snowboard activity
- **WHEN** the system processes the activity
- **THEN** the system SHALL successfully extract signals and generate appropriate images

#### Scenario: Fitness activity support
- **GIVEN** a Workout, Yoga, Weight Training, or CrossFit activity
- **WHEN** the system processes the activity
- **THEN** the system SHALL successfully extract signals and generate appropriate images

#### Scenario: Walking activity support
- **GIVEN** a Walk or Hike activity
- **WHEN** the system processes the activity
- **THEN** the system SHALL successfully extract signals and generate appropriate images

### Requirement: Activity Signal Processing

The system SHALL process multiple data points to create contextually appropriate images. User text (activity names, descriptions, tags) SHALL undergo semantic extraction. Only normalized, safe signals SHALL influence image generation. Brand names MAY be used contextually when originating from activity data.

#### Scenario: Signal extraction from user text
- **GIVEN** an activity with user-provided text in name, description, or tags
- **WHEN** extracting signals
- **THEN** the system SHALL process the text through semantic extraction and produce normalized signals

#### Scenario: Normalized signals influence generation
- **GIVEN** extracted activity signals
- **WHEN** generating images
- **THEN** only normalized, safe signals SHALL influence image generation

#### Scenario: Brand name contextual usage
- **GIVEN** an activity with brand information from gear metadata or activity name
- **WHEN** processing signals
- **THEN** brand names MAY be used contextually in image generation

#### Scenario: Intensity classification
- **GIVEN** activity data with performance metrics
- **WHEN** classifying intensity
- **THEN** the system SHALL classify activities as Low (recovery, easy, relaxed), Medium (steady, focused, moderate), or High (intense, demanding, race-level)

#### Scenario: Environmental context extraction
- **GIVEN** activity data with elevation, time, weather, or location information
- **WHEN** extracting environmental context
- **THEN** the system SHALL extract elevation (flat, rolling, mountainous), time of day (morning, daylight, evening, night), weather when available, and location (country/region) for appropriate scenery

#### Scenario: Semantic tag influence
- **GIVEN** an activity with Strava tags
- **WHEN** processing tags
- **THEN** tags SHALL influence mood and scene composition (e.g., recovery → calm mood, race → competitive energy, with kid → playful atmosphere)

### Requirement: Activity Prompt Generation Pipeline

The system SHALL generate prompts through the following steps: Input Validation (ensure required fields present), Signal Extraction (process user text safely), Classification (determine activity type, intensity, environment), Style Selection (choose appropriate visual style deterministically), Mood Mapping (align emotional tone with activity characteristics), Scene Composition (build environment and atmosphere), Prompt Assembly (construct text prompt ≤ 600  characters), Validation (ensure compliance with guardrails), and Fallback (use safe defaults if validation fails).

#### Scenario: Complete prompt generation pipeline
- **GIVEN** extracted activity signals
- **WHEN** generating a prompt
- **THEN** the system SHALL execute all pipeline steps: validation, extraction, classification, style selection, mood mapping, scene composition, assembly, validation, and fallback if needed

#### Scenario: Prompt size limit enforcement
- **GIVEN** a prompt being assembled
- **WHEN** constructing the prompt text
- **THEN** the prompt SHALL not exceed 600 characters

#### Scenario: Deterministic style selection
- **GIVEN** identical activity classifications
- **WHEN** selecting visual style
- **THEN** style selection SHALL be deterministic

#### Scenario: Fallback prompt usage
- **GIVEN** prompt validation failure
- **WHEN** validation fails
- **THEN** the system SHALL use safe default prompts

### Requirement: Module Interface Contracts

Each module SHALL expose a well-defined TypeScript interface. Modules SHALL communicate only through these interfaces. Dependencies SHALL be explicit and injected.

#### Scenario: Activity Guardrails interface
- **GIVEN** the Activity Guardrails module
- **WHEN** accessing the module
- **THEN** the module SHALL expose `validateActivity`, `validateActivitySignals`, and `validateActivityImagePrompt` methods

#### Scenario: Activity interface
- **GIVEN** the Activity module
- **WHEN** accessing the module
- **THEN** the module SHALL expose `fetchActivity` method that accepts activity ID and returns Promise<Activity>

#### Scenario: Activity Signals interface
- **GIVEN** the Activity Signals module
- **WHEN** accessing the module
- **THEN** the module SHALL expose `getSignals` method that accepts Activity and returns Promise<ActivitySignals>

#### Scenario: Activity Prompt Generation interface
- **GIVEN** the Activity Prompt Generation module
- **WHEN** accessing the module
- **THEN** the module SHALL expose `generatePrompt` and `getFallbackPrompt` methods

#### Scenario: Image Generation interface
- **GIVEN** the Image Generation module
- **WHEN** accessing the module
- **THEN** the module SHALL expose `generateImage` and `regenerateWithFallback` methods

### Requirement: Strava API Integration

The system SHALL integrate with the Strava API to fetch activity data. The system SHALL authenticate with Strava API using OAuth2. The system SHALL fetch complete activity details via the Get Activity API endpoint. The system SHALL handle API responses and transform them to internal format.

#### Scenario: Activity data fetching
- **GIVEN** a valid activity ID and authenticated Strava API access
- **WHEN** fetching activity data
- **THEN** the system SHALL call GET /activities/{activityId} and receive complete activity details

#### Scenario: API response transformation
- **GIVEN** a Strava API response
- **WHEN** processing the response
- **THEN** the system SHALL transform the response to internal Activity format

#### Scenario: Authentication handling
- **GIVEN** a request requiring Strava API access
- **WHEN** making API calls
- **THEN** the system SHALL authenticate using OAuth2 and include required permissions (activity:read or activity:read_all)

### Requirement: Error Handling and Resilience

The system SHALL implement multiple layers of resilience. Retry logic SHALL allow maximum 2 retries with prompt simplification. Fallback prompts SHALL provide safe, minimal defaults when generation fails. The system SHALL prefer graceful degradation over complete failure. User-facing errors SHALL be handled gracefully. The system SHALL never return empty or corrupted results.

#### Scenario: Retry with prompt simplification
- **GIVEN** an image generation failure
- **WHEN** retrying generation
- **THEN** the system SHALL retry up to 2 times and simplify the prompt on each retry

#### Scenario: Fallback prompt usage
- **GIVEN** all retries have failed
- **WHEN** applying fallback
- **THEN** the system SHALL use safe, minimal default prompts

#### Scenario: Graceful degradation
- **GIVEN** a partial failure in the pipeline
- **WHEN** handling the failure
- **THEN** the system SHALL prefer partial success over complete failure

#### Scenario: Always valid output
- **GIVEN** any failure scenario
- **WHEN** returning results
- **THEN** the system SHALL never return empty, corrupted, or invalid results

### Requirement: Determinism and Predictability

Given identical inputs, the system SHALL produce identical classification and style decisions. Randomness SHALL be bounded and controlled. Behavior SHALL be predictable and reproducible.

#### Scenario: Identical inputs produce identical outputs
- **GIVEN** identical activity inputs
- **WHEN** processing the activities
- **THEN** classification and style decisions SHALL be identical

#### Scenario: Bounded randomness
- **GIVEN** an activity requiring image generation
- **WHEN** applying randomness
- **THEN** randomness SHALL be bounded and controlled

#### Scenario: Reproducible behavior
- **GIVEN** the same activity processed multiple times
- **WHEN** comparing results
- **THEN** behavior SHALL be predictable and reproducible
