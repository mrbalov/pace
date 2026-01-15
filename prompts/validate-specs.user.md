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
