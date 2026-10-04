# Quick Reference

Last verified against the code on 2026-10-04. `CLAUDE.md` (repo root) is authoritative.

All paths below are relative to `frontend/`, and every command runs from there.

## Commands (pnpm)

```bash
pnpm dev             # dev server on http://localhost:5173
pnpm build           # production build into build/ (prebuild runs `pnpm tokens`)
pnpm preview         # serve the production build
pnpm check           # svelte-kit sync + svelte-check (type check)
pnpm lint            # ESLint
pnpm lint:fix        # ESLint with autofix
pnpm format          # Prettier
pnpm test            # svelte-kit sync + vitest run (all tests)
pnpm test:watch      # Vitest watch mode
pnpm vitest run src/lib/utils/navigation.test.ts   # one file
pnpm tokens          # regenerate static/tokens.css from src/app.css
pnpm og              # after a build: regenerate OG cards (hero tagline, note titles and tags)
pnpm design-system   # after `pnpm build`: write the design-system/ preview bundle (gitignored)
```

## Common paths

| Path                                       | Purpose                                                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `src/app.css`                              | Global styles and every design token (single source of truth)                                                                       |
| `src/app.html`                             | HTML shell, including the inline theme-init script (its hash is in the CSP)                                                         |
| `src/lib/components/{ui,layout,features}/` | Components; see [FILE_ORGANIZATION.md](FILE_ORGANIZATION.md)                                                                        |
| `src/lib/constants/`                       | `content.ts` (site copy), `config.ts`, `routes.ts`, `design-tokens.ts`, `design-system.ts`, `case-studies.ts`, and most guard tests |
| `src/lib/utils/`                           | Pure utilities with colocated tests. Check here before writing a helper                                                             |
| `src/lib/stores/`                          | `theme.ts`, `scroll.ts`                                                                                                             |
| `src/lib/types/`                           | `common.ts`, `cost-guard.ts`, `dashboard.ts`                                                                                        |
| `src/lib/*.svelte.ts`                      | Runes classes: `db.svelte.ts`, `hud.svelte.ts`, `simulator.svelte.ts`                                                               |
| `static/`                                  | `_headers`, `_redirects`, `llms.txt`, `robots.txt`, `tokens.css`, `og/`, favicon                                                    |
| `svelte.config.js`                         | adapter-static and the CSP (`kit.csp`, hash mode)                                                                                   |

## Routes

| File                                                        | URL                                           |
| ----------------------------------------------------------- | --------------------------------------------- |
| `src/routes/(main)/+page.svelte`                            | `/`                                           |
| `src/routes/(main)/blog/+page.svelte`                       | `/blog`                                       |
| `src/routes/(main)/blog/[slug]/+page.svelte`                | `/blog/{slug}` (one per note in `content.ts`) |
| `src/routes/(main)/work/[slug]/+page.svelte`                | `/work/{slug}` (one per visible case study)   |
| `src/routes/(main)/models/+page.svelte`                     | `/models`                                     |
| `src/routes/(standalone)/ai-manifesto/+page.svelte`         | `/ai-manifesto`                               |
| `src/routes/infra/+page.svelte`                             | `/infra` (Cost-Guard dashboard)               |
| `src/routes/design-system/[card]/+page.svelte`              | `/design-system/{card}` previews              |
| `src/routes/og/[slug]/+page.svelte`                         | OG card render targets                        |
| `src/routes/{sitemap.xml,rss.xml,og/cards.json}/+server.ts` | Prerendered endpoints                         |

Route path constants live in `$lib/constants/routes` (`ROUTES.HOME`, `ROUTES.BLOG`, ...).

## Styling in one breath

Never hardcode a colour, size, radius, shadow, duration, width or spacing value. Use a token
from `app.css` (`var(--text-primary)`, `var(--space-md)`, `var(--type-sm)`,
`var(--radius-md)`, `var(--duration-base)`), and if none fits add one there and register it in
`design-tokens.ts`. Dark mode is the `.dark` class on `<html>`, which swaps token values only.
Details: [DESIGN_TOKENS.md](DESIGN_TOKENS.md) and `.interface-design/system.md`.

## Before you call it done

`pnpm test`, `pnpm lint`, `pnpm check`, `pnpm format`. The pre-commit hook runs the first
three; CI runs check, lint, test and build.
