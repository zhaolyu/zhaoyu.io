# Coding Conventions

This document outlines the coding standards and conventions used in the zhaoyu.io portfolio site.

## ESLint Configuration

**Configuration File**: `.eslintrc.js` or `eslint.config.js` (if using flat config)

### Base Configuration

- **Extends**: Project-specific ESLint config
- **Parser**: `@typescript-eslint/parser` for TypeScript files
- **Environments**: `browser`, `node`

### Key Rules

- `no-console`: `warn` or `error` - Console statements should be avoided in production
- `semi`: `['error', 'always']` - Requires semicolons
- TypeScript strict mode enabled

## Prettier Configuration

**Configuration File**: `.prettierrc` or `prettier.config.js`

### Settings

- `printWidth`: `100` - Maximum line length
- `singleQuote`: `true` - Use single quotes
- `trailingComma`: `'all'` - Trailing commas wherever possible
- `bracketSpacing`: `true` - Spaces inside object literals

### Usage

Run Prettier to format code:
```bash
npm run format  # or npm run lint:fix
```

## TypeScript Configuration

**Configuration File**: `tsconfig.json`

- Strict mode enabled
- Type checking for `.ts` and `.tsx` files
- Path aliases configured (if used)

## Naming Conventions

### Components

- **Astro Components**: PascalCase (e.g., `Welcome.astro`, `Layout.astro`)
- **React Components**: PascalCase (e.g., `Button.tsx`, `ProjectCard.tsx`)
- **Component files**: Match component name

### Functions and Variables

- **camelCase** for functions and variables: `fetchData`, `userName`, `isLoading`

### Constants

- **UPPER_SNAKE_CASE** for constants: `API_BASE_URL`, `MAX_RETRIES`

### Files and Directories

- **PascalCase** for component files: `Welcome.astro`, `Button.tsx`
- **camelCase** for utility files: `formatDate.ts`, `apiClient.ts`
- **kebab-case** for config files: `astro.config.mjs`

## Import Conventions

### Relative Imports

Use relative imports or path aliases:

```typescript
// Relative imports
import Component from '../components/Component';
import { formatDate } from '../../utils/date';

// Path aliases (if configured in tsconfig.json)
import Component from '@/components/Component';
```

### Import Order

While not strictly enforced, typical order:
1. Astro imports (for `.astro` files)
2. React and React-related imports
3. Third-party libraries
4. Application imports (components, utils, etc.)
5. Relative imports
6. Styles

```typescript
// Astro component example
---
import Layout from '../layouts/Layout.astro';
import Button from '../components/Button';
import { formatDate } from '../utils/date';
import '../styles/global.css';
---
```

## Component Conventions

### Astro Components

```astro
---
// Component script (TypeScript)
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<article class="card">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</article>

<style>
  .card {
    padding: 1rem;
  }
</style>
```

### React Components

```typescript
import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => (
  <button 
    className={`btn btn-${variant}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Button;
```

## Code Style

- 2 spaces indentation
- Single quotes for strings
- Always use semicolons
- Always use braces for if/for/while
- Use TypeScript for type safety

## Comments and Documentation

**Minimize inline comments** - Write self-documenting code through clear naming and structure. Only add inline comments when the code's intent is genuinely unclear.

**Use JSDoc/TSDoc for function/component documentation**:

```typescript
/**
 * Formats a date string according to the specified format pattern.
 * @param date - The date to format
 * @param format - Format pattern (e.g., 'MM/DD/YYYY')
 * @returns Formatted date string
 */
const formatDate = (date: Date | string, format: string): string => {
  // Implementation
};
```

**Avoid:**
- Redundant comments that restate what the code does
- Commented-out code (remove it instead)
- Excessive inline explanations for straightforward code

**Prefer:**
- Clear variable and function names
- JSDoc/TSDoc for exported functions and components
- Brief comments only for complex business logic or non-obvious behavior

## SOLID Principles

Follow SOLID principles for maintainable code:

- **Single Responsibility**: Each function/component does one thing well
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Clients shouldn't depend on interfaces they don't use
- **Dependency Inversion**: Depend on abstractions, not concretions

## Styling Conventions

### Tailwind CSS

Use Tailwind utility classes for styling:

```astro
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-gray-900">Title</h2>
</div>
```

### CSS Modules (if used)

```typescript
import styles from './Component.module.css';

<div className={styles.container}>
  <h2 className={styles.title}>Title</h2>
</div>
```

## Best Practices

1. **Use Astro for static content** - Leverage zero-JS by default
2. **Use React for interactivity** - Only add React when you need client-side interactivity
3. **Type safety** - Always use TypeScript interfaces for props and function parameters
4. **Component composition** - Compose smaller components into larger ones
5. **Progressive enhancement** - Start with Astro, add React only where needed
