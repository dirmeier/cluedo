module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: "babel-eslint"
  },
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "array-element-newline": ["error", "consistent"]
  }
};
