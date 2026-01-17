# Common Patterns

This document outlines common code patterns and practices used throughout the zhaoyu.io portfolio site.

## Astro Component Pattern

### Basic Astro Component

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
    border: 1px solid #ccc;
  }
</style>
```

### Astro Component with Data Fetching

```astro
---
// Fetch data at build time
const projects = await fetch('https://api.example.com/projects')
  .then(res => res.json());

interface Props {
  featured?: boolean;
}

const { featured = false } = Astro.props;
const filteredProjects = featured 
  ? projects.filter(p => p.featured)
  : projects;
---

<section>
  {filteredProjects.map(project => (
    <article>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </article>
  ))}
</section>
```

## React Component Pattern

### Basic React Component

```typescript
import React, { useState } from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick?.();
  };

  return (
    <button 
      onClick={handleClick}
      className={clicked ? 'clicked' : ''}
    >
      {label}
    </button>
  );
};

export default Button;
```

### React Component with Context

```typescript
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemedButton: React.FC<{ label: string }> = ({ label }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <button className={`btn btn-${theme}`}>
      {label}
    </button>
  );
};

export default ThemedButton;
```

## Context Provider Pattern

### Creating a Context

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Using Context in Astro

```astro
---
import ThemeProvider from '../contexts/ThemeContext';
import ThemedButton from '../components/ThemedButton';
---

<ThemeProvider client:load>
  <ThemedButton client:load label="Toggle Theme" />
</ThemeProvider>
```

## Custom Hook Pattern

### Creating a Custom Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

### Using a Custom Hook

```typescript
import { useLocalStorage } from '../hooks/useLocalStorage';

const Component = () => {
  const [name, setName] = useLocalStorage('name', '');

  return (
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  );
};
```

## Data Fetching Pattern

### Fetching Data in Astro (Build Time)

```astro
---
// Fetch at build time
const data = await fetch('https://api.example.com/data')
  .then(res => res.json())
  .catch(() => ({}));
---

<div>
  {data.title && <h1>{data.title}</h1>}
</div>
```

### Fetching Data in React (Client Side)

```typescript
import { useState, useEffect } from 'react';

const DataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return <div>{data.title}</div>;
};
```

## Layout Pattern

### Base Layout

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Portfolio site' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/projects">Projects</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>&copy; 2024 zhaoyu.io</p>
    </footer>
  </body>
</html>
```

### Using a Layout

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="About" description="Learn more about me">
  <h1>About Me</h1>
  <p>Welcome to my portfolio!</p>
</Layout>
```

## Styling Patterns

### Tailwind CSS

```astro
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-gray-900">Title</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

### Scoped Styles (Astro)

```astro
<style>
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
```

### CSS Modules (React)

```typescript
// Button.module.css
.button {
  padding: 0.5rem 1rem;
  background: blue;
  color: white;
  border: none;
  border-radius: 4px;
}

// Button.tsx
import styles from './Button.module.css';

<button className={styles.button}>Click me</button>
```

## Error Handling Pattern

### Error Boundary (React)

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Best Practices

1. **Use Astro for static content** - Leverage zero-JS by default
2. **Use React for interactivity** - Only add React when you need client-side interactivity
3. **Type safety** - Always use TypeScript interfaces
4. **Component composition** - Compose smaller components into larger ones
5. **Progressive enhancement** - Start with Astro, add React only where needed
6. **Error handling** - Always handle errors gracefully
7. **Accessibility** - Use semantic HTML and ARIA attributes
