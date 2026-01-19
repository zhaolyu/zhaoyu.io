# Development Workflow

This guide covers the setup and development process for the zhaoyu.io portfolio site.

## Prerequisites

### Required Software

- **Node.js**: Version 24.13.0 (specified in `.nvmrc`)
- **npm**: Comes with Node.js
- **Git**: For version control

## Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd zhaoyu.io/frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file if needed (for environment variables):

```bash
# .env
PUBLIC_API_URL=https://api.example.com
```

## Development Commands

### Start Development Server

```bash
npm run dev
```

This starts the SvelteKit development server, typically at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Type Checking

```bash
# Run type check
npm run check

# Run type check in watch mode
npm run check:watch
```

### Linting

```bash
# Run lint (MANDATORY before completing code)
npm run lint

# Fix linting issues
npm run lint:fix
```

**⚠️ IMPORTANT**: Lint MUST pass with zero errors before marking any code task as complete. CI will fail if lint fails.

### Formatting

```bash
# Format code with Prettier
npm run format
```

## Development Workflow

### 1. Create a New Page

Create a new directory in `src/routes/` with a `+page.svelte` file:

```svelte
<!-- src/routes/about/+page.svelte -->
<script lang="ts">
	// Page script
</script>

<h1>About Me</h1>
<p>Welcome to my portfolio!</p>
```

The page will be available at `/about`.

### 2. Create a New Component

#### Svelte Component

```svelte
<!-- src/lib/components/Welcome.svelte -->
<script lang="ts">
	interface Props {
		name: string;
	}

	let { name }: Props = $props();
</script>

<div class="welcome">
	<h2>Welcome, {name}!</h2>
</div>

<style>
	.welcome {
		padding: 1rem;
	}
</style>
```

Use in a page:

```svelte
<script lang="ts">
	import Welcome from '$lib/components/Welcome.svelte';
</script>

<Welcome name="John" />
```

### 3. Add Styling

#### Tailwind CSS (Recommended)

```svelte
<div class="flex items-center justify-between p-4 bg-white rounded-lg">
	<h2 class="text-2xl font-bold">Title</h2>
</div>
```

#### Scoped Styles (Svelte)

```svelte
<style>
	.card {
		padding: 1rem;
		border: 1px solid #ccc;
	}
</style>
```

#### Global Styles

Add to `src/app.css`:

```css
:root {
	--color-primary: #3b82f6;
}

body {
	font-family: system-ui, sans-serif;
}
```

Import in layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
</script>
```

## File-Based Routing

SvelteKit uses file-based routing:

- `src/routes/+page.svelte` → `/`
- `src/routes/about/+page.svelte` → `/about`
- `src/routes/projects/+page.svelte` → `/projects`
- `src/routes/projects/[slug]/+page.svelte` → `/projects/[slug]` (dynamic)

### Dynamic Routes

```svelte
<!-- src/routes/projects/[slug]/+page.svelte -->
<script lang="ts">
	interface PageData {
		project: Project;
	}

	let { data }: { data: PageData } = $props();
	const { project } = data;
</script>

<article>
	<h1>{project.title}</h1>
	<p>{project.description}</p>
</article>
```

```typescript
// src/routes/projects/[slug]/+page.ts
export async function load({ params }) {
	const project = await fetchProject(params.slug);
	return {
		project
	};
}
```

## Client-Side Interactivity

### Svelte Reactivity

Use Svelte's built-in reactivity for interactivity:

```svelte
<script lang="ts">
	let count = $state(0);

	function increment() {
		count++;
	}
</script>

<button on:click={increment}>
	Clicked {count} times
</button>
```

### Using Stores

For shared state across components:

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

## Testing

### Run Tests

```bash
npm run test          # Run all tests (MANDATORY before completing code)
npm run test:watch    # Watch mode for development
npm run test:ui       # UI mode for interactive testing
```

**⚠️ IMPORTANT**: Tests MUST pass before marking any code task as complete. CI will fail if tests fail.

### Write Tests

Create test files next to your components:

```typescript
// src/lib/components/Button.test.ts
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

## Debugging

### Browser DevTools

Use browser DevTools to inspect:
- Component rendering
- Network requests
- Console errors

### SvelteKit DevTools

SvelteKit provides helpful error messages in the terminal and browser console.

## Visual Verification

**RECOMMENDED**: When working on UI components or visual changes, verify your changes in the browser.

### Start Development Server

