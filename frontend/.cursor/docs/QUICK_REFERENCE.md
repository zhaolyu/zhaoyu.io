# Quick Reference

Quick lookup guide for common paths, commands, and patterns in the zhaoyu.io portfolio site.

## Common File Paths

### Core Application

| Path | Purpose |
|------|---------|
| `src/pages/` | File-based routing (pages) |
| `src/components/` | Reusable components |
| `src/layouts/` | Layout components |
| `src/styles/` | Global styles |
| `src/assets/` | Processed assets |
| `public/` | Static public assets |
| `astro.config.mjs` | Astro configuration |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |

### Optional Directories

| Path | Purpose |
|------|---------|
| `src/utils/` | Utility functions |
| `src/contexts/` | React Context providers |
| `src/hooks/` | Custom React hooks |

## Development Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Common Patterns

### Astro Component

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
</div>

<style>
  .card {
    padding: 1rem;
  }
</style>
```

### React Component

```typescript
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

### Using React in Astro

```astro
---
import Button from '../components/Button';
---

<Button client:load label="Click me" />
```

### Data Fetching (Build Time)

```astro
---
const data = await fetch('https://api.example.com/data')
  .then(res => res.json());
---

<div>{data.title}</div>
```

### Data Fetching (Client Side)

```typescript
import { useState, useEffect } from 'react';

const Component = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
};
```

## File-Based Routing

| File | Route |
|------|-------|
| `src/pages/index.astro` | `/` |
| `src/pages/about.astro` | `/about` |
| `src/pages/projects/index.astro` | `/projects` |
| `src/pages/projects/[slug].astro` | `/projects/[slug]` |

## Client Directives

| Directive | When to Load |
|-----------|--------------|
| `client:load` | Immediately |
| `client:idle` | When browser is idle |
| `client:visible` | When element is visible |
| `client:media="(max-width: 768px)"` | When media query matches |

## Styling

### Tailwind CSS

```astro
<div class="flex items-center justify-between p-4 bg-white rounded-lg">
  <h2 class="text-2xl font-bold">Title</h2>
</div>
```

### Scoped Styles (Astro)

```astro
<style>
  .card {
    padding: 1rem;
  }
</style>
```

### CSS Modules (React)

```typescript
import styles from './Button.module.css';

<button className={styles.button}>Click me</button>
```

## TypeScript

### Component Props

```typescript
interface Props {
  title: string;
  description?: string;
  count: number;
}
```

### Function Types

```typescript
const formatDate = (date: Date, format: string): string => {
  // Implementation
};
```

## Environment Variables

```bash
# .env
PUBLIC_API_URL=https://api.example.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.PUBLIC_API_URL;
```

## Common Imports

### Astro Components

```astro
---
import Layout from '../layouts/Layout.astro';
import Button from '../components/Button';
import { formatDate } from '../utils/date';
---
```

### React Components

```typescript
import React from 'react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
```

## Testing

### Component Test

```typescript
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

## Deployment

1. Build: `npm run build`
2. Deploy `dist/` directory to hosting provider
3. Set environment variables in hosting dashboard

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- --port 3000
```

### Build Errors

1. Check TypeScript: `npm run build`
2. Check lint: `npm run lint`
3. Review error messages
