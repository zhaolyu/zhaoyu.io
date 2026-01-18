# File Organization

## Directory Structure

```
zhaoyu.io/
├── frontend-svelte/
│   ├── .cursor/              # Cursor AI documentation and rules
│   ├── static/               # Static assets (images, fonts, etc.)
│   ├── src/
│   │   ├── lib/              # Shared code
│   │   │   ├── components/   # Reusable components
│   │   │   │   ├── ui/       # Base UI components (Button, Card, etc.)
│   │   │   │   ├── layout/   # Layout components (Navbar, Footer, ThemeToggle)
│   │   │   │   └── features/ # Feature-specific shared components
│   │   │   ├── stores/        # Svelte stores (theme, user, etc.)
│   │   │   ├── utils/        # Utility functions (date, format, validation)
│   │   │   ├── services/     # API clients & external services
│   │   │   │   └── api/      # API client and endpoints
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   └── constants/    # Shared constants (routes, config)
│   │   ├── routes/           # File-based routing
│   │   │   ├── +layout.svelte # Root layout
│   │   │   ├── +layout.ts     # Root layout data
│   │   │   ├── +page.svelte   # Home page (/)
│   │   │   ├── +error.svelte  # Global error page
│   │   │   ├── about/
│   │   │   │   └── +page.svelte # About page (/about)
│   │   │   ├── blog/          # Feature: Blog
│   │   │   │   ├── +layout.svelte # Blog-specific layout
│   │   │   │   ├── +page.svelte   # Blog listing
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── +page.svelte # Blog post detail
│   │   │   │   │   └── +page.ts     # Data loading
│   │   │   │   └── components/      # Blog-specific components
│   │   │   ├── api-demo/      # Feature: API Demo
│   │   │   │   ├── +page.svelte
│   │   │   │   └── components/
│   │   │   ├── comparison/    # Feature: Comparison
│   │   │   │   ├── +page.svelte
│   │   │   │   └── components/
│   │   │   └── api/           # API routes organized by feature
│   │   │       ├── test/      # Legacy endpoint
│   │   │       ├── demo/      # Demo API endpoint
│   │   │       └── blog/      # Blog API endpoint
│   │   ├── app.html          # HTML template
│   │   ├── app.css           # Global styles
│   │   └── app.d.ts          # TypeScript app types
│   ├── svelte.config.js      # SvelteKit configuration
│   ├── vite.config.js        # Vite configuration
│   ├── package.json          # Dependencies and scripts
│   └── tsconfig.json         # TypeScript configuration
```

## Source Directory (`src/`)

### `src/routes/`

File-based routing in SvelteKit. Each directory with a `+page.svelte` file becomes a route.

**Structure**:
- `+page.svelte` → `/` (home)
- `about/+page.svelte` → `/about`
- `blog/+page.svelte` → `/blog`
- `blog/[slug]/+page.svelte` → `/blog/[slug]` (dynamic route)

**Feature-based Organization**:
Routes are organized by feature, with feature-specific components co-located:
- `blog/` - Blog feature with listing, detail pages, and components
- `api-demo/` - API demo feature with its own components
- `comparison/` - Comparison feature with its own components

**Example**:
```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import '../app.css';
</script>

<h1>Welcome</h1>
```

### `src/lib/components/`

Reusable Svelte components organized by purpose.

**Structure**:
```
lib/
├── components/
│   ├── ui/                   # Base UI components (Button, Card, etc.)
│   │   ├── Button.svelte
│   │   ├── Card.svelte
│   │   └── index.ts          # Barrel exports
│   ├── layout/               # Layout components
│   │   ├── Navbar.svelte
│   │   ├── ThemeToggle.svelte
│   │   └── index.ts          # Barrel exports
│   └── features/             # Feature-specific shared components
│       └── api-demo/
│           └── index.ts
```

**Component Hierarchy**:
1. **UI Components** (`lib/components/ui/`) - Generic, reusable components with no business logic
2. **Layout Components** (`lib/components/layout/`) - Site-wide layout elements (Navbar, Footer, ThemeToggle)
3. **Feature Components** (`lib/components/features/` or `routes/[feature]/components/`) - Feature-specific components

**Naming**:
- Svelte components: PascalCase (e.g., `Welcome.svelte`, `BlogCard.svelte`)
- Use barrel exports (`index.ts`) for clean imports

**Example**:
```svelte
<!-- Using layout components -->
<script lang="ts">
	import { Navbar, ThemeToggle } from '$lib/components/layout';
</script>

<Navbar />
<ThemeToggle />
```

### `src/routes/+layout.svelte`

Root layout component that wraps all pages.

**Structure**:
```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { Navbar } from '$lib/components/layout';
</script>

<Navbar />

<slot />
```

### `src/lib/stores/`

Svelte stores for shared global state.

**Structure**:
```
lib/
└── stores/
    ├── theme.ts              # Theme store
    └── index.ts              # Barrel exports
```

