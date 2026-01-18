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
npm run lint         # Run lint
npm run lint:fix     # Fix linting issues
npm run format       # Format code
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage
```

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

**All components MUST support both light and dark modes.**

### Quick Reference

```svelte
<style>
	.component {
		background: var(--bg-primary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		transition: background-color 0.2s, color 0.2s, border-color 0.2s;
	}

	:global(.dark) .component {
		/* Theme-specific overrides if needed */
	}
</style>
```

### Available CSS Variables

- `--bg-primary`, `--bg-secondary`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-color`

See [Patterns](PATTERNS.md) for complete theme support examples.

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Build Errors
1. Check TypeScript: `npm run check`
2. Check lint: `npm run lint`
3. Review error messages

See [Development Workflow](DEVELOPMENT_WORKFLOW.md) for more troubleshooting tips.
