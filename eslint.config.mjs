import jsLint from '@eslint/js';
import tsLint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: [
      '.cursor',
      '.husky',
      'coverage',
      'dist',
      'node_modules',
      'playwright-report',
      'test-results',
      'jest-report.html',
      'jest-report.json',
      'tests/unit/output',
    ],
  },
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
      playwright,
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  { files: ['tests/integration/**'] },
];
