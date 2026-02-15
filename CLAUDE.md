# Principal Architect Framework – zhaoyu.io

SvelteKit 2 · Svelte 5 · TypeScript · Tailwind CSS v4 · Vitest · adapter-static (SPA + prerender)

---

## 1. Project Structure & Navigation

### Directory structure

```
frontend/
  src/
    lib/
      components/
        features/   # Feature-scoped Svelte components (hero, career-chart, etc.)
        layout/     # Layout components (nav, footer, wrappers)
        ui/         # Generic reusable UI primitives
      constants/    # config.ts, content.ts, routes.ts
      services/
        api/        # client.ts, endpoints.ts
      stores/       # Svelte stores (scroll.ts, theme.ts)
      types/        # Shared TypeScript types (api.ts, common.ts)
      utils/        # Pure utility functions (date, format, navigation, validation…)
    routes/
      (main)/       # Main layout group
        blog/[slug]/
        comparison/
      api/          # SvelteKit server endpoints (+server.ts)
      +layout.ts
```

### Imports

Use the SvelteKit `$lib` alias:

- `$lib/components/...`
- `$lib/stores/...`
- `$lib/utils/...`
- `$lib/constants/...`
- `$lib/services/...`
- `$lib/types/...`

Never use relative `../../` imports when `$lib` applies.

### Finding code

- **Semantic search**: concepts, flows, "where is X handled?"
- **Grep**: exact symbols, imports, filenames
- **Glob**: file patterns (e.g. `**/*.svelte`, `**/*.test.ts`)

---

## 2. Code Generation Workflow

Before marking code done:

1. **Plan first** – Use a plan for complex tasks (multi-file, architecture, unclear requirements).
2. **Review design** – SRP, DRY, KISS, YAGNI, separation of concerns, testability.
3. **Security check** – No secrets, validate inputs, safe error handling.
4. **Self-review** – Iteratively review and improve.
5. **Write tests** when applicable (new utils, stores, services, server endpoints, bug fixes). Not for `.svelte` component files or config-only files.
6. **Run tests** for the specific file(s) changed. Aim ≥90% coverage for new code.
7. **Run checks** – lint, type-check, format (see commands below).

### Design principles (quick reference)

| Principle | Rule |
|-----------|------|
| **SRP** | One function/component = one purpose |
| **DRY** | Check `$lib/utils/` first; reuse code |
| **KISS** | Prefer simplest implementation that meets requirements |
| **YAGNI** | Build only what's needed now |
| **Separation of concerns** | Separate data/UI/logic; stores for shared state |
| **Dependency injection** | Accept dependencies as parameters for testability |

Avoid: god components, copy-paste, tight coupling, magic numbers/strings, deep nesting, long functions.

### Commands

All commands must be run from the `frontend/` directory.

```bash
# Dev server
npm run dev

# Type-check
npm run check

# Tests for specific file
npx vitest run src/lib/utils/date.test.ts

# All tests
npm test

# Lint
npm run lint

# Lint fix
npm run lint:fix

# Format
npm run format

# Build
npm run build
```

---

## 3. Agent Workflow & Planning

### When to plan first

Use a structured plan (and get approval) before coding for:

- Multi-file changes or refactoring
- New features touching many components
- Complex business logic or architecture
- Unclear requirements

Direct coding is fine for: single-file bug fixes, adding tests, style-only changes, trivial utilities, simple renames.

### Plan mode workflow

1. **Research** – Search codebase, find dependencies and patterns.
2. **Clarify** – Ask questions if requirements are unclear.
3. **Plan** – File paths, steps, testing, security, risks.
4. **Review** – Present plan to user before implementing.
5. **Implement** – Execute; update plan if needed.
6. **Validate** – Tests, lint, type-check, self-review.

### Recursive improvement

After generating code: self-review (design, security, DRY, simplicity, errors, performance, tests), then iterate until satisfied. Final step: run tests and lint.

---

## 4. Principal-Architect Mindset

Apply a principal-level architect lens to design and implementation.

### Systems and boundaries

For non-trivial changes consider:

- **Affected areas**: routes, stores, services, components
- **Domain boundaries**: where logic lives; how data flows (store → component; server endpoint → client)
- **Dependencies**: what touches this change; avoid treating it in isolation

### Tradeoffs and NFRs

Consider: **performance**, **bundle size**, **accessibility**, **security**, **maintainability**. Prefer simple, evolutionary solutions; state when trading one concern for another.

### Fit

