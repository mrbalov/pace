type ValidationScope = 'FULL_SPECIFICATION_SET' | 'SINGLE_SPECIFICATION';

type ValidationStatus = 'INVALID' | 'CONDITIONALLY_VALID' | 'VALID';

export type Output = {
  validated_scope?: ValidationScope;
  result?: ValidationStatus;
  spec_count?: number;
  notes?: string[];
  violations?: Array<{
    spec_id?: string;
    rule?: string;
    description?: string;
  }>;
};
