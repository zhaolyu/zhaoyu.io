# Navigation Rules

This guide helps you quickly find code in the zhaoyu.io portfolio site.

## Finding Components

### By Component Name

Components are in `src/lib/components/`:

- **Svelte components**: `src/lib/components/Welcome.svelte`
- **Shared components**: `src/lib/components/` (all reusable components)

### Search Strategy

1. Check `src/lib/components/` for reusable components
2. Use your IDE's search to find component usage
3. Check `src/routes/+layout.svelte` for layout components

## Finding Pages

### File-Based Routing

Pages are in `src/routes/` and use file-based routing:

- `src/routes/+page.svelte` → `/`
- `src/routes/about/+page.svelte` → `/about`
- `src/routes/projects/+page.svelte` → `/projects`
- `src/routes/projects/[slug]/+page.svelte` → `/projects/[slug]` (dynamic)

### Finding a Page

1. Check `src/routes/` for the page directory
2. Look for `+page.svelte` file in the directory
3. Dynamic routes use `[param]` directory syntax

## Finding Layouts

### Layout Components

Layouts are in `src/routes/`:

- `src/routes/+layout.svelte` - Root layout
- `src/routes/blog/+layout.svelte` - Blog-specific layout (if exists)

### Finding a Layout

1. Check `src/routes/` for `+layout.svelte` files
2. Layouts wrap page content with common structure
3. Root layout applies to all pages

## Finding Utilities

### Utility Functions

Utilities are in `src/lib/utils/` (if used):

- `src/lib/utils/date.ts` - Date utilities
- `src/lib/utils/format.ts` - Formatting utilities
- `src/lib/utils/validation.ts` - Validation utilities

### Finding a Utility

1. Check `src/lib/utils/` for utility files
2. Use IDE search to find function usage
3. Check imports in components that use the utility

## Finding Styles

### Global Styles

Global styles are in `src/`:

- `src/app.css` - Global styles

### Component Styles

- **Svelte components**: Styles in `<style>` tag (scoped by default)
- **Tailwind**: Utility classes in component templates

### Finding Styles

1. Check `src/app.css` for global styles
2. Check component files for scoped styles
3. Check Tailwind configuration if using custom theme

## Finding Assets

### Static Assets

Assets are in `static/`:

- `static/favicon.svg` - Favicon
- `static/images/` - Public images

### Finding Assets

1. Check `static/` for static assets
2. Assets in `static/` are served as-is
3. Reference with `/` path (e.g., `/images/logo.svg`)

## Finding Stores

### Svelte Stores

Stores are in `src/lib/stores/`:

- `src/lib/stores/theme.ts` - Theme store
- `src/lib/stores/counter.ts` - Counter store (if exists)

### Finding Stores

1. Check `src/lib/stores/` for store files
2. Search for `writable`, `readable`, or `derived` usage
3. Check components that use `$store` syntax

## Quick Reference

| What | Where |
|------|-------|
| Pages | `src/routes/*/+page.svelte` |
| Components | `src/lib/components/` |
| Layouts | `src/routes/+layout.svelte` |
| Utilities | `src/lib/utils/` |
| Styles | `src/app.css` |
| Assets | `static/` |
| Stores | `src/lib/stores/` |

## Search Tips

1. **Use IDE search** - `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows/Linux)
2. **Search by file name** - Find files by name
3. **Search by content** - Find code by content
4. **Use file explorer** - Navigate directory structure
5. **Check imports** - Find where components are used
