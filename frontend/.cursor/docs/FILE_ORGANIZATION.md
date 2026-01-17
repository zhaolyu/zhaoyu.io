# File Organization

## Directory Structure

```
zhaoyu.io/
├── frontend/
│   ├── .cursor/              # Cursor AI documentation and rules
│   ├── public/               # Static assets (images, fonts, etc.)
│   ├── src/
│   │   ├── assets/          # Assets processed by Astro
│   │   ├── components/      # Reusable components (Astro and React)
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # File-based routing (Astro pages)
│   │   ├── styles/          # Global styles
│   │   └── utils/           # Utility functions (optional)
│   ├── astro.config.mjs     # Astro configuration
│   ├── package.json         # Dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   └── tailwind.config.js   # Tailwind CSS configuration (if used)
```

## Source Directory (`src/`)

### `src/pages/`

File-based routing in Astro. Each file in this directory becomes a route.

**Structure**:
- `index.astro` → `/`
- `about.astro` → `/about`
- `projects/index.astro` → `/projects`
- `projects/[slug].astro` → `/projects/[slug]` (dynamic route)

**Example**:
```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="Home">
  <h1>Welcome</h1>
</Layout>
```

### `src/components/`

Reusable components (both Astro and React).

**Structure**:
```
components/
├── Welcome.astro          # Astro component
├── Button.tsx             # React component
├── ProjectCard.astro     # Astro component
└── Navigation.tsx         # React component
```

**Naming**:
- Astro components: PascalCase (e.g., `Welcome.astro`)
- React components: PascalCase (e.g., `Button.tsx`)

### `src/layouts/`

Layout components that wrap pages.

**Structure**:
```
layouts/
├── Layout.astro           # Base layout
└── BlogLayout.astro       # Blog-specific layout
```

**Example**:
```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### `src/assets/`

Assets processed by Astro (images, fonts, etc.).

**Structure**:
```
assets/
├── images/
│   ├── logo.svg
│   └── hero.jpg
└── fonts/
    └── custom-font.woff2
```

**Usage**:
```astro
---
import logo from '../assets/images/logo.svg';
---

<img src={logo} alt="Logo" />
```

### `src/styles/`

Global styles and CSS files.

**Structure**:
```
styles/
├── global.css             # Global styles
└── variables.css          # CSS variables (if used)
```

**Usage**:
```astro
---
import '../styles/global.css';
---
```

### `src/utils/` (Optional)

Utility functions and helpers.

**Structure**:
```
utils/
├── date.ts                # Date utilities
├── format.ts              # Formatting utilities
└── validation.ts          # Validation utilities
```

**Example**:
```typescript
// src/utils/date.ts
export const formatDate = (date: Date, format: string): string => {
  // Implementation
};
```

## Public Directory (`public/`)

Static assets served as-is (not processed by Astro).

**Structure**:
```
public/
├── favicon.svg
├── robots.txt
└── images/
    └── og-image.jpg
```

**Usage**:
```astro
<img src="/images/og-image.jpg" alt="OG Image" />
```

## File Naming Conventions

### Components
- **Astro**: PascalCase (e.g., `Welcome.astro`, `ProjectCard.astro`)
- **React**: PascalCase (e.g., `Button.tsx`, `Navigation.tsx`)

### Utilities
- **camelCase** (e.g., `formatDate.ts`, `apiClient.ts`)

### Pages
- **kebab-case** or **PascalCase** (e.g., `about.astro`, `project-detail.astro`)

### Config Files
- **kebab-case** (e.g., `astro.config.mjs`, `tailwind.config.js`)

## Import Paths

### Relative Imports

```typescript
// From a component
import Button from '../components/Button';
import { formatDate } from '../../utils/date';
```

### Path Aliases (if configured)

If you configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Then use:
```typescript
import Button from '@/components/Button';
import { formatDate } from '@/utils/date';
```

## Best Practices

1. **Co-locate related files** - Keep component files, styles, and tests together when possible
2. **Use clear, descriptive names** - File names should clearly indicate their purpose
3. **Organize by feature** - Group related components and utilities together
4. **Keep it flat** - Avoid deep nesting unless necessary
5. **Separate concerns** - Keep Astro components, React components, and utilities separate
