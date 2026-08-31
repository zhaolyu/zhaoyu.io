# zhaoyu.io – Claude Instructions

SvelteKit 2 · Svelte 5 · TypeScript · Tailwind CSS v4 · Vitest · adapter-static (SPA + prerender)

---

## Project Structure

```
frontend/            ← all commands run from here
  src/
    lib/
      components/
        features/    # feature-scoped Svelte components
        layout/      # nav, footer, wrappers
        ui/          # generic reusable primitives
      constants/     # config.ts, content.ts, routes.ts
      stores/        # scroll.ts, theme.ts
      types/         # api.ts, common.ts, cost-guard.ts
      utils/         # pure utility functions
      db.svelte.ts        # Cost-Guard PGlite + ElectricSQL sync engine (runes class)
      hud.svelte.ts       # Architect HUD telemetry state (runes class)
      simulator.svelte.ts # cost what-if simulator state (runes class)
    routes/
      (main)/        # main layout group: landing page + blog/[slug]/
      (standalone)/  # ai-manifesto (own layout)
      infra/         # Cost-Guard dashboard (prerendered shell; PGlite is imported on mount)
      sitemap.xml/   # prerendered +server.ts endpoint (the only server route)
      +layout.ts
```

### Case studies

`src/lib/constants/case-studies.ts` is the registry for long-form case studies at
`/work/{slug}`. Entries are decision records — context, constraints, options,
decision, architecture, measured outcomes (each with a basis), what went wrong,
my-role-vs-team — and `case-studies.test.ts` rejects anything thinner (≥1,200
words, ≥1 https source, related notes must resolve). A `featureFlag` hides a
study from the page, sitemap, OG set, and llms.txt together; embargoed studies
stay out of the repo entirely (same disclosure policy as content.ts).

There is no backend in this repo: the site is fully static (adapter-static, SPA fallback + prerender). `sitemap.xml/+server.ts` is prerendered at build time; there are no runtime API endpoints.

### Imports

Always use `$lib/...` aliases — never relative `../../` paths.

- `$lib/components/...` · `$lib/stores/...` · `$lib/utils/...`
- `$lib/constants/...` · `$lib/types/...`

---

## Commands

```bash
pnpm dev             # dev server
pnpm check           # type-check
pnpm lint            # lint
pnpm lint:fix        # lint + autofix
pnpm format          # prettier
pnpm test            # all tests
pnpm vitest run src/lib/utils/navigation.test.ts  # single file
pnpm build           # build
```

---

## Design Principles

| Principle                  | Rule                                            |
| -------------------------- | ----------------------------------------------- |
| **SRP**                    | One function/component = one purpose            |
| **DRY**                    | Check `$lib/utils/` before writing anything new |
| **KISS**                   | Simplest implementation that meets requirements |
| **YAGNI**                  | Build only what's needed now                    |
| **Separation of concerns** | Data/UI/logic separate; stores for shared state |

Avoid: god components, copy-paste, tight coupling, magic strings/numbers, deep nesting.

### When to plan first

Plan (and get approval) before coding when: multi-file changes, new features touching many components, complex business logic, or unclear requirements. Single-file fixes, tests, style changes, and trivial utils can be coded directly.

### Before marking code done

1. Review design — SRP, DRY, KISS, YAGNI, security.
2. Write tests for new utils/stores/services/endpoints; not for `.svelte` files.
3. Run tests for changed files; aim ≥90% coverage for new code.
4. Run lint, type-check, format.

---

## Design System

`src/app.css` is the single source of truth for tokens. **Never hardcode a colour, size, radius, shadow, duration, or spacing value in a component** — reach for a token, and if none fits, add it to `app.css` rather than inventing a local literal.

| Family                      | Tokens                                                                    | Notes                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Colour roles                | `--bg-*`, `--text-*`, `--border-color`, `--accent-*`, `--status-*`        | Roles, not hues. `.dark` swaps values only.                                                                                |
| Accent as text              | `--accent-primary-text`, `--accent-{professional,independent,experiment}` | Theme-flipped for AA contrast. `--accent-primary-light` is for **fills/dots/borders only** — it fails AA as text on light. |
| Surfaces & scrims           | `--surface-raised`, `--scrim-*`, `--border-subtle\|soft`, `--ink-*`       | Ink-on-surface alphas; invert under `.dark`.                                                                               |
| Type                        | `--type-2xs…4xl`, `--leading-*`, `--tracking-*`, `--weight-*`             | Size/leading/tracking are separate — they don't pair 1:1.                                                                  |
| Spacing                     | `--space-2xs…5xl`                                                         | Step names, never numeric: the scale is non-linear.                                                                        |
| Rhythm                      | `--section-y`, `--section-y-lg`, `--section-y-mobile`, `--section-x`      | `-lg` only for sections that deliberately breathe more.                                                                    |
| Radius / elevation / motion | `--radius-*`, `--shadow-*`, `--duration-*`, `--ease-*`                    | Shadows are redefined under `.dark`.                                                                                       |

### Rules that are enforced by tests

- `design-tokens.ts` mirrors `app.css` so previews can enumerate tokens. `design-tokens.test.ts` parses `app.css` and **fails on drift** — add a token to a covered family and you must register it.
- Type hierarchy on cards: **classification > measurement > description**. Mono is reserved for measured values and identifiers; descriptive labels use sans. Don't put everything in mono-uppercase.
- Sections render their content **always**; reveals are animation-only, gated on `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`. Never hide content behind `{#if visible}` — it won't prerender.

### Claude Design hand-off

