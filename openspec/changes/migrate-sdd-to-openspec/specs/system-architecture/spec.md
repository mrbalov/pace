## ADDED Requirements

### Requirement: Service-Oriented Architecture
The system SHALL be designed as a modular, service-oriented architecture with clear separation of concerns.

#### Scenario: Service boundaries
- **WHEN** implementing system functionality
- **THEN** each service has one clear purpose
- **AND** services communicate through well-defined interfaces
- **AND** related functionality is grouped together

#### Scenario: Dependency injection
- **WHEN** a service requires another service
- **THEN** dependencies are explicit and injected
- **AND** no implicit dependencies exist

#### Scenario: Service isolation
- **WHEN** testing a service
- **THEN** it can be tested in isolation with mocked dependencies
- **AND** failures in one service don't cascade to others

### Requirement: Core Services
The system SHALL implement five core services with defined responsibilities.

#### Scenario: Guardrails Service
- **WHEN** content needs validation
- **THEN** Guardrails Service validates against forbidden lists
- **AND** checks for prohibited patterns
- **AND** sanitizes input and output
- **AND** has no dependencies on other services

#### Scenario: Activity Service
- **WHEN** Strava activity data is needed
- **THEN** Activity Service authenticates with Strava API
- **AND** fetches activity data
- **AND** transforms responses to internal format
- **AND** depends on Guardrails Service for validation

#### Scenario: Activity Signals Service
- **WHEN** semantic signals need extraction
- **THEN** Activity Signals Service parses user text safely
- **AND** extracts signals from Strava data
- **AND** depends on Guardrails Service for validation

#### Scenario: Prompt Generation Service
- **WHEN** image prompt is needed
- **THEN** Prompt Generation Service applies generation rules
- **AND** selects appropriate style
- **AND** composes scene descriptions
- **AND** depends on Activity Signals and Guardrails Services

#### Scenario: Image Generation Service
- **WHEN** image needs to be generated
- **THEN** Image Generation Service submits prompts to external API
- **AND** handles generation retries
- **AND** manages rate limiting
- **AND** depends on Prompt Generation Service

### Requirement: Service Dependency Rules
Services SHALL follow strict dependency rules preventing circular dependencies.

#### Scenario: Valid dependency chain
- **WHEN** Image Generation Service needs a prompt
- **THEN** it depends on Prompt Generation Service
- **AND** which depends on Activity Signals Service
- **AND** which depends on Guardrails Service
- **AND** no circular dependencies exist

#### Scenario: Guardrails Service independence
- **WHEN** any service needs validation
- **THEN** it can depend on Guardrails Service
- **AND** Guardrails Service has no dependencies
- **AND** preventing circular dependency issues

### Requirement: Data Flow
The system SHALL process data through a defined flow from webhook to image generation.

#### Scenario: Primary data flow
- **WHEN** Strava webhook triggers with activity ID
- **THEN** Activity Service fetches activity from Strava API
- **AND** Guardrails Service validates raw activity data
- **AND** Activity Signals Service extracts semantic signals
- **AND** Prompt Generation Service creates image prompt
- **AND** Guardrails Service validates prompt
- **AND** Image Generation Service generates image
- **AND** generated image URL is shared with requestor

#### Scenario: Error flow
- **WHEN** any service fails
- **THEN** error is logged with context
- **AND** fallback mechanisms activate for persistent failures
- **AND** system returns safe default output

### Requirement: Service Interfaces
Each service SHALL expose a well-defined TypeScript interface.

#### Scenario: Guardrails Service interface
- **WHEN** defining Guardrails Service
- **THEN** it exposes validateActivity, validateActivitySignals, validateActivityImagePrompt methods
- **AND** each returns ValidationResult

#### Scenario: Activity Service interface
- **WHEN** defining Activity Service
- **THEN** it exposes fetchActivity method
- **AND** returns Promise<Activity>

#### Scenario: Activity Signals Service interface
- **WHEN** defining Activity Signals Service
- **THEN** it exposes getSignals method
- **AND** returns Promise<ActivitySignals>

#### Scenario: Prompt Generation Service interface
- **WHEN** defining Prompt Generation Service
- **THEN** it exposes generatePrompt and getFallbackPrompt methods
- **AND** returns ActivityImagePrompt

#### Scenario: Image Generation Service interface
- **WHEN** defining Image Generation Service
- **THEN** it exposes generateImage and regenerateWithFallback methods
- **AND** returns Promise<ActivityImage>

### Requirement: User Journey
The system SHALL support a complete user journey from activity upload to image generation.

#### Scenario: Complete user journey
- **WHEN** user uploads activity to Strava
- **THEN** Strava triggers the image-generating system
- **AND** system provides user with AI-generated image
- **AND** user can upload AI-generated image back to Strava

### Requirement: Testing Strategy
The system SHALL implement comprehensive testing at multiple levels.

#### Scenario: Unit testing requirements
- **WHEN** testing individual services
- **THEN** each service is tested in isolation
- **AND** dependencies are mocked
- **AND** 100% coverage for critical paths
- **AND** edge cases and error conditions are covered

#### Scenario: Integration testing requirements
- **WHEN** testing service interactions
- **THEN** verify data flow between services
- **AND** test error propagation
- **AND** validate service contracts

#### Scenario: End-to-end testing requirements
- **WHEN** testing complete system
- **THEN** validate complete flow from webhook to image
- **AND** test failure scenarios
- **AND** verify fallback mechanisms

### Requirement: Deployment Architecture
The system SHALL be deployable with proper packaging and configuration.

#### Scenario: Service packaging
- **WHEN** packaging services for deployment
- **THEN** each module is a separate package
- **AND** with clear version management
- **AND** explicit dependency declaration
- **AND** automated build process

#### Scenario: Configuration management
- **WHEN** deploying to different environments
- **THEN** use environment-specific configurations
- **AND** implement proper secret management
- **AND** separate config from code

#### Scenario: Scalability design
- **WHEN** designing for scale
- **THEN** services are stateless
- **AND** support horizontal scaling
- **AND** implement rate limiting
- **AND** handle concurrent requests

### Requirement: Compliance
The architecture SHALL comply with all specification levels.

#### Scenario: Specification compliance
- **WHEN** implementing the architecture
- **THEN** it MUST comply with Zero Specification requirements
- **AND** follow Level 1 Guardrails
- **AND** implement all domain specifications
- **AND** follow security best practices

### Requirement: Extensibility
The architecture SHALL support future extensions without major refactoring.

#### Scenario: Adding new activity types
- **WHEN** new activity type support is needed
- **THEN** it can be added without changing core architecture
- **AND** only Activity Signals and Prompt Generation need updates

#### Scenario: Adding new image styles
- **WHEN** new image style is needed
- **THEN** it can be added to allowed styles
- **AND** Prompt Generation Service handles new style

#### Scenario: Multiple AI providers
- **WHEN** supporting multiple AI image providers
- **THEN** Image Generation Service can be extended
- **AND** with provider abstraction layer
- **AND** without changing other services

#### Scenario: Batch processing
- **WHEN** batch processing is needed
- **THEN** architecture supports adding batch endpoints
- **AND** services remain stateless
- **AND** existing single-item flow unchanged