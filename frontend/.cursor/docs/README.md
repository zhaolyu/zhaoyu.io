# zhaoyu.io developer docs (`frontend/.cursor/docs`)

Last verified against the code on 2026-10-04.

These pages are a convenience layer for editors that read `.cursor/`. They are not the source
of truth. When anything here disagrees with one of the sources below, the source wins and this
directory is the thing to fix.

| Question                                                              | Source of truth                                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Conventions, commands, structure, security and disclosure rules       | `CLAUDE.md` (repo root)                                                               |
| What the site should look like, and why                               | `.interface-design/brief.md`                                                          |
| How the design system is applied (token families, type roles, layout) | `.interface-design/system.md`                                                         |
| Token values                                                          | `frontend/src/app.css` (the only place they are defined)                              |
| Token index for previews                                              | `frontend/src/lib/constants/design-tokens.ts`, kept honest by `design-tokens.test.ts` |
| Component previews                                                    | `/design-system/{card}`, registered in `frontend/src/lib/constants/design-system.ts`  |
| Site copy                                                             | `frontend/src/lib/constants/content.ts`, edited through the `writer` skill            |

## Stack in one paragraph

SvelteKit 2 with Svelte 5 runes, TypeScript (strict), Tailwind CSS v4 via `@tailwindcss/vite`,
Vitest with jsdom, and `@sveltejs/adapter-static` (every route prerendered, `404.html` as the
SPA fallback, deployed to Cloudflare Pages). There is no backend: the only `+server.ts` files
(`sitemap.xml`, `rss.xml`, `og/cards.json`) are prerendered at build time. Commands run from
`frontend/` with pnpm.

## Pages in this directory

| Page                                                                     | What it covers                                                     |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md)                                 | Paths, commands and routes on one screen                           |
| [FILE_ORGANIZATION.md](FILE_ORGANIZATION.md)                             | Where code lives and how it is imported                            |
| [CODING_CONVENTIONS.md](CODING_CONVENTIONS.md)                           | Lint, format, naming, Svelte 5 and styling rules                   |
| [PATTERNS.md](PATTERNS.md)                                               | The patterns the codebase actually uses, with real file references |
| [DESIGN_TOKENS.md](DESIGN_TOKENS.md)                                     | Token families and how to add one                                  |
| [TESTING.md](TESTING.md)                                                 | What gets tested, where tests live, how to run them                |
| [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)                       | Setup, hooks, CI and the done checklist                            |
| [INTERSECTION_OBSERVER_UTILITIES.md](INTERSECTION_OBSERVER_UTILITIES.md) | `intersection-core.ts` and `section-observer.ts`                   |

## Other folders under `.cursor/`

- `rules/*.mdc`: Cursor rule files. They predate the current codebase in places (several
  describe `src/lib/services/`, `routes/api/` endpoints, npm scripts and Testing Library
  component tests, none of which exist). Treat `CLAUDE.md` as authoritative over them.
- `commands/generate-cursor-rules.md`: how to write a `.mdc` rule file.
- `scripts/check-browser-access.sh`: checks whether a local dev server is reachable on a
  port (usage: `./check-browser-access.sh [port]`).

## Keeping these pages honest

1. Verify every claim against `frontend/` before writing it: paths, exports, token names and
   values, scripts in `package.json`.
2. Prefer a pointer to the source of truth over a copy of it. Copies of token values are the
   part of these pages that rots first.
3. Update the "Last verified" line when you re-check a page.
