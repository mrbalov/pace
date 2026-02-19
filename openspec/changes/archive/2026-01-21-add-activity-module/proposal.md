# Change: Add Activity Module Specification

## Why

The Activity module is a core component of the TORQ system architecture, responsible for Strava API integration and activity data retrieval. While the module is defined in the system architecture specification, it currently lacks a formal OpenSpec specification that defines its detailed requirements, behaviors, and integration patterns.

The system operates on a webhook-based trigger model: when a user uploads a new activity to Strava, Strava sends a webhook notification to the system containing the activity ID. The Activity module then receives this activity ID and fetches the complete activity details from the Strava API. This webhook-to-fetch flow is the entry point for all activity processing in the system.

Without a formal specification, implementation of the Activity module would be ambiguous, making it difficult to:
- Ensure consistent behavior across implementations
- Validate correctness against requirements
- Integrate properly with dependent modules (Activity Guardrails, Activity Signals)
- Handle error cases and edge conditions appropriately
- Maintain compliance with Strava API constraints and rate limits
- Understand the webhook-to-API-fetch flow that initiates the entire pipeline

## What Changes

This change adds a new OpenSpec specification for the Activity module capability:

- **New specification**: `openspec/specs/activity/spec.md` defining comprehensive requirements for:
  - System trigger flow: Receiving activity ID from Strava webhook and initiating data fetch
  - Strava API authentication using OAuth2
  - Activity data fetching via GET /activities/{activityId} endpoint
  - Response transformation to internal Activity format
  - Error handling for API, network, and validation failures
  - Rate limiting and retry strategies
  - Integration with Activity Guardrails module
  - Security requirements for token and credential management

**System Trigger Flow**: The specification clarifies that the Activity module receives activity IDs from Strava webhook notifications. When a user uploads a new activity to Strava, Strava sends a webhook to the system containing the activity ID. The Activity module's `fetchActivity` method is then invoked with this activity ID to retrieve the complete activity data from the Strava API, initiating the entire activity processing pipeline (Activity → Activity Guardrails → Activity Signals → Activity Prompt Generation → Image Generation).

## Impact

- **Affected specs**: None (new capability)
- **Affected code**: Future implementation of Activity module package
- **Dependencies**: 
  - References Activity Guardrails module (guardrails-activity-data spec)
  - Aligns with system-architecture spec requirements
- **Breaking changes**: None (new specification)
