module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    ecmaFeatures: {
      "jsx": true,
      "modules": true
    }
  },
  plugins: ["prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "array-element-newline": ["error", "consistent"]
  }
}