Align with existing patterns. Reuse `$lib/utils/`, stores, components, and service patterns before adding new abstractions.

### Principal-architect skill (design-heavy work)

When designing systems, new features, or refactors:

1. **Clarify constraints** – Time, scale, stack, conventions; ask 1–2 questions if needed.
2. **Identify boundaries** – Routes, stores, services, components; what breaks if this changes.
3. **List 2–3 options** – Include "minimal change" and a "clean long-term" option where relevant.
4. **For each option**: pros/cons; impact on NFRs; fit with codebase; risks and debt.
5. **Recommendation** – One clear recommendation with 1–2 sentence justification; state any debt or migration path.

---

## 5. Utilities (DRY)

**Mandatory**: Before writing any utility or shared helper, check `$lib/utils/`.

### Existing utils

- `date.ts` – date formatting/parsing
- `format.ts` – string/number formatting
- `navigation.ts` – routing helpers
- `validation.ts` – input validation
- `intersection-core.ts` – IntersectionObserver core logic
- `section-observer.ts` – section visibility tracking

### When to use vs extend vs create

- **Use existing** when it matches (even if not 100%); extend with params if close.
- **Create new** only when nothing similar exists, it's reusable, pure or well-defined side effects, and testable.

### New utility requirements

- Colocate a `*.test.ts` alongside; ≥90% coverage; use `$lib` imports; lint must pass.

---

## 6. ESLint & Prettier

- **Semicolons**: always.
- **no-console**: warning — avoid `console.log` in committed code; use sparingly for debugging.
- **svelte/no-at-html-tags**: warning — avoid `{@html}` unless explicitly needed and trusted.
- **TypeScript**: `@typescript-eslint/no-unused-vars` – prefix unused vars/args with `_`.
- **Prettier**: `prettier-plugin-svelte` — always run `npm run format` before committing.

---

## 7. Coding Conventions

### Naming

- Components: PascalCase (`.svelte` files). Functions/variables: camelCase. Constants: UPPER_SNAKE_CASE. Types/interfaces: PascalCase.

### Svelte 5 patterns

- Use **runes** (`$state`, `$derived`, `$effect`, `$props`) — this project targets Svelte 5.
- Prefer `$props()` over legacy `export let` for component props.
- Use `$lib` stores (`scroll.ts`, `theme.ts`) for cross-component shared state.

### Components

- Place feature components under `src/lib/components/features/<feature-name>/`.
- Expose via barrel `index.ts` for clean imports.
- Keep components focused; extract logic to utils or stores when it grows.

### Security

- No hardcoded secrets; use env vars.
- Validate and sanitize user input (especially in `src/routes/api/` server endpoints).
- Error handling must not expose sensitive data.

### Avoid

- Magic numbers/strings (use named constants from `$lib/constants/`), inline styles (use Tailwind classes), `console` in production, missing error handling.

---

## 8. Testing (Vitest + jsdom)

- Framework: **Vitest** with `jsdom` environment and `globals: true`.
- Test files: `src/**/*.{test,spec}.{js,ts}` — colocate with source files.
- Use `import` (ES modules); no `require()`.
- Test pure utils and stores; do not test `.svelte` components unless explicitly asked.
- Run tests for the specific file(s) changed; aim ≥90% coverage for new util/service code.
- Tests must pass lint (`npm run lint`).

---

## 9. API Endpoints (`src/routes/api/`)

When adding or changing SvelteKit server endpoints (`+server.ts`):

- **Rate limiting**: consider adding rate limiting for public POST endpoints.
- **CORS**: SvelteKit handles CORS via hooks; do not hardcode `Access-Control-Allow-Origin: *`.
- **Auth**: if endpoints require auth, use consistent middleware/hooks patterns.
- **Validation**: always validate request body/params before processing.
- Return proper HTTP status codes (200, 400, 404, 500).

---

## Quick reference

| Area | Action |
|------|--------|
| **Before new code** | Check `$lib/utils/`; plan if complex |
| **Design** | SRP, DRY, KISS, YAGNI; principal-architect for design-heavy work |
| **Security** | No secrets; validate input; safe errors |
| **Tests** | Vitest; colocate `*.test.ts`; run for changed files; ≥90% coverage for new code |
| **Lint** | `npm run lint:fix`; `npm run format`; `npm run check` |
| **TypeScript** | This is a TypeScript project — always run `npm run check` |
| **Imports** | Use `$lib/...` aliases; never relative `../../` when avoidable |
