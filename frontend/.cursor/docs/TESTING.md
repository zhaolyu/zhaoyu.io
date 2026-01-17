# Testing Guide

This guide provides comprehensive documentation for writing tests in the zhaoyu.io portfolio site.

## Test Framework Setup

### Vitest Configuration

The project uses Vitest as the test runner. Configuration is typically in `vitest.config.ts` or `package.json`:

- **Test Environment**: `jsdom` (browser-like environment)
- **Test Match**: `**/*.{test,spec}.{ts,tsx,js,jsx}`
- **Coverage**: Enabled via `--coverage` flag

### React Testing Library

**Preferred** for React component testing:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
```

### Astro Testing

For Astro components, use `@astrojs/testing-library` (if available) or test the rendered output:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/testing-library';
import Welcome from '../components/Welcome.astro';
```

## Test File Conventions

### Naming

- Use `*.test.ts`, `*.test.tsx`, `*.test.js`, or `*.spec.ts` extension
- Co-locate tests with source files
- Example: `Button.test.tsx` for `Button.tsx`

### Location

Tests are **co-located** with their source files:

```
src/
  components/
    Button.tsx
    Button.test.tsx  ← Test file here
```

### Test Structure

Organize tests using `describe` blocks:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      // Test
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', () => {
      // Test
    });
  });
});
```

## Testing Patterns by Code Type

### React Components

**Preferred: React Testing Library**

Focus on testing user-visible behavior:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Astro Components

Test Astro components by rendering them:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/testing-library';
import Welcome from '../components/Welcome.astro';

describe('Welcome', () => {
  it('should render correctly', async () => {
    const result = await render(Welcome, {
      props: { name: 'John' },
    });
    expect(result.html()).toContain('John');
  });
});
```

### Utilities

Test pure functions with various inputs:

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from '../utils/date';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2024');
  });

  it('should handle invalid dates', () => {
    expect(() => formatDate('invalid', 'MM/DD/YYYY')).toThrow();
  });
});
```

### Custom Hooks

Test custom hooks using React Testing Library hooks utilities:

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../hooks/useCounter';

describe('useCounter', () => {
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## Mocking Strategies

### Module Mocking

Use `vi.mock()` for entire modules:

```typescript
import { vi } from 'vitest';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' })),
}));
```

### API Mocking

Use MSW (Mock Service Worker) for HTTP requests:

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: 'test' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### localStorage Mocking

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test user interactions** - Test what users see and do
4. **Keep tests simple** - One assertion per test when possible
5. **Use descriptive test names** - Test names should clearly describe what they test
6. **Clean up** - Always clean up mocks and state in `afterEach`
7. **Test edge cases** - Cover error paths and boundary conditions

## Coverage Requirements

Aim for **at least 90% coverage** for:
- Statements
- Branches
- Functions
- Lines

Check coverage:
```bash
npm test -- --coverage
```

## Common Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Testing Form Inputs

```typescript
it('should update input value', () => {
  render(<Form />);
  const input = screen.getByLabelText('Name');
  
  fireEvent.change(input, { target: { value: 'John' } });
  
  expect(input).toHaveValue('John');
});
```

### Testing Context Providers

```typescript
it('should provide context value', () => {
  const { result } = renderHook(() => useTheme(), {
    wrapper: ThemeProvider,
  });
  
  expect(result.current.theme).toBe('light');
});
```
