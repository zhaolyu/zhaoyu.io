# Setup Guide

This guide covers the complete setup process for the SvelteKit frontend.

## Prerequisites

- **Node.js**: Version 24.13.0 (specified in `.nvmrc`)
- **Package Manager**: npm, yarn, or pnpm

### Using nvm (Recommended)

```bash
# Install and use the correct Node version
nvm install 24.13.0
nvm use 24.13.0

# Or if .nvmrc is present
nvm use
```

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@sveltejs/kit` - SvelteKit framework
- `@sveltejs/adapter-static` - Static adapter for SPA mode
- `svelte` - Svelte compiler
- `typescript` - TypeScript support
- `@tailwindcss/vite` - Tailwind CSS v4 via Vite
- `tailwindcss` - Tailwind CSS framework
- `vite` - Build tool

### 2. Verify Installation

```bash
npm run check
```

This runs TypeScript and Svelte type checking to ensure everything is set up correctly.

## Development

### Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5173` with hot module replacement (HMR).

### Development Features

- **Hot Module Replacement**: Changes reflect immediately
- **TypeScript**: Full type checking
- **Source Maps**: Easy debugging
- **Fast Refresh**: Component state preserved during updates

## Configuration Files

### svelte.config.js

Main SvelteKit configuration:

```javascript
{
  adapter: adapter-static({
    pages: 'build',
    assets: 'build',
    fallback: 'index.html',  // Required for SPA mode
    strict: true
  })
}
```

**Key Settings:**
- `adapter-static`: Enables SPA mode
- `fallback: 'index.html'`: Allows client-side routing
- `prerender`: All routes are pre-rendered at build time

### vite.config.js

Vite configuration with Tailwind CSS:

```javascript
{
  plugins: [
    sveltekit(),
    tailwindcss()  // Tailwind CSS v4 plugin
  ]
}
```

### tsconfig.json

TypeScript configuration extends SvelteKit's base config with strict type checking enabled.

## Building for Production

### Build Command

```bash
npm run build
```

This will:
1. Type-check the code
2. Compile Svelte components
3. Bundle JavaScript
4. Process CSS with Tailwind
5. Generate static files in `build/` directory

### Build Output

```
build/
├── index.html
├── _app/
│   ├── chunks/
│   └── ...
└── [route files]
```

### Preview Production Build

```bash
npm run preview
```

Starts a local server to preview the production build.

## Deployment

### Cloudflare Pages (Recommended)

This project is configured for automated deployment to Cloudflare Pages via GitHub Actions CI/CD.

**Quick Start:**
1. See the comprehensive [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions
2. Configure GitHub secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
3. Push to `main` branch to trigger automatic deployment

**Features:**
- ✅ Automated CI/CD via GitHub Actions
- ✅ Custom domain support (`zhaoyu.io`)
- ✅ SPA routing configured
- ✅ Preview deployments for pull requests
- ✅ Free tier with excellent performance

For detailed setup instructions, see: [Deployment Guide](DEPLOYMENT.md)

### Other Static Hosting Options

Since this is configured as an SPA, you can deploy the `build/` directory to any static hosting service.

#### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

Or connect your Git repository to Vercel for automatic deployments.

#### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Point to the `build/` directory

Or drag and drop the `build/` folder to Netlify's dashboard.

#### GitHub Pages

1. Build the project: `npm run build`
2. Push the `build/` directory to a `gh-pages` branch
3. Configure GitHub Pages to serve from that branch

#### Other Platforms

Any static file server can host the `build/` directory:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Firebase Hosting

## Environment Variables

### Development

Create a `.env` file in the project root:

```env
PUBLIC_API_URL=http://localhost:3000/api
```

### Production

Set environment variables in your hosting platform's dashboard.

**Important**: Only variables prefixed with `PUBLIC_` are exposed to the client. Use regular variables for server-side secrets.

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, modify `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000  // Change to available port
  }
});
```

### Type Errors

Run type checking:

```bash
npm run check
```

Fix any TypeScript errors before building.

### Build Failures

1. Clear cache: `rm -rf .svelte-kit node_modules`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Tailwind Styles Not Working

Ensure `app.css` imports Tailwind:

```css
@import "tailwindcss";
```

And that it's imported in `+layout.svelte`:

```svelte
<script>
  import '../app.css';
</script>
```

## Next Steps

- **Deploy to Cloudflare Pages**: See the [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions
- Read the [Architecture Guide](ARCHITECTURE.md) to understand the project structure
- Check the [Comparison Guide](COMPARISON.md) to see differences with Astro
- Explore SvelteKit [documentation](https://kit.svelte.dev)
