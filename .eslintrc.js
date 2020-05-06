module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'modules': true
    }
  },
  plugins: ['standard'],
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['error', 'double'],
    'array-element-newline': ['error', 'consistent']
  }
}


