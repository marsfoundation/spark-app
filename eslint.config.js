// @ts-check

const tseslint = require('typescript-eslint')
const importPlugin = require('eslint-plugin-import')

module.exports = tseslint.config(
  tseslint.configs.base,
  {
    plugins: {
      import: importPlugin,
    },
  },
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
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],
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
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],
    },
  },
)
