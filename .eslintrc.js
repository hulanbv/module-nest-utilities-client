module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
        overrides: {
          constructors: 'off',
        },
      },
    ],
    'import/no-default-export': 'error',
    'prettier/prettier': 'warn',
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    quotes: ['warn', 'single'],
  },
};
