// @ts-check

const tseslint = require('typescript-eslint')
const importPlugin = require('eslint-plugin-import')

module.exports = tseslint.config(
  tseslint.configs.base,
  importPlugin.flatConfigs.recommended,
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
      'func-style': ['error', 'declaration'],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowDirectConstAssertionInArrowFunctions: true },
      ],
      'object-shorthand': 'error',

      // disable all import rules -- i am not how to load only the plugin itself :shrug:
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-duplicates': 'off',
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
      'func-style': ['error', 'declaration'],
      'object-shorthand': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // disable all import rules -- i am not how to load only the plugin itself :shrug:
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-duplicates': 'off',
    },
  },
  {
    files: ['packages/common-nodejs/**/*.ts'],
    ignores: ['node_modules/**/*', '**/node_modules/**/*'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
      },
    },
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
)
