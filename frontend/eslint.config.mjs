import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import nextPlugin from '@next/eslint-plugin-next'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      globals: globals.browser,
    },
    plugins: {
      react,
      '@next/next': nextPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...React.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
    },
  },
]
