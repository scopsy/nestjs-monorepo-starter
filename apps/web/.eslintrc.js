module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-closing-bracket-location': 'off',
  },
  globals: {
    React: 'writable',
  },
};
