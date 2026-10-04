# Coding Conventions

Last verified against the code on 2026-10-04. `CLAUDE.md` (repo root) is authoritative; this
page records the configured tooling and the conventions the codebase actually follows.

## Tooling

### ESLint (`eslint.config.js`, flat config)

- Base: `@eslint/js` recommended plus `eslint-plugin-svelte` recommended presets.
- Parsers: `@typescript-eslint/parser` for `.ts`, and inside `<script lang="ts">` and
  `.svelte.ts` modules via `svelte-eslint-parser`.
- Rules that matter day to day:
  - `semi: ['error', 'always']` for `.js`/`.ts`.
  - `no-console: 'warn'` (turned off for `scripts/**`, where console is the output channel).
  - `@typescript-eslint/no-unused-vars: 'warn'` with `argsIgnorePattern` and
    `varsIgnorePattern` of `^_`. Prefix an intentionally unused name with `_`.
  - `svelte/no-at-html-tags: 'warn'`. Use `{@html}` only for trusted, repo-authored content.
  - `svelte/no-navigation-without-resolve: 'off'` (the site is served at the domain root).
- Ignored: `build/`, `.svelte-kit/`, `node_modules/`, `dist/`.

### Prettier (`.prettierrc`)

`printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`, `tabWidth: 2`, spaces not
tabs, `bracketSpacing: true`, with `prettier-plugin-svelte`. Run `pnpm format` before
committing. `.prettierignore` excludes `build/`, `.svelte-kit/`, `/design-system/` and the
generated `static/og/manifest.json`.

### TypeScript (`tsconfig.json`)

Extends `.svelte-kit/tsconfig.json`; `strict: true`, `checkJs: true`,
`moduleResolution: 'bundler'`. `pnpm check` runs `svelte-kit sync` then `svelte-check`.

## Naming

| Thing                        | Convention                 | Examples                                                             |
| ---------------------------- | -------------------------- | -------------------------------------------------------------------- |
| Svelte components            | PascalCase file and import | `SectionHeader.svelte`, `NoteExcerptCard.svelte`                     |
| Feature folders              | kebab-case                 | `features/cost-simulator/`, `features/latency-sim/`                  |
| Utility and constant modules | kebab-case `.ts`           | `cost-guard-display.ts`, `note-excerpt.ts`, `design-tokens.ts`       |
| Runes state modules          | `name.svelte.ts`           | `db.svelte.ts`, `hud.svelte.ts`                                      |
| Functions and variables      | camelCase                  | `observeSection`, `visibleItems`                                     |
| Constants                    | UPPER_SNAKE_CASE           | `ROUTES`, `FEATURE_FLAGS`, `ANIMATION_CONFIG`, `DESIGN_SYSTEM_CARDS` |
| Types and interfaces         | PascalCase                 | `CostSnapshot`, `ObserveSectionOptions`                              |

## Imports

Always use the `$lib` alias, never relative `../../` paths across `src/lib`:

```ts
import { observeSection } from '$lib/utils/section-observer';
import { theme } from '$lib/stores';
import { SectionHeader } from '$lib/components/ui';
import { Hero } from '$lib/components/features/hero';
import { ROUTES } from '$lib/constants/routes';
import type { Theme } from '$lib/types';
```

Relative imports appear only next to the file itself (barrel `index.ts` files, `./$types` in
routes, and the root layout's `import '../app.css'`).

## Svelte 5

- Runes only: `$state`, `$derived`, `$effect`, `$props`. No `export let`, no `$:` statements,
  no `on:click` directive syntax (use `onclick={...}`); the codebase has none of these.
- Props are typed with a local `interface Props` and destructured from `$props()`.
- Composition uses snippets (`children?: Snippet`, `{@render children()}`), as in
  `SectionHeader.svelte`.
- Shared cross-component state: a store in `$lib/stores` (`theme`, `scroll`) or a runes class
  in `src/lib/*.svelte.ts` exported as a singleton (`costDB`, `hud`, `simulator`).
- Guard browser-only code with `browser` from `$app/environment` or keep it in `onMount`.
  Every route is prerendered, so module scope must be safe at build time.

## Styling

- Scoped `<style>` blocks plus Tailwind utilities for layout. Colours, sizes, radii, shadows,
  durations, widths and spacing come from tokens in `src/app.css`, never literals. See
  [DESIGN_TOKENS.md](DESIGN_TOKENS.md).
- Dark mode is the `.dark` class on `<html>`; tokens swap values, so components rarely need a
  `:global(.dark)` override.
- Type hierarchy on cards: classification > measurement > description. Mono
  (`--font-mono`) is for measured values and identifiers only; descriptive labels are sans.
  The serif (`--font-serif`) is for note and case-study reading prose only.
- Content always renders. Scroll reveals are animation-only, gated on
  `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`. Never wrap
  content in `{#if visible}`; it would not prerender.

## Comments

Explain why, not what. Module and exported-function headers in this codebase use JSDoc and
usually record the reason a rule exists or the incident that produced it (see the headers of
`design-tokens.ts`, `tokens-css.test.ts`, `svelte.config.js`). Do not leave commented-out code.

## Design principles

SRP, DRY (check `$lib/utils/` first), KISS, YAGNI, separation of data, UI and logic. Avoid god
components, magic numbers and deep nesting. Full wording in `CLAUDE.md`.