`/design-system` prerenders one preview page per card from the **real components**, so a card can't drift from what ships. `src/lib/constants/design-system.ts` is the card registry.

```bash
pnpm build && pnpm design-system   # writes design-system/ (gitignored)
```

Then, from a **local** terminal — design sync needs an interactive login a remote web session can't perform — run `/design-sync` and push component by component, never wholesale.

---

## Writing Content

**Always invoke the `writer` skill before writing or editing any user-facing prose** —
engineering notes, hero and bio copy, project and persona blurbs, the AI manifesto, meta
descriptions, or `llms.txt`. It carries the voice spec, the measured shape of a note, the
per-surface constraints, and the publish checklist (content.ts → llms.txt → `pnpm og` →
tests). Site copy lives in `src/lib/constants/content.ts` and is covered by tests, so
prose edits go through the same gates as code. Before a new note, essay, or surface
rewrite ships, the `writer-judge` skill renders an independent verdict from a context
that did not author the draft (maker-checker for prose); the deterministic tests are the
floor, the judge is the review, and its verdict goes in the PR body.

---

## Utilities

**Check `$lib/utils/` before writing any helper.** Existing utils:

- `navigation.ts` – routing/anchor-navigation helpers
- `intersection-core.ts` – IntersectionObserver core logic
- `section-observer.ts` – section visibility tracking
- `cost-projection.ts` – Cost-Guard aggregation/projection math
- `cost-guard-display.ts` – Cost-Guard snapshot display formatting
- `feature-flags.ts` – filters content items by `FEATURE_FLAGS` (config.ts)
- `note-excerpt.ts` – strips HTML and truncates a note for excerpt cards

New utils require a colocated `*.test.ts` with ≥90% coverage.

---

## Coding Conventions

### Naming

- Components: PascalCase. Functions/variables: camelCase. Constants: UPPER_SNAKE_CASE. Types/interfaces: PascalCase.

### Svelte 5

- Use runes: `$state`, `$derived`, `$effect`, `$props`.
- Prefer `$props()` over `export let`.
- Use `$lib` stores for cross-component shared state.

### Components

- Feature components: `src/lib/components/features/<name>/`
- Barrel export via `index.ts` in each folder.

### Security

- No hardcoded secrets — this is a static site; anything in `src/` or `static/` ships to the client.
- **Scope claims on this site are load-bearing and constrained.** This list is itself public — state each rule without spelling the thing it protects (see the header of `disclosure-guard.test.ts` for why).
  1. Zhao manages a direct team of 8 engineers and 2 QE and _co-leads_ a ~20-engineer rebuild across three teams. Never write "directs," "leads," or "runs" a 20-engineer organization, in page copy or in `llms.txt`.
  2. Architecture he can describe is not architecture he owns. He works _across_ the Apollo Federation supergraph and defines how upstream services shape its responses; he does not own gateway config, Router policy, or supergraph composition. Use "works across" or "builds against."
  3. Do not characterize the graph's federation depth or claim cross-entity federation across it. One subgraph is entity-aware; most contribute independent root fields. Do not name subgraph counts, the entity-aware subgraph, or the service inventory — internal architecture topology is not public.
  4. The AI assistant is a limited production beta plus org-wide AI governance, never a site-wide production surface. Its cohort size, rollout dates, pipeline internals, and evaluation suite are **in-person material only** — they do not go on any surface of this site, in any phrasing, however impressive they are. Describe the work only at the level Versant has disclosed publicly. What ships publicly is the 0→1 role, the cross-functional scope including editorial, and the interface architecture.
  5. Do not attribute the observability instrumentation or the evaluation criteria to him — the instrumentation is the backend team's and the criteria came from editorial. Describe what the system ships with, and do not name the vendors.
  6. Every number stays sourced inline, per the site's own stated standard.

  `positioning.test.ts` fails the build on each retired phrasing; `disclosure-guard.test.ts` catches the unsourced figures.
- **Disclosure policy (employer facts).** Versant is a public company. Every employer-related number on any surface — copy, `<meta>`, JSON-LD, `llms.txt`, OG cards — carries a public source from `SOURCES` in `content.ts`; nothing Versant/CNBC has not disclosed publicly is stated anywhere. `disclosure-guard.test.ts` holds the deny-list and scans every surface; `content.test.ts` enforces basis + source on metrics. A feature flag is not an exemption: `content.ts` is bundled into client JS whether or not a card renders, so embargoed copy stays out of the repository entirely until it is public.
- Ingestion signing secrets live only in GitHub Actions secrets (see `.github/workflows/cost-guard.yml`).
- CSP is configured in `svelte.config.js` (`kit.csp`, hash mode) and other security headers in `static/_headers`. If you change the inline theme script in `app.html`, recompute its sha256 in the CSP `script-src`. New external origins (fetch/fonts/images) must be added to the CSP directives.
- GitHub Actions are pinned to commit SHAs; Dependabot keeps them and npm deps updated.
- Error handling must not expose sensitive data.

---

## ESLint & Prettier

- **Semicolons**: always.
- **no-console**: warning — avoid in committed code.
- **svelte/no-at-html-tags**: warning — avoid `{@html}` unless trusted.
- **Unused vars**: prefix with `_` (`@typescript-eslint/no-unused-vars`).
- Always run `pnpm format` before committing.

---

## Testing

- Framework: Vitest + jsdom, `globals: true`.
- Colocate test files as `*.test.ts` or `*.spec.ts` next to source.
- Use ES module `import`; no `require()`.
- Test utils, stores, and the `sitemap.xml` server route. Do not test `.svelte` files.
