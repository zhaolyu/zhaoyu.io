# zhaoyu.io - SvelteKit Frontend

Personal website built with SvelteKit, configured in SPA mode for optimal client-side routing experience.

## Features

- ✅ **SPA Mode**: True client-side routing with no page reloads
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Tailwind CSS v4**: Modern styling with utility-first approach
- ✅ **API Routes**: Server endpoints for backend integration
- ✅ **Responsive Design**: Mobile-friendly navigation and layouts
- ✅ **Performance**: Compiled Svelte code with minimal bundle sizes

## Quick Start

### Prerequisites

- Node.js 24.13.0 (use `.nvmrc` or install manually)
- npm or your preferred package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── routes/          # File-based routing
│   │   ├── +layout.svelte    # Root layout with navigation
│   │   ├── +page.svelte      # Home page
│   │   ├── about/            # About page
│   │   ├── api-demo/         # API demo page
│   │   ├── comparison/       # Framework comparison
│   │   └── api/              # API routes
│   ├── app.html         # HTML template
│   ├── app.css          # Global styles
│   └── app.d.ts         # TypeScript types
├── static/              # Static assets
├── docs/                # Documentation
└── [config files]       # Configuration files
```

## Available Routes

- `/` - Home page with demo links
- `/about` - About page demonstrating SPA navigation
- `/api-demo` - Interactive API route demonstration
- `/comparison` - Astro vs SvelteKit comparison
- `/api/test` - Example API endpoint (returns JSON)

## Documentation

- [Quick Start](docs/QUICK_START.md) - Get started in minutes
- [Setup Guide](docs/SETUP.md) - Detailed setup and configuration
- [Architecture](docs/ARCHITECTURE.md) - Project structure and patterns
- [Comparison](docs/COMPARISON.md) - Astro vs SvelteKit detailed comparison

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript and Svelte checks
- `npm run check:watch` - Run checks in watch mode

## Configuration

### SPA Mode

This project is configured in SPA mode using `@sveltejs/adapter-static`. This means:

- All routes are pre-rendered at build time
- Client-side routing handles navigation
- No server required for deployment
- Perfect for static hosting (Vercel, Netlify, GitHub Pages, etc.)

### Tailwind CSS

Tailwind CSS v4 is configured via the Vite plugin. No separate config file needed - it uses the new CSS-first configuration.

## Deployment

### Static Hosting

Since this is configured as an SPA, you can deploy to any static hosting service:

```bash
npm run build
# Output will be in the 'build' directory
```

**Recommended Platforms:**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static file server

### Environment Variables

Create a `.env` file for environment-specific variables:

```env
PUBLIC_API_URL=https://api.example.com
```

Variables prefixed with `PUBLIC_` are exposed to the client.

## Learning Resources

- [SvelteKit Documentation](https://kit.svelte.dev)
- [Svelte Documentation](https://svelte.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## Comparison with Astro

This SvelteKit implementation was originally compared with an Astro implementation. See the [comparison documentation](docs/COMPARISON.md) for detailed differences.

## License

See the main project LICENSE file.
