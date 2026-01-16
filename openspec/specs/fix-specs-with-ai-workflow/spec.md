# Fix Specs with AI Workflow

## Purpose

Define requirements for the reusable GitHub Actions workflow that automatically fixes OpenSpec specification validation failures using AI. The workflow accepts validation summaries from validation pipelines, uses CodeMie AI to fix violations, and creates pull requests with the fixes.

## Requirements

### Requirement: Workflow Trigger and Inputs

The workflow SHALL be triggered as a reusable workflow via workflow_call. The workflow SHALL accept a required summary input of type string containing base64-encoded validation summary JSON.

#### Scenario: Workflow call trigger
- **GIVEN** a calling workflow invokes fix-specs-with-ai.yml
- **WHEN** the workflow_call event is triggered
- **THEN** the fix-specs-with-ai workflow SHALL execute

#### Scenario: Summary input requirement
- **GIVEN** the fix-specs-with-ai workflow is called
- **WHEN** receiving inputs
- **THEN** the workflow SHALL require a summary input of type string containing base64-encoded validation summary JSON

### Requirement: Workflow Execution Environment

The workflow SHALL run on self-hosted runners. The workflow SHALL checkout the repository without persisting credentials to enable self-hosted runners to create pull requests.

#### Scenario: Self-hosted runner execution
- **GIVEN** the fix-specs-with-ai workflow is triggered
- **WHEN** selecting the execution environment
- **THEN** the workflow SHALL run on self-hosted runners

#### Scenario: Repository checkout without credential persistence
- **GIVEN** the workflow is executing
- **WHEN** checking out the repository
- **THEN** the workflow SHALL checkout the repository with persist-credentials set to false to enable self-hosted runners to create pull requests

### Requirement: Node.js Environment Setup

The workflow SHALL setup Node.js version 24 for executing CodeMie CLI commands.

#### Scenario: Node.js version setup
- **GIVEN** the workflow is executing
- **WHEN** setting up the Node.js environment
- **THEN** the workflow SHALL setup Node.js version 24

### Requirement: CodeMie CLI Installation and Authentication

The workflow SHALL install CodeMie CLI globally using npm, check authentication status, and authenticate if needed.

#### Scenario: CodeMie CLI installation
- **GIVEN** Node.js is set up
- **WHEN** installing CodeMie CLI
- **THEN** the workflow SHALL install @codemieai/code package globally using npm install -g

#### Scenario: CodeMie authentication check
- **GIVEN** CodeMie CLI is installed
- **WHEN** checking authentication status
- **THEN** the workflow SHALL run codemie profile status to check authentication status

#### Scenario: CodeMie authentication login
- **GIVEN** authentication status is checked
- **WHEN** authentication is needed
- **THEN** the workflow SHALL run codemie profile login to authenticate

### Requirement: Fix Task Preparation

The workflow SHALL prepare a task file by combining the fix-specs prompt with the decoded validation summary. The task file SHALL contain the prompt content, a separator, the validation summary, and an end marker.

#### Scenario: Task file creation
- **GIVEN** the validation summary input is available
- **WHEN** preparing the fix task
- **THEN** the workflow SHALL create a task file at /tmp/task.txt

#### Scenario: Prompt content inclusion
- **GIVEN** the task file is being prepared
- **WHEN** writing prompt content
- **THEN** the workflow SHALL write the contents of prompts/fix-specs.user.md to the task file

#### Scenario: Validation summary inclusion
- **GIVEN** the prompt content is written
- **WHEN** adding validation summary
- **THEN** the workflow SHALL decode the base64-encoded summary input, add a separator marker "---- VALIDATION SUMMARY START ----", append the decoded summary, and add an end marker "---- VALIDATION SUMMARY END ----"

### Requirement: CodeMie Execution

The workflow SHALL execute CodeMie with the prepared task to fix specification violations. The workflow SHALL use the gpt-5-mini-2025-08-07 model and display git status after execution.

#### Scenario: CodeMie execution with task
- **GIVEN** the fix task is prepared
- **WHEN** executing CodeMie
- **THEN** the workflow SHALL run codemie-code with model gpt-5-mini-2025-08-07 and the task file content as the task parameter

#### Scenario: Git status display after execution
- **GIVEN** CodeMie execution completes
- **WHEN** checking repository state
- **THEN** the workflow SHALL display git status to show files changed by the agent

### Requirement: Pull Request Creation

The workflow SHALL create a pull request with fixes using the peter-evans/create-pull-request action. The pull request SHALL have a specific branch name pattern, title, body, and labels.

#### Scenario: Pull request branch naming
- **GIVEN** CodeMie has made changes
- **WHEN** creating a pull request
- **THEN** the workflow SHALL create a branch with name pattern agent/fix-specs-{run_id} where run_id is the GitHub Actions run ID

#### Scenario: Pull request title
- **GIVEN** a pull request is being created
- **WHEN** setting the title
- **THEN** the workflow SHALL set the title to "🤖 Agent: Fix Specs"

#### Scenario: Pull request body
- **GIVEN** a pull request is being created
- **WHEN** setting the body
- **THEN** the workflow SHALL set the body to describe that the PR was automatically generated by the AI Agent, fixes spec validation errors detected in CI, and requests careful review

#### Scenario: Pull request labels
- **GIVEN** a pull request is being created
- **WHEN** setting labels
- **THEN** the workflow SHALL apply labels "agent" and "specs"

#### Scenario: Pull request creation authentication
- **GIVEN** a pull request is being created
- **WHEN** authenticating the action
- **THEN** the workflow SHALL use the GH_PAT secret for authentication

### Requirement: Workflow Permissions

The workflow SHALL require contents: write and pull-requests: write permissions to create pull requests with fixes.

#### Scenario: Contents write permission
- **GIVEN** the fix-specs-with-ai workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: write permission

#### Scenario: Pull requests write permission
- **GIVEN** the fix-specs-with-ai workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have pull-requests: write permission

### Requirement: Error Handling

The workflow SHALL handle errors gracefully. If CodeMie execution fails or no changes are made, the workflow SHALL complete without creating an empty pull request.

#### Scenario: CodeMie execution failure handling
- **GIVEN** CodeMie execution fails
- **WHEN** handling the failure
- **THEN** the workflow SHALL fail the step and not create a pull request

#### Scenario: No changes handling
- **GIVEN** CodeMie execution completes successfully
- **WHEN** no changes are detected
- **THEN** the create-pull-request action SHALL handle the no-changes case gracefully without creating an empty pull request
