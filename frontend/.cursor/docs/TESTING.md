# Testing

Last verified against the code on 2026-10-04. `CLAUDE.md` (repo root) is authoritative.

> This page replaces an older version that described Svelte Testing Library component tests,
> MSW, and a `--coverage` workflow. None of those are installed or used here, and
> `.svelte` files are deliberately not unit-tested.

## Setup

- Runner: Vitest (`vitest.config.ts`), `environment: 'jsdom'`, `globals: true`.
- Included files: `src/**/*.{test,spec}.{js,ts}`. Tests are colocated next to their source.
- Under Vitest the config loads the plain `svelte()` plugin (not `sveltekit()`) so runes in
  `.svelte.ts` modules compile, and resolves with the `browser` condition so Svelte's client
  runtime is used.
- Aliases: `$lib` maps to `src/lib`. `$app/environment` is aliased to a stub, so tests that
  need `browser` mock it: `vi.mock('$app/environment', () => ({ browser: true }))`.
- No Testing Library, no MSW, no coverage provider package. `@vitest/ui` is installed for
  `pnpm test:ui`.

## Running

```bash
pnpm test                                          # svelte-kit sync + vitest run
pnpm test:watch                                    # watch mode
pnpm vitest run src/lib/utils/navigation.test.ts   # one file
pnpm vitest run src/lib/constants                  # one folder (the guard suites)
```

The pre-commit hook and CI both run the full suite.

## What gets tested

| Kind                    | Where                         | Examples                                                                                                                      |
| ----------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Pure utilities          | `src/lib/utils/*.test.ts`     | `cost-projection`, `note-groups`, `section-observer` (with a mocked `IntersectionObserver`)                                   |
| Stores                  | `src/lib/stores/*.test.ts`    | `theme.test.ts` uses `vi.resetModules()` plus a dynamic import because the store reads `localStorage` at import time          |
| Runes classes           | `src/lib/*.test.ts`           | `db.test.ts` mocks `@electric-sql/pglite`; `hud.test.ts` mocks `$lib/db.svelte` via `vi.hoisted`                              |
| Route logic             | next to the route             | `sitemap.xml/sitemap.test.ts`, `rss.xml/rss.test.ts`, `(main)/blog/[slug]/page.test.ts` (calls `entries` and `load` directly) |
| Content and site guards | `src/lib/constants/*.test.ts` | see below                                                                                                                     |

Do not write tests for `.svelte` components. Put the logic in a util, store or runes class and
test that.

### Guard suites in `src/lib/constants/`

These read source files, `app.css`, `static/` and config and fail the build on drift. They are
the reason a token, copy or config change can break `pnpm test`.

| Test                                                                                                 | Guards                                                                                                |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `design-tokens.test.ts`                                                                              | `design-tokens.ts` matches `app.css`; covered families fully registered                               |
| `tokens-css.test.ts`                                                                                 | `static/tokens.css` matches what `pnpm tokens` would generate                                         |
| `design-system-styles.test.ts`                                                                       | `.design-sync/conventions.md` names only real tokens and documents every family                       |
| `font-metrics.test.ts`                                                                               | metric-matched fallback faces exist and carry derived overrides                                       |
| `csp.test.ts`                                                                                        | the CSP in `svelte.config.js` stays in hash mode and free of escape hatches such as `'unsafe-inline'` |
| `content.test.ts`, `content-voice.test.ts`, `positioning.test.ts`, `disclosure-guard.test.ts`        | site copy: sourced metrics, voice rules, retired phrasings, disclosure deny-list                      |
| `case-studies.test.ts`                                                                               | case-study completeness (length, sources, related notes)                                              |
| `og.test.ts`, `structured-data.test.ts`, `llms-links.test.ts`, `redirects.test.ts`, `models.test.ts` | OG cards, JSON-LD, `llms.txt` links, `_redirects`, the models registry                                |

If one of these fails after your change, fix the change or the registry it points at. Do not
loosen the guard to make it pass.

## Writing a test

```ts
import { describe, it, expect } from 'vitest';
import { groupNotesByMonth } from '$lib/utils/note-groups';

describe('groupNotesByMonth', () => {
  it('orders months newest first regardless of input order', () => {
    // arrange real-shaped input, assert on the contract
  });
});
```

- Test the contract and realistic inputs; a test should fail if someone breaks the behaviour.
- Use ES module `import` only, never `require()`.
- New utils need a colocated `*.test.ts`; aim for at least 90% coverage of new code (measured
  by reading the branches, since no coverage provider is installed).
