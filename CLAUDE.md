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
      services/
        api/         # client.ts, endpoints.ts
      stores/        # scroll.ts, theme.ts
      types/         # api.ts, common.ts
      utils/         # pure utility functions
    routes/
      (main)/        # main layout group
        blog/[slug]/
        comparison/
      api/           # SvelteKit server endpoints (+server.ts)
      +layout.ts
```

### Imports

Always use `$lib/...` aliases — never relative `../../` paths.

- `$lib/components/...` · `$lib/stores/...` · `$lib/utils/...`
- `$lib/constants/...` · `$lib/services/...` · `$lib/types/...`

---

## Commands

```bash
npm run dev          # dev server
npm run check        # type-check
npm run lint         # lint
npm run lint:fix     # lint + autofix
npm run format       # prettier
npm test             # all tests
npx vitest run src/lib/utils/date.test.ts  # single file
npm run build        # build
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

- `date.ts` – date formatting/parsing
- `format.ts` – string/number formatting
- `navigation.ts` – routing helpers
- `validation.ts` – input validation
- `intersection-core.ts` – IntersectionObserver core logic
- `section-observer.ts` – section visibility tracking

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
- No hardcoded secrets — use env vars.
- Validate and sanitize user input in `src/routes/api/` endpoints.
- Error handling must not expose sensitive data.

---

## ESLint & Prettier

- **Semicolons**: always.
- **no-console**: warning — avoid in committed code.
- **svelte/no-at-html-tags**: warning — avoid `{@html}` unless trusted.
- **Unused vars**: prefix with `_` (`@typescript-eslint/no-unused-vars`).
- Always run `npm run format` before committing.

---

## Testing

- Framework: Vitest + jsdom, `globals: true`.
- Colocate test files as `*.test.ts` or `*.spec.ts` next to source.
- Use ES module `import`; no `require()`.
- Test utils, stores, services, and server endpoints. Do not test `.svelte` files.

---

## API Endpoints (`src/routes/api/`)

- Validate all request body/params before processing.
- Consider rate limiting for public POST endpoints.
- Do not hardcode `Access-Control-Allow-Origin: *` — SvelteKit hooks handle CORS.
- Return correct HTTP status codes (200, 400, 404, 500).
- Never expose sensitive data in error responses.
