module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:react/all'],
  parser: 'babel-eslint',
  plugins: ['import', 'react-hooks', 'sort-destructure-keys'],
  rules: {
    // Errors
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'react/prop-types': ['error', { ignore: ['dataTestId'] }],
    // Warnings
    'no-console': 'warn',
    'import/order': ['warn', { 'newlines-between': 'always' }],
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none']
      }
    ],
    'sort-destructure-keys/sort-destructure-keys': ['warn', { caseSensitive: false }],
    'react-hooks/exhaustive-deps': 'warn',
    'react/sort-prop-types': ['warn', { ignoreCase: true, sortShapeProp: true }],
    'react/jsx-no-bind': ['warn', { allowArrowFunctions: true }],
    'react/jsx-max-depth': ['warn', { max: 4 }],
    // Off
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-no-literals': 'off',
    'react/forbid-component-props': 'off',
    'react/jsx-props-no-spreading': 'off'
  },
  settings: {
    react: {
      version: '16.8.6'
    }
  }
}
