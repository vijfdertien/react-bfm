import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import babelParser from '@babel/eslint-parser'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import unicorn from 'eslint-plugin-unicorn'
import preferArrow from 'eslint-plugin-prefer-arrow'
import jest from 'eslint-plugin-jest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const typescriptCompat = compat
  .extends('plugin:import/typescript', 'plugin:@typescript-eslint/recommended', 'prettier')
  .map((config) => ({
    ...config,
    files: ['**/*.ts?(x)', '**/*.d.ts?(x)'],
  }))

export default [
  {
    ignores: ['build', 'dist', 'es', 'lib', 'types', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...compat.extends(
    'standard',
    'standard-jsx',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
    'plugin:jest/recommended',
  ),
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          configFile: path.join(__dirname, '.babelrc.js'),
        },
      },
      globals: {
        fetch: 'readonly',
      },
    },
    settings: {
      react: {
        version: '18.2.0',
      },
      'import/resolver': 'node',
    },
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
      unicorn,
      'prefer-arrow': preferArrow,
      jest,
      react,
    },
    rules,
  },
  ...typescriptCompat,
  {
    files: ['**/*.ts?(x)', '**/*.d.ts?(x)'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': ['off'],
    },
  },
]
