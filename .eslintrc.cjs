/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['typestrict', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react/jsx-runtime'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', 'simple-import-sort', 'unused-imports', 'import'],
  rules: {
    'object-shorthand': ['error', 'always', { avoidQuotes: true }],
    'no-throw-literal': 'error',
    'func-style': ['error', 'declaration'],
    'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowDirectConstAssertionInArrowFunctions: true },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    // this rule can't find automatically mistakes and needs to be guided
    // 'import/no-internal-modules': ['error', { forbid: ['**/utils/*'] }],
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'no-console': 'error',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-with': 'error',
    'one-var': ['error', { initialized: 'never' }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports-ts': 'error',
    'no-restricted-imports': ['error', {
      'patterns': [{
        'group': ['../../../**/*'],
        'message': 'consider using @ instead of going too many folders up.'
      }]
    }],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  },
  overrides: [
    {
      // react components don't have to have explicit return type
      files: ['*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      // react components don't have to have explicit return type
      files: ['*.stories.tsx'],
      rules: {
        'react-refresh/only-export-components': ['off'],
      },
    },
  ],
}
