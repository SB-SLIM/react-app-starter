import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // Type-checked rules — catches no-floating-promises, no-misused-promises, etc.
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // `project: true` resolves to tsconfig.json which has `files: []` (composite
        // project references root) — ESLint skips all files. Point at the actual
        // tsconfigs so type-checked rules run correctly.
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Prevent silent async failures — the two most impactful async rules
      '@typescript-eslint/no-floating-promises': 'error',
      // Allow async functions in JSX event handlers (standard React pattern)
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      // TanStack Router uses `throw redirect(...)` — not a plain Error object
      '@typescript-eslint/only-throw-error': 'off',
      // Fires when package types resolve as `any` during lint (build-order artefact)
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      // Prefer explicit return types on exported functions for better DX
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // These fire broadly on `any`-typed values from external libs; never enforced before
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
])
