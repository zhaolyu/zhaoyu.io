import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    // Build-time CLI scripts: Node-only, and console is their output channel
    // rather than a stray debug statement.
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-console': 'warn',
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-undef': 'off', // TypeScript handles this
    },
  },
  // eslint-plugin-svelte v3 flat presets — sets the svelte parser for *.svelte
  ...sveltePlugin.configs.recommended,
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        parser: tsParser, // parse <script lang="ts"> blocks and .svelte.ts modules
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-console': 'warn',
      'svelte/no-at-html-tags': 'warn',
      // Same pairing as the .ts block above. Without it the base rule stays on
      // for .svelte and reports the parameter names in a function-typed prop
      // (`onsort?: (key: string) => void`) as unused variables — and the `^_`
      // escape hatch the convention documents wouldn't apply either.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Use TypeScript version instead
      // Designed for apps served under a base path; this site is a static
      // SPA at the domain root, so plain absolute hrefs are correct.
      'svelte/no-navigation-without-resolve': 'off',
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    ignores: ['build/**', '.svelte-kit/**', 'node_modules/**', 'dist/**'],
  },
];
