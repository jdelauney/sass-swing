module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'semi': 0,
    'comma-dangle': 0,
    'standard/no-callback-literal': "off",
  }
}
