# Spec Validation Pipeline

## Purpose

Define requirements for the GitHub Actions CI/CD pipeline that validates OpenSpec specifications using both static OpenSpec tooling and AI-assisted validation, ensuring specifications comply with OpenSpec rules and maintain consistency across the specification set.

## Requirements

### Requirement: Static OpenSpec Validation Workflow

The system SHALL provide a GitHub Actions workflow that validates specifications using the OpenSpec CLI tool. The workflow SHALL trigger on pushes to the main branch when OpenSpec-related files change, and SHALL be manually triggerable. The workflow SHALL run on ubuntu-latest runners, install dependencies, execute OpenSpec validation, parse results, render summaries, and expose validation results as outputs.

#### Scenario: Workflow trigger on OpenSpec changes
- **GIVEN** a push to the main branch
- **WHEN** files in openspec/**, packages/validate-specs/validate-specs-with-openspec/**, or .github/workflows/validate-specs-with-openspec.yml are modified
- **THEN** the static OpenSpec validation workflow SHALL trigger

#### Scenario: Manual workflow trigger
- **GIVEN** a GitHub Actions workflow_dispatch event
- **WHEN** the static OpenSpec validation workflow is manually triggered
- **THEN** the workflow SHALL execute validation

#### Scenario: Workflow environment setup
- **GIVEN** the static OpenSpec validation workflow is triggered
- **WHEN** the workflow executes
- **THEN** the workflow SHALL checkout the repository, setup Node.js version 24, setup Bun latest version, ensure jq is available, and install dependencies using bun install

#### Scenario: OpenSpec validation execution
- **GIVEN** the workflow environment is set up
- **WHEN** executing validation
- **THEN** the workflow SHALL run the OpenSpec validation script and write results to .specs-validation/openspec/result.json

#### Scenario: Validation result parsing
- **GIVEN** validation results are available
- **WHEN** parsing the results
- **THEN** the workflow SHALL extract success status, exit code, total items, passed count, and failed count from the JSON result

#### Scenario: Validation summary rendering
- **GIVEN** validation results are parsed
- **WHEN** rendering the summary
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing status, total items, passed count, and failed count

#### Scenario: Validation failures rendering
- **GIVEN** validation failures exist
- **WHEN** rendering failures
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing spec ID, level, and message for each failed validation item

#### Scenario: Validation result exposure
- **GIVEN** validation results are available
- **WHEN** exposing results as outputs
- **THEN** the workflow SHALL base64-encode the validation summary JSON and expose it as validation-summary-json output

#### Scenario: Validation failure reporting
- **GIVEN** validation status is false
- **WHEN** reporting the failure
- **THEN** the workflow SHALL exit with code 1 and display a message indicating OpenSpec validation failed

### Requirement: AI-Assisted Validation Workflow

The system SHALL provide a GitHub Actions workflow that validates specifications using AI-based validation. The workflow SHALL trigger on pushes to the main branch when OpenSpec-related files change, and SHALL be manually triggerable. The workflow SHALL run on self-hosted runners, detect changed spec files, validate changed specs or all specs, parse results, render summaries, and expose validation results as outputs.

#### Scenario: Workflow trigger on OpenSpec changes
- **GIVEN** a push to the main branch
- **WHEN** files in openspec/**, packages/validate-specs/validate-specs-with-ai, or .github/workflows/validate-specs-with-ai.yml are modified
- **THEN** the AI-assisted validation workflow SHALL trigger

#### Scenario: Manual AI workflow trigger
- **GIVEN** a GitHub Actions workflow_dispatch event
- **WHEN** the AI-assisted validation workflow is manually triggered
- **THEN** the workflow SHALL execute validation

#### Scenario: AI workflow environment setup
- **GIVEN** the AI-assisted validation workflow is triggered
- **WHEN** the workflow executes
- **THEN** the workflow SHALL checkout the repository with full history, setup Node.js version 24, setup Bun latest version, ensure jq is available, and install dependencies using bun install

#### Scenario: Changed spec files detection
- **GIVEN** the workflow is executing
- **WHEN** detecting changed spec files
- **THEN** the workflow SHALL compare against the base commit (github.event.before or HEAD~1), filter for openspec/**/*.spec.md files, and output spec_paths and has_changed_specs flags

#### Scenario: Changed specs validation
- **GIVEN** changed spec files are detected
- **WHEN** validating specifications
- **THEN** the workflow SHALL validate only the changed spec files using the validate-specs:ai script with --specFilePaths parameter

#### Scenario: All specs validation
- **GIVEN** no changed spec files are detected
- **WHEN** validating specifications
- **THEN** the workflow SHALL validate all specifications using the validate-specs:ai script with --rootDir parameter

