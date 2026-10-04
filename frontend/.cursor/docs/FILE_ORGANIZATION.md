# File Organization

Last verified against the code on 2026-10-04. `CLAUDE.md` (repo root) is authoritative.

> This page replaces an older version that described folders the repo never had
> (`src/lib/services/`, `routes/api/`, `routes/about/`, `api-demo/`, `comparison/`,
> `ui/Button.svelte`, `utils/date.ts`).

## Repository

```
zhaoyu.io/
├── CLAUDE.md, AGENTS.md      # agent instructions (CLAUDE.md is the source of truth)
├── .interface-design/        # brief.md (visual intent) and system.md (design-system rules)
├── .claude/skills/           # writer, writer-judge, research, distribute
├── .github/workflows/        # ci.yml, cloudflare-pages.yml, cost-guard.yml
└── frontend/                 # the SvelteKit app; every command runs from here
```

## `frontend/`

```
frontend/
├── .cursor/                  # these docs, Cursor rules and commands
├── .design-sync/             # Claude Design hand-off: config.json, conventions.md, NOTES.md
├── .husky/                   # pre-commit (lint-staged, check, lint, test), pre-push (blocks main)
├── scripts/                  # Node scripts: tokens, OG images, design-system bundle, draft-lint, artifact-guard
├── static/                   # served as-is: _headers, _redirects, llms.txt, robots.txt, tokens.css, og/
├── src/
│   ├── app.html              # shell + inline theme-init script (hash pinned in the CSP)
│   ├── app.css               # all design tokens and global styles
│   ├── app.print.css         # print styles
│   ├── lib/                  # see below
│   └── routes/               # see below
├── svelte.config.js          # adapter-static, prerender, CSP
├── vite.config.js            # sveltekit() + tailwindcss(), port 5173
└── vitest.config.ts          # jsdom, globals, $lib alias
```

## `src/lib/`

```
lib/
├── components/
│   ├── index.ts              # re-exports ui/ and layout/ (not features/)
│   ├── ui/                   # primitives: SectionHeader, StatCard, StatusPill, DataTable,
│   │                         #   Segmented, BrowserMock, TokenStream, chart/{ChartFrame,AnnotatedLineChart}
│   ├── layout/               # Navbar, StandaloneNavbar, TelemetryFooter, ThemeToggle
│   ├── features/<name>/      # one folder per feature, each with index.ts
│   │                         #   (hero, work, notes, models, case-study, skills, persona, connect,
│   │                         #    career-chart, code-manifesto, latency-sim, builder,
│   │                         #    architect-hud, cost-chart, cost-filter, cost-simulator)
│   └── design-system/        # preview-only helpers (TokenGrid) for /design-system
├── constants/                # content.ts (all copy), config.ts, routes.ts, design-tokens.ts,
│                             #   design-system.ts, case-studies.ts, models.ts, og.ts,
│                             #   structured-data.ts, voice-rules.ts, plus the guard tests
├── stores/                   # theme.ts, scroll.ts (+ index.ts)
├── types/                    # common.ts, cost-guard.ts, dashboard.ts (+ index.ts)
├── utils/                    # pure helpers with colocated tests (+ index.ts)
├── db.svelte.ts              # Cost-Guard PGlite + ElectricSQL sync (runes class)
├── hud.svelte.ts             # Architect HUD telemetry state (runes class)
└── simulator.svelte.ts       # cost what-if simulator state (runes class)
```

Utilities in `src/lib/utils/` today: `navigation`, `intersection-core`, `section-observer`,
`cost-projection`, `cost-guard-display`, `feature-flags`, `note-excerpt`, `note-groups`.
Check them before writing a helper.

## `src/routes/`

```
routes/
├── +layout.svelte            # imports app.css, font preload, skip link
├── +layout.ts                # prerender = true for every route
├── +error.svelte
├── (main)/                   # Navbar + TelemetryFooter layout
│   ├── +page.svelte          # /
│   ├── blog/                 # /blog and /blog/[slug]
│   ├── work/[slug]/          # /work/{slug} case studies
│   └── models/               # /models
├── (standalone)/             # own layout (StandaloneNavbar)
│   └── ai-manifesto/         # /ai-manifesto
├── infra/                    # /infra Cost-Guard dashboard (prerendered shell)
├── design-system/            # /design-system and /design-system/[card] previews
├── og/                       # og/[slug] card pages + og/cards.json, used by `pnpm og`
├── sitemap.xml/              # prerendered +server.ts
└── rss.xml/                  # prerendered +server.ts
```

Parenthesised folders are layout groups and do not appear in URLs.

## Imports

- Always `$lib/...`; never relative `../../` paths across `src/lib`.
- UI and layout components: from their category barrel (`$lib/components/ui`,
  `$lib/components/layout`) or the top barrel (`$lib/components`).
- Feature components: from their own folder (`$lib/components/features/hero`).
- Utilities, stores, constants, types: from the module (`$lib/utils/section-observer`) or the
  folder barrel (`$lib/stores`, `$lib/constants`, `$lib/types`).

## Where to put new code

| Adding                          | Goes in                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| A landing section or feature UI | `lib/components/features/<name>/` + `index.ts`                                       |
| A reusable primitive            | `lib/components/ui/` + `ui/index.ts` + a card in `design-system.ts`                  |
| A pure helper                   | `lib/utils/<name>.ts` + `<name>.test.ts` + `utils/index.ts`                          |
| Copy                            | `lib/constants/content.ts`, via the `writer` skill                                   |
| A token                         | `src/app.css` + `design-tokens.ts` (see [DESIGN_TOKENS.md](DESIGN_TOKENS.md))        |
| A page                          | `routes/(main)/<path>/+page.svelte`, plus a `ROUTES` entry and the sitemap if public |
