const rules = {
  'arrow-body-style': ['error', 'as-needed'],
  curly: ['error', 'all'],
  'import/no-duplicates': 'error',
  'import/no-extraneous-dependencies': 'error',
  'import/no-useless-path-segments': 'error',
  'import/order': 'error',
  'no-console': 'error',
  'no-implicit-globals': 'error',
  'no-unused-vars': [
    'error',
    {
      args: 'all',
      argsIgnorePattern: '_',
    },
  ],
  'no-useless-return': 'error',
  'no-var': 'error',
  'prefer-arrow/prefer-arrow-functions': [
    'error',
    {
      disallowPrototype: true,
      singleReturnOnly: false,
      classPropertiesAllowed: false,
    },
  ],
  'react-hooks/exhaustive-deps': ['error'],
  'react-hooks/rules-of-hooks': 'error',
  'react/jsx-boolean-value': 'error',
  'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-no-useless-fragment': 'error',
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',
  'unicorn/no-abusive-eslint-disable': 'error',
}

module.exports = {
  extends: [
    'eslint:recommended',
    'standard',
    'standard-jsx',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
    'plugin:jest/recommended',
  ],
  parser: '@babel/eslint-parser',
  plugins: ['react-hooks', 'import', 'unicorn', 'prefer-arrow', 'jest'],
  settings: {
    react: {
      version: '17.0.1',
    },
    'import/resolver': 'node',
  },
  globals: {
    fetch: 'readonly',
  },
  rules,
  overrides: [
    {
      files: ['**/*.ts?(x)', '**/*.d.ts?(x)'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      rules: {
        ...rules,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
      },
    },
  ],
}