#### Scenario: AI validation prompt usage
- **GIVEN** the AI validation script is executing
- **WHEN** running validation
- **THEN** the workflow SHALL use prompts/validate-specs.system.md as system prompt and prompts/validate-specs.user.md as user prompt

#### Scenario: AI validation output sanitization
- **GIVEN** AI validation produces raw output
- **WHEN** processing the output
- **THEN** the workflow SHALL strip Bun prefixes, remove "Exited with code" lines, and extract valid JSON to .specs-validation/ai/result.json

#### Scenario: AI validation result parsing
- **GIVEN** AI validation results are available
- **WHEN** parsing the results
- **THEN** the workflow SHALL extract result (VALID or INVALID), violation count, and notes count from the JSON result

#### Scenario: AI validation summary rendering
- **GIVEN** AI validation results are parsed
- **WHEN** rendering the summary
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing result, violation count, and notes count if present

#### Scenario: AI validation violations rendering
- **GIVEN** validation result is INVALID
- **WHEN** rendering violations
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing spec ID, rule, and description for each violation

#### Scenario: AI validation result exposure
- **GIVEN** AI validation results are available
- **WHEN** exposing results as outputs
- **THEN** the workflow SHALL base64-encode the validation summary JSON and expose it as validation-summary-json output

#### Scenario: AI validation execution error handling
- **GIVEN** validation script execution fails
- **WHEN** handling the error
- **THEN** the workflow SHALL create a valid error JSON response with result INVALID and notes describing the execution failure

#### Scenario: AI validation pipeline failure
- **GIVEN** validation status is INVALID
- **WHEN** finalizing the workflow
- **THEN** the finally job SHALL exit with code 1 and display a message indicating specs validation failed

### Requirement: Approval Gate for AI Fixes

The system SHALL require manual approval before automatically fixing specification validation failures using AI. The approval gate SHALL trigger when validation fails, require approval from the fix-specs-with-ai-approval environment, and only proceed to fix execution after approval is granted.

#### Scenario: Approval gate trigger on OpenSpec validation failure
- **GIVEN** static OpenSpec validation fails
- **WHEN** validation status is false
- **THEN** the fix-specs-with-ai-approval job SHALL trigger and wait for approval from the fix-specs-with-ai-approval environment

#### Scenario: Approval gate trigger on AI validation failure
- **GIVEN** AI-assisted validation fails
- **WHEN** validation status is INVALID
- **THEN** the fix-specs-with-ai-approval job SHALL trigger and wait for approval from the fix-specs-with-ai-approval environment

#### Scenario: Fix workflow execution after approval
- **GIVEN** approval is granted
- **WHEN** the fix-specs-with-ai job executes
- **THEN** the workflow SHALL call the fix-specs-with-ai.yml reusable workflow with the validation summary JSON

### Requirement: Automated Spec Fix Workflow

The system SHALL provide a reusable GitHub Actions workflow that automatically fixes specification validation failures using AI. The workflow SHALL accept a validation summary as input, checkout the repository, setup CodeMie CLI, authenticate, prepare a task with the fix-specs prompt and validation summary, execute CodeMie to fix violations, and create a pull request with the fixes.

#### Scenario: Fix workflow input acceptance
- **GIVEN** the fix-specs-with-ai workflow is called
- **WHEN** receiving inputs
- **THEN** the workflow SHALL accept a required summary input (base64-encoded validation summary JSON)

#### Scenario: Fix workflow environment setup
- **GIVEN** the fix workflow is executing
- **WHEN** setting up the environment
- **THEN** the workflow SHALL checkout the repository without persisting credentials, setup Node.js version 24, install CodeMie CLI globally, and authenticate with CodeMie

#### Scenario: Fix task preparation
- **GIVEN** the validation summary is available
- **WHEN** preparing the fix task
- **THEN** the workflow SHALL combine prompts/fix-specs.user.md with the decoded validation summary into a task file

#### Scenario: CodeMie execution
- **GIVEN** the fix task is prepared
- **WHEN** executing CodeMie
- **THEN** the workflow SHALL run codemie-code with model gpt-5-mini-2025-08-07 and the prepared task, and display git status after execution

#### Scenario: Pull request creation
- **GIVEN** CodeMie has made changes
- **WHEN** creating a pull request
- **THEN** the workflow SHALL create a pull request with branch name agent/fix-specs-{run_id}, title "🤖 Agent: Fix Specs", body describing automatic generation, and labels "agent" and "specs"

### Requirement: Validation Output Format

The static OpenSpec validation SHALL produce JSON output with success, exitCode, summary.totals.items, summary.totals.passed, summary.totals.failed, and items array fields. The AI-assisted validation SHALL produce JSON output with result (VALID or INVALID), violations array, and notes array fields.

