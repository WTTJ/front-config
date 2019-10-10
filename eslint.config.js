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
    'no-console': 'error',
    'import/order': ['error', { 'newlines-between': 'ignore' }],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none']
      }
    ],
    'sort-destructure-keys/sort-destructure-keys': ['error', { caseSensitive: false }],
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/prop-types': ['error', { ignore: ['dataTestId'] }],
    'react/sort-prop-types': ['error', { ignoreCase: true, sortShapeProp: true }],
    'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
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
    // New
    'react/jsx-max-depth': ['warn', { max: 5 }],
    'react/no-set-state': 'off',
    'react/no-did-mount-set-state': 'warning',
    'react/no-did-update-set-state': 'warning',
    'react/prop-types': 'off',
    'react/jsx-handler-names': 'off',
    'react/prefer-stateless-function': 'off',
    'react/require-optimization': 'off',
    'react/jsx-fragments': 'off'
  },
  settings: {
    react: {
      version: '16.4.2'
    }
  }
}
