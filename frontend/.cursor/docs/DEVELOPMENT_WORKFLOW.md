# Development Workflow

Last verified against the code on 2026-10-04. `CLAUDE.md` (repo root) is authoritative.

## Setup

- Node.js 24.13.0 (`frontend/.nvmrc`) and pnpm (`packageManager: pnpm@10.30.2`).
- No `.env` is needed: the site is static and has no backend. Anything in `src/` or `static/`
  ships to the browser, so never put a secret there. Ingestion signing secrets live only in
  GitHub Actions secrets (`.github/workflows/cost-guard.yml`).

```bash
cd frontend
pnpm install          # also points git at frontend/.husky via the prepare script
pnpm dev              # http://localhost:5173
```

## Day to day

| Task                 | Command                                                                           |
| -------------------- | --------------------------------------------------------------------------------- |
| Dev server           | `pnpm dev`                                                                        |
| Type check           | `pnpm check` (`pnpm check:watch` to watch)                                        |
| Lint                 | `pnpm lint`, `pnpm lint:fix`                                                      |
| Format               | `pnpm format`                                                                     |
| Tests                | `pnpm test`, `pnpm test:watch`, `pnpm vitest run <file>`                          |
| Production build     | `pnpm build` (runs `pnpm tokens` first), then `pnpm preview`                      |
| OG images            | `pnpm og` after a build, whenever the hero tagline or a note title or tag changes |
| Design-system bundle | `pnpm build && pnpm design-system` (writes `design-system/`, gitignored)          |

## Git hooks (`frontend/.husky/`)

- **pre-commit**: `lint-staged` (ESLint `--fix` on staged `.ts`, `.js`, `.svelte`), then
  `check`, `lint` and the full test suite. A failing guard test blocks the commit.
- **pre-push**: refuses a direct push to `main`. Work on a branch and open a PR.

## CI (`.github/workflows/ci.yml`)

Separate jobs for type check, lint, test and build (each `pnpm install --frozen-lockfile`
then `pnpm run ...`), plus a Cloudflare Pages preview deployment for non-draft PRs.
`cloudflare-pages.yml` deploys production on merges to `main` (and on manual dispatch);
`cost-guard.yml` is a manual-only workflow that posts a cost snapshot to the `/infra`
ingestion.

## Making a change

1. Plan first (and get approval) for multi-file changes, new features or unclear
   requirements. Single-file fixes, tests and style tweaks can go straight to code.
2. Check `src/lib/utils/` before writing a helper, and `app.css` before reaching for a
   literal value.
3. Copy edits go through the `writer` skill; new notes and surface rewrites also get a
   `writer-judge` verdict in the PR body.
4. Write tests for new utils, stores, runes classes and endpoints (not `.svelte` files).

## Verifying UI work

- Run `pnpm dev` and check the page in a browser at phone width (about 375px) and desktop
  width, in both themes (toggle in the nav; the theme is the `.dark` class on `<html>`).
- Check with reduced motion and with JavaScript off where it matters: content must still be
  visible, because reveals are animation-only and every route is prerendered.
- `pnpm build && pnpm preview` is the closest check to production (prerender errors and CSP
  issues only show up there).
- If you change the inline theme script in `app.html`, recompute its sha256 in the CSP in
  `svelte.config.js`. New external origins must be added to the CSP directives.

## Done checklist

1. Design review: SRP, DRY, KISS, YAGNI, security, disclosure rules in `CLAUDE.md`.
2. Tests written for new logic; `pnpm test` passes.
3. `pnpm lint` and `pnpm check` clean.
4. `pnpm format` run.