#### Scenario: Static validation output structure
- **GIVEN** static OpenSpec validation completes
- **WHEN** examining the output JSON
- **THEN** the output SHALL contain success (boolean), exitCode (number), summary.totals.items (number), summary.totals.passed (number), summary.totals.failed (number), and items array with validation details

#### Scenario: AI validation output structure
- **GIVEN** AI-assisted validation completes
- **WHEN** examining the output JSON
- **THEN** the output SHALL contain result (VALID or INVALID), violations array with spec_id, rule, and description fields, and notes array

#### Scenario: Violation structure
- **GIVEN** a violation in AI validation output
- **WHEN** examining the violation
- **THEN** the violation SHALL contain spec_id (string or null), rule (string), and description (string) fields

### Requirement: Workflow Output Exposure

Both validation workflows SHALL expose validation-status and validation-summary-json as job outputs. The validation-status SHALL indicate success or failure. The validation-summary-json SHALL be base64-encoded JSON containing the complete validation results.

#### Scenario: Static validation outputs
- **GIVEN** static OpenSpec validation completes
- **WHEN** examining job outputs
- **THEN** the job SHALL expose validation-status (success boolean) and validation-summary-json (base64-encoded result.json)

#### Scenario: AI validation outputs
- **GIVEN** AI-assisted validation completes
- **WHEN** examining job outputs
- **THEN** the job SHALL expose validation-status (result string) and validation-summary-json (base64-encoded result.json)

### Requirement: Workflow Permissions

The validation workflows SHALL require contents: read permission. The fix workflow SHALL require contents: write and pull-requests: write permissions.

#### Scenario: Static validation permissions
- **GIVEN** the static OpenSpec validation workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: read permission

#### Scenario: AI validation permissions
- **GIVEN** the AI-assisted validation workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: read permission

#### Scenario: Fix workflow permissions
- **GIVEN** the fix-specs-with-ai workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: write and pull-requests: write permissions

### Requirement: Validation Prompt Usage

The AI-assisted validation SHALL use canonical prompts defined in prompts/validate-specs.system.md and prompts/validate-specs.user.md. The fix workflow SHALL use the prompt defined in prompts/fix-specs.user.md.

#### Scenario: AI validation system prompt
- **GIVEN** AI-assisted validation is executing
- **WHEN** configuring the AI validator
- **THEN** the workflow SHALL use prompts/validate-specs.system.md as the system prompt

#### Scenario: AI validation user prompt
- **GIVEN** AI-assisted validation is executing
- **WHEN** configuring the AI validator
- **THEN** the workflow SHALL use prompts/validate-specs.user.md as the user prompt

#### Scenario: Fix workflow prompt
- **GIVEN** the fix workflow is executing
- **WHEN** preparing the fix task
- **THEN** the workflow SHALL use prompts/fix-specs.user.md as the base prompt

### Requirement: Changed Files Detection

The AI-assisted validation workflow SHALL detect changed specification files by comparing the current commit against the base commit. The workflow SHALL filter for openspec/**/*.spec.md files and validate only changed files when changes are detected, or validate all files when no changes are detected.

#### Scenario: Changed files detection logic
- **GIVEN** a push event to main branch
- **WHEN** detecting changed spec files
- **THEN** the workflow SHALL use github.event.before as base commit if available and valid, otherwise use HEAD~1, and filter git diff output for openspec/**/*.spec.md files

#### Scenario: Changed files validation path
- **GIVEN** changed spec files are detected
- **WHEN** executing validation
- **THEN** the workflow SHALL pass --specFilePaths with comma-separated absolute paths to the changed files

#### Scenario: All files validation path
- **GIVEN** no changed spec files are detected
- **WHEN** executing validation
- **THEN** the workflow SHALL pass --rootDir with the repository root directory

### Requirement: Error Handling and Resilience

The validation workflows SHALL handle execution errors gracefully. The workflows SHALL create valid error JSON responses when scripts fail, continue execution on non-critical errors, and always produce valid output formats.

#### Scenario: Static validation script failure handling
- **GIVEN** the OpenSpec validation script fails
- **WHEN** handling the failure
- **THEN** the workflow SHALL capture output with || true, parse available results, and continue execution

#### Scenario: AI validation script failure handling
- **GIVEN** the AI validation script fails
- **WHEN** handling the failure
- **THEN** the workflow SHALL create a valid error JSON response with result INVALID and notes describing the execution failure

#### Scenario: JSON validation error handling
- **GIVEN** AI validation output is not valid JSON
- **WHEN** validating the output
- **THEN** the workflow SHALL create a valid error JSON response with result INVALID and notes describing the JSON parsing failure

#### Scenario: Always valid output
- **GIVEN** any validation execution scenario
- **WHEN** producing output
- **THEN** the workflow SHALL always produce valid JSON output that can be parsed and processed by downstream jobs
