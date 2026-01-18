# Architecture Overview

This document explains the architecture and structure of the SvelteKit frontend.

## Project Structure

```
frontend/
├── src/
│   ├── lib/                 # Shared code
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # Base UI components
│   │   │   ├── layout/      # Layout components (Navbar, ThemeToggle)
│   │   │   └── features/    # Feature-specific shared components
│   │   ├── stores/          # Global state (theme, user, etc.)
│   │   ├── utils/           # Utility functions
│   │   ├── services/        # API clients & external services
│   │   ├── types/           # TypeScript type definitions
│   │   └── constants/      # Shared constants
│   ├── routes/              # File-based routing
│   │   ├── +layout.svelte   # Root layout (wraps all pages)
│   │   ├── +layout.ts       # Root layout data
│   │   ├── +page.svelte     # Home page (/)
│   │   ├── +error.svelte    # Global error page
│   │   ├── about/
│   │   │   └── +page.svelte # About page (/about)
│   │   ├── blog/            # Feature: Blog
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte
│   │   │   ├── [slug]/
│   │   │   │   ├── +page.svelte
│   │   │   │   └── +page.ts
│   │   │   └── components/
│   │   ├── api-demo/        # Feature: API Demo
│   │   │   ├── +page.svelte
│   │   │   └── components/
│   │   ├── comparison/      # Feature: Comparison
│   │   │   ├── +page.svelte
│   │   │   └── components/
│   │   └── api/             # API routes organized by feature
│   │       ├── test/        # Legacy endpoint
│   │       ├── demo/        # Demo API endpoint
│   │       └── blog/        # Blog API endpoint
│   ├── app.html             # HTML template
│   ├── app.css              # Global styles
│   └── app.d.ts             # TypeScript app types
├── static/                  # Static assets
│   └── favicon.svg
└── [config files]
```

## Routing System

SvelteKit uses **file-based routing** where the file structure determines the URL structure.

### Route Files

- `+page.svelte` - Page component (renders at the route)
- `+layout.svelte` - Layout component (wraps child routes)
- `+server.ts` - API endpoint (server-side only)
- `+error.svelte` - Error page (optional)

### Route Examples

| File Path | URL |
|-----------|-----|
| `src/routes/+page.svelte` | `/` |
| `src/routes/about/+page.svelte` | `/about` |
| `src/routes/api/test/+server.ts` | `/api/test` |

### Layout Hierarchy

```
+layout.svelte (root)
  └── +page.svelte (home)
  └── about/
      └── +page.svelte (about)
```

The root `+layout.svelte` wraps all pages, providing persistent navigation.

## Component Architecture

### Component Organization

Components are organized in a hierarchical structure:

1. **Base UI Components** (`lib/components/ui/`)
   - Reusable, generic components (Button, Card, etc.)
   - No business logic, pure presentation

2. **Layout Components** (`lib/components/layout/`)
   - Navigation, headers, footers
   - Theme toggle, site-wide UI elements
   - Examples: `Navbar.svelte`, `ThemeToggle.svelte`

3. **Feature Components** (`lib/components/features/` or `routes/[feature]/components/`)
   - Feature-specific components
   - Can be shared across features or page-specific
   - Examples: `BlogCard.svelte`, `FrameworkCard.svelte`, `ApiResult.svelte`

### Layout Component

`src/routes/+layout.svelte` provides:
- Persistent navigation bar (via `Navbar` component)
- Global styling
- Wrapper for all page content

**Key Features:**
- Sticky navigation
- Backdrop blur effect
- Responsive design
- Client-side routing links
- Theme toggle integration

### Page Components

Each route has its own `+page.svelte` component:

1. **Home Page** (`+page.svelte`)
   - Welcome message
   - Demo links
   - Framework information

2. **About Page** (`about/+page.svelte`)
   - Demonstrates SPA navigation
   - Content about the site

3. **API Demo** (`api-demo/+page.svelte`)
   - Interactive API testing
   - Uses `ApiResult` component for display
   - Error handling

4. **Comparison** (`comparison/+page.svelte`)
   - Side-by-side framework comparison
   - Uses `FrameworkCard` component
   - Code examples
   - Feature tables

5. **Blog** (`blog/+page.svelte` and `blog/[slug]/+page.svelte`)
   - Blog listing page
   - Individual blog post pages
   - Uses `BlogCard` and `PostMeta` components

## API Routes

### Server Endpoints

API routes are defined using `+server.ts` files:

```typescript
// src/routes/api/test/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({ message: 'Hello' });
};
```

