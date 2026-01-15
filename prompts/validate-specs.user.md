Validate the following complete specification set.

This input represents the **SUBSET** of specifications.
All provided specifications **MUST** be validated together as a system.

Instructions:
- Validate every specification against the OpenSpec
- Validate cross-spec interactions and conflicts
- Determine a single global validation result

If **ANY** mandatory check fails → result **MUST** be **INVALID**.

Return a **SINGLE** validation result using this contract:

{
  "result": "VALID | INVALID",
  "violations": [
    {
      "spec_id": "<id or null if global>",
      "rule": "<meta rule reference>",
      "description": "<precise, mechanical description>"
    }
  ],
  "notes": []
}

Now validate the following specifications:

Notes:
- Each specification chunk is preceded by a `PATH:` header that shows the absolute path to the spec file. When recording a violation for a specific document, set `spec_id` to exactly that path (e.g., `openspec/specs/test-invalid-spec/spec.md`). If the violation applies globally, use `null`.
