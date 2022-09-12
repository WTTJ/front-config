module.exports = {
  extends: ['./eslintrc', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-max-depth': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-leaked-render': 'off',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  settings: {
    'import/resolve': {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
}
