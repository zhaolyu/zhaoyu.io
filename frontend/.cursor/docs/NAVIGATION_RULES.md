# Navigation Rules

This guide helps you quickly find code in the zhaoyu.io portfolio site.

## Finding Components

### By Component Name

Components are in `src/components/`:

- **Astro components**: `src/components/Welcome.astro`
- **React components**: `src/components/Button.tsx`
- **Shared components**: `src/components/` (all reusable components)

### Search Strategy

1. Check `src/components/` for reusable components
2. Use your IDE's search to find component usage
3. Check `src/layouts/` for layout components

## Finding Pages

### File-Based Routing

Pages are in `src/pages/` and use file-based routing:

- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/projects/index.astro` → `/projects`
- `src/pages/projects/[slug].astro` → `/projects/[slug]` (dynamic)

### Finding a Page

1. Check `src/pages/` for the page file
2. File name matches the route (e.g., `about.astro` → `/about`)
3. Dynamic routes use `[param].astro` syntax

## Finding Layouts

### Layout Components

Layouts are in `src/layouts/`:

- `src/layouts/Layout.astro` - Base layout
- `src/layouts/BlogLayout.astro` - Blog-specific layout

### Finding a Layout

1. Check `src/layouts/` for layout files
2. Check page files to see which layout they use
3. Layouts wrap page content with common structure

## Finding Utilities

### Utility Functions

Utilities are in `src/utils/` (if used):

- `src/utils/date.ts` - Date utilities
- `src/utils/format.ts` - Formatting utilities
- `src/utils/validation.ts` - Validation utilities

### Finding a Utility

1. Check `src/utils/` for utility files
2. Use IDE search to find function usage
3. Check imports in components that use the utility

## Finding Styles

### Global Styles

Global styles are in `src/styles/`:

- `src/styles/global.css` - Global styles
- `src/styles/variables.css` - CSS variables (if used)

### Component Styles

- **Astro components**: Styles in `<style>` tag (scoped by default)
- **React components**: CSS modules or Tailwind classes
- **Tailwind**: Utility classes in component templates

### Finding Styles

1. Check `src/styles/` for global styles
2. Check component files for scoped styles
3. Check `tailwind.config.js` for Tailwind configuration

## Finding Assets

### Static Assets

Assets are in `src/assets/`:

- `src/assets/images/` - Images
- `src/assets/fonts/` - Fonts

### Public Assets

Public assets are in `public/`:

- `public/favicon.svg` - Favicon
- `public/images/` - Public images

### Finding Assets

1. Check `src/assets/` for processed assets
2. Check `public/` for static assets
3. Assets in `src/assets/` are processed by Astro
4. Assets in `public/` are served as-is

## Finding Context Providers

### React Context

Context providers are in `src/contexts/` (if used):

- `src/contexts/ThemeContext.tsx` - Theme context
- `src/contexts/DataContext.tsx` - Data context

### Finding Context

1. Check `src/contexts/` for context files
2. Search for `createContext` usage
3. Check components that use `useContext`

## Finding Hooks

### Custom Hooks

Custom hooks are in `src/hooks/` (if used):

- `src/hooks/useLocalStorage.ts` - LocalStorage hook
- `src/hooks/useCounter.ts` - Counter hook

### Finding Hooks

1. Check `src/hooks/` for hook files
2. Hooks typically start with `use` prefix
3. Search for hook usage in components

## Quick Reference

| What | Where |
|------|-------|
| Pages | `src/pages/` |
| Components | `src/components/` |
| Layouts | `src/layouts/` |
| Utilities | `src/utils/` |
| Styles | `src/styles/` |
| Assets | `src/assets/` |
| Public | `public/` |
| Contexts | `src/contexts/` |
| Hooks | `src/hooks/` |

## Search Tips

1. **Use IDE search** - `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows/Linux)
2. **Search by file name** - Find files by name
3. **Search by content** - Find code by content
4. **Use file explorer** - Navigate directory structure
5. **Check imports** - Find where components are used
