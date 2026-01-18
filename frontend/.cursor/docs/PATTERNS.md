# Common Patterns

This document outlines common code patterns and practices used throughout the zhaoyu.io portfolio site.

## Svelte Component Pattern

### Basic Svelte Component

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
		border: 1px solid #ccc;
	}
</style>
```

### Svelte Component with Data Fetching

```svelte
<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
	interface PageData {
		projects: Project[];
	}

	let { data }: { data: PageData } = $props();
	const { projects } = data;
</script>

<section>
	{#each projects as project}
		<article>
			<h3>{project.title}</h3>
			<p>{project.description}</p>
		</article>
	{/each}
</section>
```

```typescript
// src/routes/projects/+page.ts
export async function load() {
	const projects = await fetchProjects();
	return {
		projects
	};
}
```

## Store Pattern

### Creating a Store

```typescript
// src/lib/stores/theme.ts
import { writable } from 'svelte/store';

function createTheme() {
	const { subscribe, set, update } = writable<'light' | 'dark'>('light');

	return {
		subscribe,
		init: () => {
			if (typeof window !== 'undefined') {
				const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
				if (stored) {
					set(stored);
					document.documentElement.classList.toggle('dark', stored === 'dark');
				}
			}
		},
		toggle: () => {
			update((current) => {
				const next = current === 'light' ? 'dark' : 'light';
				if (typeof window !== 'undefined') {
					localStorage.setItem('theme', next);
					document.documentElement.classList.toggle('dark', next === 'dark');
				}
				return next;
			});
		}
	};
}

export const theme = createTheme();
```

### Using a Store

```svelte
<script lang="ts">
	import { theme } from '$lib/stores/theme';

	// Auto-subscribe with $ prefix
	$: isDark = $theme === 'dark';
</script>

<div class:dark={isDark}>
	Content
</div>
```

## Data Fetching Pattern

### Fetching Data in Load Function (Server-Side)

```typescript
// src/routes/projects/+page.ts
export async function load() {
	const data = await fetch('https://api.example.com/projects')
		.then((res) => res.json())
		.catch(() => ({}));

	return {
		projects: data.projects || []
	};
}
```

### Fetching Data in Component (Client-Side)

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	let data: any = null;
	let loading = true;

	onMount(async () => {
		try {
			const response = await fetch('/api/data');
			data = await response.json();
		} catch (error) {
			console.error('Failed to fetch data', error);
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div>Loading...</div>
{:else if data}
	<div>{data.title}</div>
{:else}
	<div>No data</div>
{/if}
```

## Layout Pattern

### Root Layout

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let isDark = false;

	onMount(() => {
		theme.init();
		const unsubscribe = theme.subscribe((value) => {
			isDark = value === 'dark';
		});
		return unsubscribe;
	});

	function toggleTheme() {
		theme.toggle();
	}
</script>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/projects">Projects</a>
</nav>

<main>
	<slot />
</main>

<footer>
	<p>&copy; 2024 zhaoyu.io</p>
</footer>
```

### Using a Layout

Layouts are automatically applied to all child routes. The root `+layout.svelte` wraps all pages.

## Styling Patterns

### Tailwind CSS

```svelte
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
	<h2 class="text-2xl font-bold text-gray-900">Title</h2>
	<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
		Click me
	</button>
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

## API Route Pattern

### Creating an API Route

```typescript
// src/routes/api/test/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({ message: 'Hello' });
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	return json({ received: data });
};
```

### Using an API Route

```svelte
<script lang="ts">
	let data: any = null;

	async function fetchData() {
		const response = await fetch('/api/test');
		data = await response.json();
	}
</script>

<button on:click={fetchData}>Fetch Data</button>
{#if data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
```

## Error Handling Pattern

### Error Page

```svelte
<!-- src/routes/+error.svelte -->
<script lang="ts">
	interface ErrorProps {
		error: Error;
		status: number;
	}

	let { error, status }: ErrorProps = $props();
</script>

<div class="error">
	<h1>{status}</h1>
	<p>{error.message}</p>
	<a href="/">Go home</a>
</div>
```

## Best Practices

1. **Use Svelte reactivity** - Leverage reactive statements and stores
2. **Type safety** - Always use TypeScript interfaces
3. **Component composition** - Compose smaller components into larger ones
4. **Store management** - Use stores for shared state
5. **Error handling** - Always handle errors gracefully
6. **Accessibility** - Use semantic HTML and ARIA attributes
