export interface ValidationIssue {
  level: 'ERROR' | 'WARNING';
  path: string;
  message: string;
}

export interface ValidationItem {
  id: string;
  type: 'spec' | 'change';
  valid: boolean;
  issues: ValidationIssue[];
  durationMs: number;
}

/**
 * Validation count statistics.
 */
export interface ValidationCounts {
  items: number;
  passed: number;
  failed: number;
}

/**
 * Validation counts grouped by type.
 */
export interface ValidationCountsByType {
  change: ValidationCounts;
  spec: ValidationCounts;
}

export interface ValidationSummary {
  totals: ValidationCounts;
  byType: ValidationCountsByType;
}

export interface Output {
  success: boolean;
  exitCode: number;
  items: ValidationItem[];
  summary: ValidationSummary;
  version: string;
  stderr: string;
}
