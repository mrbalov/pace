# System Architecture Requirements

## Purpose

Define architectural requirements for the PACE system's service-oriented architecture to ensure robust, deterministic, and safe image generation from Strava activity data.

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

The system SHALL process activities through the following sequence: Activity Service fetches data from Strava API, Guardrails Service validates raw activity data, Activity Signals Service extracts semantic signals, Prompt Generation Service creates image prompts, Guardrails Service validates prompts, and Image Generation Service produces final output.

#### Scenario: Successful activity processing flow
- **GIVEN** a valid activity ID from Strava webhook
- **WHEN** the system processes the activity
- **THEN** each service SHALL be invoked in sequence: Activity Service → Guardrails Service → Activity Signals Service → Prompt Generation Service → Guardrails Service → Image Generation Service

#### Scenario: Service dependency enforcement
- **GIVEN** an activity being processed
- **WHEN** services interact
- **THEN** services SHALL only communicate through defined interfaces and follow dependency relationships

#### Scenario: Error flow handling
- **GIVEN** a service failure during processing
- **WHEN** an error occurs
- **THEN** error logging SHALL be triggered, fallback mechanisms SHALL activate, and the system SHALL return a safe default output

### Requirement: Service Orchestration

The system SHALL consist of five core services: Guardrails Service, Activity Service, Activity Signals Service, Prompt Generation Service, and Image Generation Service. Each service SHALL have a single responsibility and communicate through well-defined interfaces.

#### Scenario: Guardrails Service independence
- **GIVEN** the Guardrails Service
- **WHEN** validating content
- **THEN** the service SHALL operate independently without dependencies on other services

#### Scenario: Activity Service integration
- **GIVEN** the Activity Service
- **WHEN** fetching activity data
- **THEN** the service SHALL depend on Guardrails Service for validation and SHALL fetch data from Strava API

#### Scenario: Activity Signals Service extraction
- **GIVEN** the Activity Signals Service
- **WHEN** extracting signals from activity data
- **THEN** the service SHALL depend on Guardrails Service for validation and SHALL produce normalized semantic signals

#### Scenario: Prompt Generation Service composition
- **GIVEN** the Prompt Generation Service
- **WHEN** generating prompts
- **THEN** the service SHALL depend on Activity Signals Service for input and Guardrails Service for validation

#### Scenario: Image Generation Service execution
- **GIVEN** the Image Generation Service
- **WHEN** generating images
- **THEN** the service SHALL depend on Prompt Generation Service for prompts and SHALL submit requests to external AI image generation API

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

### Requirement: Prompt Generation Pipeline

The system SHALL generate prompts through the following steps: Input Validation (ensure required fields present), Signal Extraction (process user text safely), Classification (determine activity type, intensity, environment), Style Selection (choose appropriate visual style deterministically), Mood Mapping (align emotional tone with activity characteristics), Scene Composition (build environment and atmosphere), Prompt Assembly (construct text prompt ≤400 characters), Validation (ensure compliance with guardrails), and Fallback (use safe defaults if validation fails).

#### Scenario: Complete prompt generation pipeline
- **GIVEN** extracted activity signals
- **WHEN** generating a prompt
- **THEN** the system SHALL execute all pipeline steps: validation, extraction, classification, style selection, mood mapping, scene composition, assembly, validation, and fallback if needed

#### Scenario: Prompt size limit enforcement
- **GIVEN** a prompt being assembled
- **WHEN** constructing the prompt text
- **THEN** the prompt SHALL not exceed 400 characters

#### Scenario: Deterministic style selection
- **GIVEN** identical activity classifications
- **WHEN** selecting visual style
- **THEN** style selection SHALL be deterministic

#### Scenario: Fallback prompt usage
- **GIVEN** prompt validation failure
- **WHEN** validation fails
- **THEN** the system SHALL use safe default prompts

### Requirement: Service Interface Contracts

Each service SHALL expose a well-defined TypeScript interface. Services SHALL communicate only through these interfaces. Dependencies SHALL be explicit and injected.

#### Scenario: Guardrails Service interface
- **GIVEN** the Guardrails Service
- **WHEN** accessing the service
- **THEN** the service SHALL expose `validateActivity`, `validateActivitySignals`, and `validateActivityImagePrompt` methods

#### Scenario: Activity Service interface
- **GIVEN** the Activity Service
- **WHEN** accessing the service
- **THEN** the service SHALL expose `fetchActivity` method that accepts activity ID and returns Promise<Activity>

#### Scenario: Activity Signals Service interface
- **GIVEN** the Activity Signals Service
- **WHEN** accessing the service
- **THEN** the service SHALL expose `getSignals` method that accepts Activity and returns Promise<ActivitySignals>

#### Scenario: Prompt Generation Service interface
- **GIVEN** the Prompt Generation Service
- **WHEN** accessing the service
- **THEN** the service SHALL expose `generatePrompt` and `getFallbackPrompt` methods

#### Scenario: Image Generation Service interface
- **GIVEN** the Image Generation Service
- **WHEN** accessing the service
- **THEN** the service SHALL expose `generateImage` and `regenerateWithFallback` methods

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