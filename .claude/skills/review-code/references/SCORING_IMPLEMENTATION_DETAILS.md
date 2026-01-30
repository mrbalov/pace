# Scoring Implementation Details

## Scoring Logic Pseudocode
```
base_score = 10.0
deductions = min(critical_count * 2.0, 4.0) + 
             min(major_count * 1.0, 3.0) + 
             min(suggestion_count * 0.3, 1.5) +
             complexity_penalty +  // 0.5-1.5 based on change size
             test_coverage_penalty  // 0.0-0.5 if tests missing
             
bonus = min(positive_count * 0.2, 0.5)
final_score = clamp(base_score - deductions + bonus, 1.0, 10.0)
```

## Example Score Calculations
- **0 critical, 0 major, 3 suggestions, 2 positive**: 10.0 - 0.9 + 0.4 - 0.5 (complexity) = **9.0** ✅
- **1 critical, 2 major, 5 suggestions**: 10.0 - 2.0 - 2.0 - 1.5 - 1.0 (complexity) = **3.5** ❌ (triggers auto-fix)
- **0 critical, 1 major, 2 suggestions, 1 positive**: 10.0 - 1.0 - 0.6 + 0.2 - 0.5 = **8.1** ✅

## Edge Cases
1. **No issues found**: Score = 9.5-10.0 (perfect or near-perfect)
2. **Only suggestions**: Score likely 8.0+, no auto-fix needed
3. **Unfixable issues**: Document in output, manual review required
4. **Score stuck**: Abort after 3 iterations, flag for manual review
5. **Large changesets**: May skip auto-fix if changes too complex
