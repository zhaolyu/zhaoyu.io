# Coding Conventions

This document outlines the coding standards and conventions used in the zhaoyu.io portfolio site.

## ESLint Configuration

**Configuration File**: `.eslintrc.js` or `eslint.config.js` (if using flat config)

### Base Configuration

- **Extends**: Project-specific ESLint config or SvelteKit recommended config
- **Parser**: `@typescript-eslint/parser` for TypeScript files, `svelte-eslint-parser` for Svelte files
- **Environments**: `browser`, `node`

### Key Rules

- `no-console`: `warn` or `error` - Console statements should be avoided in production
- `semi`: `['error', 'always']` - Requires semicolons
- TypeScript strict mode enabled

## Prettier Configuration

**Configuration File**: `.prettierrc` or `prettier.config.js`

### Settings

- `printWidth`: `100` - Maximum line length
- `singleQuote`: `true` - Use single quotes
- `trailingComma`: `'all'` - Trailing commas wherever possible
- `bracketSpacing`: `true` - Spaces inside object literals

### Usage

Run Prettier to format code:
```bash
npm run format  # or npm run lint:fix
```

## TypeScript Configuration

**Configuration File**: `tsconfig.json`

- Strict mode enabled
- Type checking for `.ts` and `.svelte` files
- `$lib` alias configured for `src/lib/`

## Naming Conventions

### Components

- **Svelte Components**: PascalCase (e.g., `Welcome.svelte`, `Layout.svelte`)

### Functions and Variables

- **camelCase** for functions and variables: `fetchData`, `userName`, `isLoading`

### Constants

- **UPPER_SNAKE_CASE** for constants: `API_BASE_URL`, `MAX_RETRIES`

### Files and Directories

- **PascalCase** for component files: `Welcome.svelte`, `Button.svelte`
- **camelCase** for utility files: `formatDate.ts`, `apiClient.ts`
- **kebab-case** for config files: `svelte.config.js`

## Import Conventions

### SvelteKit $lib Alias (Recommended)

Use SvelteKit's `$lib` alias for imports from `src/lib/`:

```typescript
// Preferred
import { formatDate } from '$lib/utils/date';
import { theme } from '$lib/stores/theme';
import Button from '$lib/components/Button.svelte';
```

### Relative Imports

Use relative imports when appropriate:

```typescript
// Relative imports
import Component from '../lib/components/Component.svelte';
import { formatDate } from '../lib/utils/date';
```

### Import Order

While not strictly enforced, typical order:
1. Svelte imports (for `.svelte` files)
2. Third-party libraries
3. Application imports (components, utils, stores) using `$lib` alias
4. Relative imports
5. Styles

```svelte
<!-- Svelte component example -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import Button from '$lib/components/Button.svelte';
	import '../app.css';
</script>
```

## Component Conventions

### Svelte Components

```svelte
<script lang="ts">
	// Component script (TypeScript)
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description }: Props = $props();
</script>

<article class="card">
	<h2>{title}</h2>
	{#if description}
		<p>{description}</p>
	{/if}
</article>

<style>
	.card {
		padding: 1rem;
	}
</style>
```

### Svelte Components with Reactivity

```svelte
<script lang="ts">
	let count = $state(0);

	function increment() {
		count++;
	}
</script>

<button on:click={increment} class="btn btn-primary">
	Clicked {count} times
</button>
```

## Code Style

- 2 spaces indentation (tabs converted to spaces)
- Single quotes for strings
- Always use semicolons
- Always use braces for if/for/while
- Use TypeScript for type safety

## Comments and Documentation

**Minimize inline comments** - Write self-documenting code through clear naming and structure. Only add inline comments when the code's intent is genuinely unclear.

**Use JSDoc/TSDoc for function/component documentation**:

```typescript
/**
 * Formats a date string according to the specified format pattern.
 * @param date - The date to format
 * @param format - Format pattern (e.g., 'MM/DD/YYYY')
 * @returns Formatted date string
 */
const formatDate = (date: Date | string, format: string): string => {
	// Implementation
};
```

**Avoid:**
- Redundant comments that restate what the code does
- Commented-out code (remove it instead)
- Excessive inline explanations for straightforward code

**Prefer:**
- Clear variable and function names
- JSDoc/TSDoc for exported functions and components
- Brief comments only for complex business logic or non-obvious behavior

## SOLID Principles

Follow SOLID principles for maintainable code:

- **Single Responsibility**: Each function/component does one thing well
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Clients shouldn't depend on interfaces they don't use
- **Dependency Inversion**: Depend on abstractions, not concretions

## Styling Conventions

### Theme Support (MANDATORY)

**CRITICAL**: All components MUST support both light and dark modes using CSS variables. Never hardcode colors.

**Required CSS Variables**:
- `var(--bg-primary)` - Main background
- `var(--bg-secondary)` - Secondary background
- `var(--text-primary)` - Main text color
- `var(--text-secondary)` - Secondary text color
- `var(--text-muted)` - Muted text color
- `var(--border-color)` - Border color

**Always add transitions**: `transition: background-color 0.2s, color 0.2s, border-color 0.2s`

### Tailwind CSS

Use Tailwind utility classes for layout and spacing, but **ALWAYS use CSS variables for colors**:

```svelte
<!-- ✅ CORRECT: Use Tailwind for layout, CSS variables for colors -->
<div class="flex items-center justify-between p-4 rounded-lg shadow-md card">
	<h2 class="text-2xl font-bold card-title">Title</h2>
</div>

<style>
	.card {
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		transition: background-color 0.2s, border-color 0.2s;
	}

	.card-title {
		color: var(--text-primary);
		transition: color 0.2s;
	}
</style>
```

```svelte
<!-- ❌ INCORRECT: Hardcoded colors -->
<div class="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 rounded-lg">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Title</h2>
</div>
```

### Scoped Styles (Svelte)

```svelte
<style>
	.card {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.card:hover {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
</style>
```

## Best Practices

1. **Use Svelte reactivity** - Leverage Svelte's reactive statements and stores
2. **Type safety** - Always use TypeScript interfaces for props and function parameters
3. **Component composition** - Compose smaller components into larger ones
4. **Store management** - Use Svelte stores for shared state
5. **Progressive enhancement** - Start with static content, add interactivity where needed