```bash
npm run dev
```

This starts the SvelteKit development server, typically at `http://localhost:5173`. Open this URL in your browser to see your changes.

### Test Responsive Design

Use browser DevTools to test your components at different viewport sizes:

1. **Open DevTools**: Press `F12` or right-click → Inspect
2. **Enable Responsive Design Mode**: 
   - Chrome/Edge: Press `Ctrl+Shift+M` (Windows/Linux) or `Cmd+Shift+M` (Mac)
   - Firefox: Press `Ctrl+Shift+M` (Windows/Linux) or `Cmd+Shift+M` (Mac)
3. **Test Viewport Sizes**:
   - **Mobile**: 375px width (iPhone SE size)
   - **Desktop**: ≥768px width
4. **Check for Issues**:
   - No horizontal scrolling
   - Touch targets are easily tappable (at least 44x44px)
   - Text is readable at all sizes
   - Layout adapts correctly

### Test Both Themes

Verify your components work in both light and dark modes:

1. Use the theme toggle button in the navigation
2. Check that all colors, borders, and backgrounds adapt correctly
3. Ensure text remains readable in both themes
4. Verify interactive elements (buttons, links) are clearly visible

### Visual Checklist

When verifying UI components:

- ✅ Component displays correctly on mobile (375px)
- ✅ Component displays correctly on desktop (≥768px)
- ✅ No horizontal scrolling at any viewport size
- ✅ Touch targets are appropriately sized (mobile)
- ✅ Light theme works correctly
- ✅ Dark theme works correctly

## Agent Browser Testing

**For AI Agents**: When implementing or modifying UI components, agents should verify the implementation.

### MCP Browser Tools (Preferred)

If MCP browser extension tools are available:

1. **Verify Dev Server**: Check if server is running on port 5173
2. **Navigate**: Use browser tools to navigate to `http://localhost:5173`
3. **Screenshot**: Take screenshots to verify visual appearance
4. **Test Interactions**: Verify clicks, hovers, and form submissions work
5. **Responsive Testing**: Check different viewport sizes programmatically

### Terminal-Based Verification (Fallback)

If browser tools are not available:

1. **Check Server Status**:
   ```bash
   lsof -ti:5173  # Verify dev server is running
   ```

2. **Fetch HTML**:
   ```bash
   curl -s http://localhost:5173 | grep -i "component-class"
   ```

3. **Verify Structure**: Check HTML output for component classes and content
4. **Run Checks**: Execute `npm run check` and `npm run lint`

### Verification Checklist for Agents

Before marking UI work complete:

- [ ] Dev server is running (`lsof -ti:5173`)
- [ ] Components render in HTML output (or visible via browser tools)
- [ ] TypeScript compilation passes (`npm run check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Component structure matches implementation
- [ ] Content/data is present in rendered HTML

**Note**: See [Browser Testing Rule](../rules/browser-testing.mdc) for detailed guidelines.
- ✅ Interactive elements (buttons, links) are functional
- ✅ Typography scales appropriately (using `clamp()` where applicable)

**Note**: Visual verification is recommended but not mandatory for all changes. Non-visual changes (e.g., API routes, utilities, tests) may not require visual verification.

## Deployment

### Build and Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build/` directory to your hosting provider:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

### Environment Variables

For production, set environment variables in your hosting provider's dashboard.

## Common Issues

### Port Already in Use

If port 5173 is in use:
```bash
npm run dev -- --port 3000
```

### Build Errors

1. Check for TypeScript errors: `npm run check`
2. Check for linting errors: `npm run lint`
3. Review error messages in terminal

### Hot Module Replacement Not Working

1. Restart the dev server
2. Clear browser cache
3. Check for syntax errors

## Best Practices

1. **Use Svelte reactivity** - Leverage Svelte's reactive statements and stores
2. **Use TypeScript** - Enable type safety
3. **Follow file structure** - Keep components, pages, and layouts organized
4. **Test your code** - Write tests for components and utilities
5. **Lint and format** - Run lint and format before committing

## Mandatory Final Steps

**Before completing any code task, you MUST:**

1. ✅ **Run tests**: `npm run test` - Must pass (CI will fail otherwise)
2. ✅ **Run lint**: `npm run lint` - Must pass with zero errors (CI will fail otherwise)
3. ✅ Fix any failing tests or lint errors before marking as complete

**DO NOT mark code as complete until both commands pass successfully.**