### Request Handlers

- `GET` - Handle GET requests
- `POST` - Handle POST requests
- `PUT`, `PATCH`, `DELETE` - Other HTTP methods

### Type Safety

SvelteKit generates types automatically:
- `RequestHandler` type from `./$types`
- Request/Response types
- Route parameter types

## Styling Approach

### Tailwind CSS v4

Using Tailwind CSS v4 with the Vite plugin:

```css
/* app.css */
@import "tailwindcss";
```

**Benefits:**
- No separate config file needed
- CSS-first configuration
- Automatic optimization
- Utility classes

### Component Styles

Svelte components can use:
- `<style>` blocks (scoped by default)
- Tailwind utility classes
- CSS modules (if needed)

### Global Styles

`app.css` contains:
- Tailwind imports
- Base typography
- Global resets

## State Management

### Component State

Svelte's reactive state:

```svelte
<script>
  let count = 0;
  
  function increment() {
    count++;
  }
</script>
```

### Page Data

Use `+page.ts` or `+page.server.ts` for data loading:

```typescript
// +page.server.ts
export async function load() {
  return {
    data: await fetchData()
  };
}
```

### Stores

For global state, use Svelte stores in `lib/stores/`:

```typescript
// lib/stores/theme.ts
import { writable } from 'svelte/store';
export const theme = createThemeStore();
```

**Current Stores:**
- `theme` - Theme management (light/dark mode)

**Usage:**
```typescript
import { theme } from '$lib/stores';
```

### Utilities and Services

**Utilities** (`lib/utils/`):
- Pure functions with no side effects
- Date formatting, text formatting, validation
- Examples: `formatDate()`, `truncate()`, `isValidEmail()`

**Services** (`lib/services/`):
- API clients and external service integrations
- Base `ApiClient` class for HTTP requests
- Endpoint definitions

**Types** (`lib/types/`):
- Shared TypeScript type definitions
- API response types, common types

**Constants** (`lib/constants/`):
- Route paths, app configuration
- Prevents hardcoding values throughout the app

## Build Process

### Development

1. Vite dev server starts
2. SvelteKit processes routes
3. Hot module replacement enabled
4. TypeScript checking (optional)

### Production Build

1. **Type Check**: TypeScript validation
2. **Compile**: Svelte components → JavaScript
3. **Bundle**: Vite bundles assets
4. **Optimize**: Minification, tree-shaking
5. **Generate**: Static files in `build/`

### SPA Mode

With `adapter-static` and `fallback: 'index.html'`:
- All routes pre-rendered
- Single `index.html` entry point
- Client-side routing handles navigation
- No server required

## TypeScript Integration

### Type Generation

SvelteKit generates types in `.svelte-kit/types/`:
- Route types
- Page data types
- Request handler types

### Type Safety

- Component props
- API route handlers
- Page data loaders
- Store types

## Performance Optimizations

### Code Splitting

SvelteKit automatically:
- Splits routes into separate chunks
- Lazy loads components
- Prefetches linked pages

### Build Optimizations

- Tree shaking (removes unused code)
- Minification
- Asset optimization
- CSS extraction

### Runtime Performance

- Compiled Svelte (no virtual DOM)
- Fine-grained reactivity
- Small bundle sizes
- Fast initial load

## Deployment Architecture

### Static Generation

All pages are pre-rendered at build time:

```
Build Time:
  → Generate HTML for each route
  → Bundle JavaScript
  → Optimize assets

Runtime:
  → Serve static files
  → Client-side routing
  → No server needed
```

### Hosting Options

- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **Object Storage**: AWS S3, Azure Blob

## Comparison with Astro

### Key Differences

| Aspect | Astro | SvelteKit |
|--------|-------|-----------|
| **Routing** | File-based (pages/) | File-based (routes/) |
| **SPA Mode** | Opt-in (View Transitions) | Built-in (default) |
| **API Routes** | `src/pages/api/*.ts` | `src/routes/api/*/+server.ts` |
| **Layouts** | Import components | Nested `+layout.svelte` |
| **Build** | SSG/SSR | SPA/SSR/SSG |

### When to Use Each

**Astro:**
- Content-heavy sites
- Maximum performance (islands)
- Minimal JavaScript

**SvelteKit:**
- Interactive applications
- SPA experience required
- Backend integration needed

## Future Enhancements

Potential additions:
- Authentication system
- Database integration
- Form handling
- Real-time features
- Progressive Web App (PWA)

## Resources

- [SvelteKit Docs](https://kit.svelte.dev)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
