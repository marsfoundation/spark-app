// @ts-check

const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  tseslint.configs.base,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'func-style': ['error', 'declaration'],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowDirectConstAssertionInArrowFunctions: true },
      ],
      'object-shorthand': 'error',
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    },
  },
  {
    files: ['**/*.tsx'],
    ignores: ['node_modules/**/*', '**/node_modules/**/*'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'func-style': ['error', 'declaration'],
      'object-shorthand': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    },
  },
)
