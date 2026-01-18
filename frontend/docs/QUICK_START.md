# Quick Start Guide

Get up and running with the SvelteKit frontend in minutes.

## Prerequisites

- Node.js 24.13.0
- npm (or yarn/pnpm)

## Installation

```bash
# Navigate to the project directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## First Steps

### 1. Explore the Routes

- `/` - Home page
- `/about` - About page (notice smooth SPA navigation)
- `/api-demo` - Test the API route
- `/comparison` - Framework comparison

### 2. Test the API

1. Go to `/api-demo`
2. Click "Fetch Data"
3. See the JSON response from `/api/test`

### 3. Make Your First Change

Edit `src/routes/+page.svelte`:

```svelte
<h1>Welcome to My Site</h1>
```

Save and see the change instantly (HMR).

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

## Project Structure Overview

```
src/routes/
  ├── +layout.svelte    # Navigation wrapper
  ├── +page.svelte      # Home (/)
  ├── about/            # About page
  ├── api-demo/         # API demo
  ├── comparison/       # Comparison page
  └── api/              # API routes
      └── test/         # /api/test endpoint
```

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for project structure
- See [COMPARISON.md](COMPARISON.md) for Astro vs SvelteKit

## Troubleshooting

### Port Already in Use

Change the port in `vite.config.js`:

```javascript
server: {
  port: 3000  // Change to available port
}
```

### Type Errors

Run type checking:

```bash
npm run check
```

### Styles Not Working

Ensure `app.css` is imported in `+layout.svelte`:

```svelte
<script>
  import '../app.css';
</script>
```

## Need Help?

- [SvelteKit Docs](https://kit.svelte.dev)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- Check the other docs in this directory
