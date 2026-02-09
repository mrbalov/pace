import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['packages/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      // Never use let - always use const
      'no-restricted-syntax': [
        'error',
        {
          selector: 'VariableDeclaration[kind="let"]',
          message: 'The "let" keyword is FORBIDDEN. Always use "const" for all variable declarations. Code MUST be pure and immutable.',
        },
        {
          selector: 'VariableDeclarator > ArrowFunctionExpression > FunctionExpression',
          message: 'Nested functions are FORBIDDEN. All functions MUST be defined at the top level of the file.',
        },
        {
          selector: 'VariableDeclarator > ArrowFunctionExpression > ArrowFunctionExpression',
          message: 'Nested arrow functions are FORBIDDEN. All functions MUST be defined at the top level of the file.',
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-inner-declarations': 'error',
      // 'max-len': ['error', { code: 80 }],

      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/typedef': 'off',

      // JSDoc requirements
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            'ArrowFunctionExpression',
            'FunctionExpression',
            'FunctionDeclaration',
            'MethodDefinition',
          ],
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/check-tag-names': 'error',

      // No early returns - use explicit if/else
      'consistent-return': 'off',
      'no-else-return': 'off',

      // Code style
      'no-console': [
        'error',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': [
        'error',
        'as-needed',
      ],

      // Import patterns
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['fs', 'fs/promises', 'path'],
              message: "Use 'node:' prefix for Node.js built-ins: import { readFile } from 'node:fs/promises'",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/**/*.test.ts'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.config.js',
      'actions-runner/**',
    ],
  },
);
