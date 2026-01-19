# Quick Reference

Quick lookup guide for common paths, commands, and links to detailed documentation.

## Documentation Links

- [File Organization](FILE_ORGANIZATION.md) - Directory structure and locating code
- [Coding Conventions](CODING_CONVENTIONS.md) - Code style and conventions
- [Development Workflow](DEVELOPMENT_WORKFLOW.md) - Setup and development process
- [Patterns](PATTERNS.md) - Common code patterns and examples
- [Testing](TESTING.md) - Testing guide and patterns

## Common File Paths

| Path | Purpose |
|------|---------|
| `src/routes/` | File-based routing (pages) |
| `src/lib/components/` | Reusable components |
| `src/routes/+layout.svelte` | Root layout component |
| `src/app.css` | Global styles |
| `static/` | Static public assets |
| `src/lib/utils/` | Utility functions |
| `src/lib/stores/` | Svelte stores |
| `src/lib/services/` | API clients and services |
| `src/lib/types/` | TypeScript type definitions |
| `src/lib/constants/` | Shared constants |

See [File Organization](FILE_ORGANIZATION.md) for complete directory structure and navigation guide.

## Development Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run check        # Run type check
npm run lint         # Run lint (MANDATORY - must pass before completing code)
npm run lint:fix     # Fix linting issues
npm run format       # Format code
```

### Testing
```bash
npm run test         # Run tests (MANDATORY - must pass before completing code)
npm run test:watch   # Run tests in watch mode
npm run test:ui       # Run tests in UI mode
npm run test -- --coverage  # Run tests with coverage
```

**⚠️ IMPORTANT**: Both `npm run test` and `npm run lint` MUST pass before marking any code task as complete. CI will fail otherwise.

See [Development Workflow](DEVELOPMENT_WORKFLOW.md) for detailed setup and workflow information.

## File-Based Routing

| File | Route |
|------|-------|
| `src/routes/+page.svelte` | `/` |
| `src/routes/about/+page.svelte` | `/about` |
| `src/routes/blog/[slug]/+page.svelte` | `/blog/[slug]` |

See [File Organization](FILE_ORGANIZATION.md) for complete routing information.

## Common Patterns

For complete code examples and patterns, see:
- [Patterns](PATTERNS.md) - Svelte components, stores, data fetching, layouts, styling, API routes
- [Coding Conventions](CODING_CONVENTIONS.md) - Component structure, naming, imports

## Theme Support (Light & Dark Mode)

**MANDATORY: All components MUST support both light and dark modes. This is REQUIRED for ALL code generation.**

### Critical Rules

- ✅ **ALWAYS use CSS variables** - Never hardcode colors
- ✅ **Never use** `bg-white dark:bg-neutral-950` or similar hardcoded Tailwind color classes
- ✅ **Always use** `var(--bg-primary)`, `var(--text-primary)`, `var(--border-color)`, etc.
- ✅ **Always add transitions** for smooth theme switching

### Quick Reference

```svelte
<style>
	.component {
		background: var(--bg-primary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		transition: background-color 0.2s, color 0.2s, border-color 0.2s;
	}

	.component:hover {
		background: var(--bg-secondary);
	}

	:global(.dark) .component {
		/* Theme-specific overrides only if absolutely necessary */
	}
</style>
```

### Anti-Pattern (DO NOT DO THIS)

```svelte
<!-- ❌ WRONG: Hardcoded colors -->
<div class="bg-white dark:bg-neutral-950 text-black dark:text-white">
	Content
</div>

<!-- ✅ CORRECT: CSS variables -->
<div class="component">
	Content
</div>

<style>
	.component {
		background: var(--bg-primary);
		color: var(--text-primary);
	}
</style>
```

### Available CSS Variables

**Theme Variables:**
- `--bg-primary`, `--bg-secondary`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-color`

**Font Variables:**
- `--font-sans`: Geist Sans (default for all text)
- `--font-mono`: Geist Mono (for code, badges, etc.)

See [Patterns](PATTERNS.md) for complete theme support and font usage examples.

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Build Errors
1. Check TypeScript: `npm run check`
2. Check lint: `npm run lint` (must pass)
3. Check tests: `npm run test` (must pass)
4. Review error messages

### Before Completing Code
**MANDATORY**: Run these commands and ensure both pass:
```bash
npm run test  # Must pass
npm run lint  # Must pass with zero errors
```

See [Development Workflow](DEVELOPMENT_WORKFLOW.md) for more troubleshooting tips.
