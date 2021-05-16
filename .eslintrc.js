module.exports = {
    env: {
      es2018: true,
      node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',    
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {},
  };