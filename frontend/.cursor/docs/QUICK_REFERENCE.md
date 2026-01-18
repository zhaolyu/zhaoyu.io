# Quick Reference

Quick lookup guide for common paths, commands, and patterns in the zhaoyu.io portfolio site.

## Common File Paths

### Core Application

| Path | Purpose |
|------|---------|
| `src/routes/` | File-based routing (pages) |
| `src/lib/components/` | Reusable components |
| `src/routes/+layout.svelte` | Root layout component |
| `src/app.css` | Global styles |
| `static/` | Static public assets |
| `svelte.config.js` | SvelteKit configuration |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |

### Optional Directories

| Path | Purpose |
|------|---------|
| `src/lib/utils/` | Utility functions |
| `src/lib/stores/` | Svelte stores |

## Development Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run type check
npm run check

# Run lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Common Patterns

### Svelte Component

```svelte
<script lang="ts">
	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<div class="card">
	<h2>{title}</h2>
</div>

<style>
	.card {
		padding: 1rem;
	}
</style>
```

### Using a Component

```svelte
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<Button label="Click me" />
```

### Data Fetching (Load Function)

```typescript
// src/routes/projects/+page.ts
export async function load() {
	const data = await fetch('https://api.example.com/data')
		.then((res) => res.json());
	return { data };
}
```

### Data Fetching (Client Side)

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	let data: any = null;

	onMount(async () => {
		const res = await fetch('/api/data');
		data = await res.json();
	});
</script>

{#if data}
	<div>{data.title}</div>
{/if}
```

## File-Based Routing

| File | Route |
|------|-------|
| `src/routes/+page.svelte` | `/` |
| `src/routes/about/+page.svelte` | `/about` |
| `src/routes/projects/+page.svelte` | `/projects` |
| `src/routes/projects/[slug]/+page.svelte` | `/projects/[slug]` |

## Styling

### Tailwind CSS

```svelte
<div class="flex items-center justify-between p-4 bg-white rounded-lg">
	<h2 class="text-2xl font-bold">Title</h2>
</div>
```

### Scoped Styles (Svelte)

```svelte
<style>
	.card {
		padding: 1rem;
	}
</style>
```

## TypeScript

### Component Props

```typescript
interface Props {
	title: string;
	description?: string;
	count: number;
}
```

### Function Types

```typescript
const formatDate = (date: Date, format: string): string => {
	// Implementation
};
```

## Environment Variables

```bash
# .env
PUBLIC_API_URL=https://api.example.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.PUBLIC_API_URL;
```

## Common Imports

### Svelte Components

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import Button from '$lib/components/Button.svelte';
	import '../app.css';
</script>
```

## Testing

### Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
	it('should render correctly', () => {
		render(Button, { props: { label: 'Click me' } });
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});
});
```

## Deployment

1. Build: `npm run build`
2. Deploy `build/` directory to hosting provider
3. Set environment variables in hosting dashboard

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- --port 3000
```

### Build Errors

1. Check TypeScript: `npm run check`
2. Check lint: `npm run lint`
3. Review error messages
