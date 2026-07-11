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
      infra/         # Cost-Guard dashboard (ssr = false)
      sitemap.xml/   # prerendered +server.ts endpoint (the only server route)
      +layout.ts
```

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

| Principle | Rule |
|-----------|------|
| **SRP** | One function/component = one purpose |
| **DRY** | Check `$lib/utils/` before writing anything new |
| **KISS** | Simplest implementation that meets requirements |
| **YAGNI** | Build only what's needed now |
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

## Utilities

**Check `$lib/utils/` before writing any helper.** Existing utils:

- `navigation.ts` – routing/anchor-navigation helpers
- `intersection-core.ts` – IntersectionObserver core logic
- `section-observer.ts` – section visibility tracking
- `cost-projection.ts` – Cost-Guard aggregation/projection math
- `cost-guard-display.ts` – Cost-Guard snapshot display formatting

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
