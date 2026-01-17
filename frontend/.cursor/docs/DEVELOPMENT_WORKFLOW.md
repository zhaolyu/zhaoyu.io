# Development Workflow

This guide covers the setup and development process for the zhaoyu.io portfolio site.

## Prerequisites

### Required Software

- **Node.js**: Version 18+ (LTS recommended)
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

This starts the Astro development server, typically at `http://localhost:4321`.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Linting

```bash
# Run lint
npm run lint

# Fix linting issues
npm run lint:fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

## Development Workflow

### 1. Create a New Page

Create a new file in `src/pages/`:

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="About">
  <h1>About Me</h1>
  <p>Welcome to my portfolio!</p>
</Layout>
```

The page will be available at `/about`.

### 2. Create a New Component

#### Astro Component

```astro
---
// src/components/Welcome.astro
interface Props {
  name: string;
}

const { name } = Astro.props;
---

<div class="welcome">
  <h2>Welcome, {name}!</h2>
</div>

<style>
  .welcome {
    padding: 1rem;
  }
</style>
```

#### React Component

```typescript
// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export default Button;
```

Use in Astro:

```astro
---
import Button from '../components/Button';
---

<Button client:load label="Click me" />
```

### 3. Add Styling

#### Tailwind CSS (Recommended)

```astro
<div class="flex items-center justify-between p-4 bg-white rounded-lg">
  <h2 class="text-2xl font-bold">Title</h2>
</div>
```

#### Scoped Styles (Astro)

```astro
<style>
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
  }
</style>
```

#### Global Styles

Add to `src/styles/global.css`:

```css
:root {
  --color-primary: #3b82f6;
}

body {
  font-family: system-ui, sans-serif;
}
```

Import in layout:

```astro
---
import '../styles/global.css';
---
```

## File-Based Routing

Astro uses file-based routing:

- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/projects/index.astro` → `/projects`
- `src/pages/projects/[slug].astro` → `/projects/[slug]` (dynamic)

### Dynamic Routes

```astro
---
// src/pages/projects/[slug].astro
export async function getStaticPaths() {
  const projects = await fetchProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

interface Props {
  project: Project;
}

const { project } = Astro.props;
---

<Layout title={project.title}>
  <article>
    <h1>{project.title}</h1>
    <p>{project.description}</p>
  </article>
</Layout>
```

## Client-Side Interactivity

### When to Use React

Use React components when you need:
- Client-side interactivity (clicks, form inputs)
- State management
- Browser APIs (localStorage, etc.)

### Client Directives

```astro
---
import InteractiveButton from '../components/InteractiveButton';
---

<!-- Load immediately -->
<InteractiveButton client:load />

<!-- Load when visible -->
<InteractiveButton client:visible />

<!-- Load on idle -->
<InteractiveButton client:idle />

<!-- Load on media query -->
<InteractiveButton client:media="(max-width: 768px)" />
```

## Testing

### Run Tests

```bash
npm test
```

### Write Tests

Create test files next to your components:

```typescript
// src/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button label="Click me" />);
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

### Astro DevTools

Astro provides helpful error messages in the terminal and browser console.

## Deployment

### Build and Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` directory to your hosting provider:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

### Environment Variables

For production, set environment variables in your hosting provider's dashboard.

## Common Issues

### Port Already in Use

If port 4321 is in use:
```bash
npm run dev -- --port 3000
```

### Build Errors

1. Check for TypeScript errors: `npm run build`
2. Check for linting errors: `npm run lint`
3. Review error messages in terminal

### Hot Module Replacement Not Working

1. Restart the dev server
2. Clear browser cache
3. Check for syntax errors

## Best Practices

1. **Start with Astro** - Use Astro components for static content
2. **Add React only when needed** - Use React for interactivity
3. **Use TypeScript** - Enable type safety
4. **Follow file structure** - Keep components, pages, and layouts organized
5. **Test your code** - Write tests for components and utilities
6. **Lint and format** - Run lint and format before committing