**Example**:
```typescript
// src/lib/stores/theme.ts
import { writable } from 'svelte/store';

export const theme = createThemeStore();
```

**Usage**:
```typescript
import { theme } from '$lib/stores';
```

### `src/lib/utils/`

Utility functions and helpers (pure functions, no side effects).

**Structure**:
```
lib/
└── utils/
    ├── date.ts               # Date formatting utilities
    ├── format.ts             # General formatting utilities
    ├── validation.ts         # Validation helpers
    └── index.ts             # Barrel exports
```

**Example**:
```typescript
// src/lib/utils/date.ts
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
	// Implementation
}
```

**Usage**:
```typescript
import { formatDate, getRelativeTime } from '$lib/utils';
```

### `src/lib/services/`

API clients and external service integrations.

**Structure**:
```
lib/
└── services/
    ├── api/
    │   ├── client.ts         # Base API client
    │   └── endpoints.ts      # API endpoint definitions
    └── index.ts             # Barrel exports
```

**Example**:
```typescript
// src/lib/services/api/client.ts
export class ApiClient {
	async get<T>(endpoint: string): Promise<T> {
		// Implementation
	}
}
```

**Usage**:
```typescript
import { apiClient } from '$lib/services';
import { API_ENDPOINTS } from '$lib/services/api/endpoints';
```

### `src/lib/types/`

TypeScript type definitions.

**Structure**:
```
lib/
└── types/
    ├── api.ts               # API response types
    ├── common.ts            # Common types (Theme, Route, etc.)
    └── index.ts             # Barrel exports
```

**Example**:
```typescript
// src/lib/types/api.ts
export interface ApiResponse<T = unknown> {
	data?: T;
	error?: string;
}
```

**Usage**:
```typescript
import type { ApiResponse, Theme } from '$lib/types';
```

### `src/lib/constants/`

Shared constants and configuration.

**Structure**:
```
lib/
└── constants/
    ├── routes.ts            # Route path constants
    ├── config.ts            # App configuration
    └── index.ts             # Barrel exports
```

**Example**:
```typescript
// src/lib/constants/routes.ts
export const ROUTES = {
	HOME: '/',
	ABOUT: '/about',
	BLOG: '/blog',
	API_DEMO: '/api-demo',
	COMPARISON: '/comparison'
} as const;
```

**Usage**:
```typescript
import { ROUTES } from '$lib/constants';
import { APP_CONFIG } from '$lib/constants/config';
```

## Static Directory (`static/`)

Static assets served as-is (not processed by SvelteKit).

**Structure**:
```
static/
├── favicon.svg
├── robots.txt
└── images/
    └── og-image.jpg
```

**Usage**:
```svelte
<img src="/images/og-image.jpg" alt="OG Image" />
```

## File Naming Conventions

### Components
- **Svelte**: PascalCase (e.g., `Welcome.svelte`, `ProjectCard.svelte`)

### Utilities
- **camelCase** (e.g., `formatDate.ts`, `apiClient.ts`)

### Routes
- **kebab-case** directories (e.g., `about/`, `project-detail/`)
- **+page.svelte** for pages
- **+layout.svelte** for layouts
- **+server.ts** for API endpoints
- **+error.svelte** for error pages

### Config Files
- **kebab-case** (e.g., `svelte.config.js`, `vite.config.js`)

## Import Paths

### SvelteKit $lib Alias (Recommended)

SvelteKit provides a `$lib` alias that maps to `src/lib/`:

```typescript
// Using barrel exports for clean imports
import { formatDate } from '$lib/utils';
import { theme } from '$lib/stores';
import { Navbar, ThemeToggle } from '$lib/components/layout';
import { ROUTES } from '$lib/constants';
import { apiClient } from '$lib/services';
import type { ApiResponse } from '$lib/types';
```

### Relative Imports

```typescript
// From a component within routes
import Button from '../lib/components/ui/Button.svelte';
import { formatDate } from '../../lib/utils/date';
```

## Best Practices

1. **Feature-based organization** - Group routes, components, and API routes by feature
2. **Co-locate related files** - Keep feature-specific components in feature directories
3. **Use barrel exports** - Create `index.ts` files for clean imports
4. **Separate concerns** - Keep UI components, layout components, and feature components separate
5. **Centralize shared code** - Put reusable utilities, types, and constants in `lib/`
6. **Use route constants** - Import route paths from `$lib/constants/routes` instead of hardcoding
7. **Component hierarchy**:
   - `lib/components/ui/` - Base UI components (Button, Card, etc.)
   - `lib/components/layout/` - Layout components (Navbar, Footer, etc.)
   - `lib/components/features/` - Feature-specific shared components
   - `routes/[feature]/components/` - Page-specific components
8. **Error handling** - Use `+error.svelte` for error boundaries at route level
9. **Type safety** - Define types in `lib/types/` and use them throughout the app
10. **API organization** - Group API routes by feature in `routes/api/[feature]/`
