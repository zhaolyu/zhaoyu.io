# Design Tokens

This document defines all design tokens (CSS variables) used throughout the zhaoyu.io portfolio site. Design tokens ensure consistency, maintainability, and proper theme support across all components.

> **MANDATORY**: All components MUST use design tokens instead of hardcoded values. This is required for theme support and maintainability.

## Overview

Design tokens are centralized CSS variables defined in `src/app.css`. They provide:
- **Consistency**: Single source of truth for colors, spacing, typography, etc.
- **Theme Support**: Automatic light/dark mode switching
- **Maintainability**: Update values in one place to affect entire application
- **Type Safety**: Tokens can be referenced in TypeScript for validation

## Token Categories

### 1. Color Tokens

#### Theme Colors (Background & Text)

**Background Colors:**
- `--bg-primary`: Main background color
  - Light: `#ffffff`
  - Dark: `#111827`
- `--bg-secondary`: Secondary background (hover states, cards)
  - Light: `#f9fafb`
  - Dark: `#1f2937`

**Text Colors:**
- `--text-primary`: Main text color
  - Light: `#111827`
  - Dark: `#f9fafb`
- `--text-secondary`: Secondary text color
  - Light: `#4b5563`
  - Dark: `#d1d5db`
- `--text-muted`: Muted/disabled text color
  - Light: `#6b7280`
  - Dark: `#9ca3af`

**Border Colors:**
- `--border-color`: Standard border color
  - Light: `rgba(0, 0, 0, 0.1)`
  - Dark: `rgba(255, 255, 255, 0.1)`

#### Accent Colors

**Primary Accent (Blue):**
- `--accent-primary`: Primary accent color (`#3b82f6` - blue-500) ⚠️ **MISSING FROM app.css**
- `--accent-primary-hover`: Hover state (`#2563eb` - blue-600) ⚠️ **MISSING FROM app.css**
- `--accent-primary-light`: Light variant (`#60a5fa` - blue-400) ⚠️ **MISSING FROM app.css** - Used extensively
- `--accent-primary-dark`: Dark variant (`#1d4ed8` - blue-700) ⚠️ **MISSING FROM app.css**

**Purple Accent:**
- `--accent-purple`: Purple accent color (`#c084fc` - purple-400) ⚠️ **MISSING FROM app.css** - Used in Skills chart
- `--accent-purple-light`: Light purple variant (`#a855f7` - purple-600) ⚠️ **MISSING FROM app.css** - Used in Skills chart goals

**Gradient Accents:**
- `--accent-gradient-start`: Gradient start (`#3b82f6` - blue-500)
- `--accent-gradient-end`: Gradient end (`#6366f1` - indigo-500)

**Accent Opacity Variants:**
- `--accent-primary-10`: 10% opacity (`rgba(59, 130, 246, 0.1)`) ⚠️ **MISSING FROM app.css** - Used in ProjectCard tags
- `--accent-primary-15`: 15% opacity (`rgba(59, 130, 246, 0.15)`) ⚠️ **MISSING FROM app.css** - Used in Skills chart glow
- `--accent-primary-20`: 20% opacity (`rgba(59, 130, 246, 0.2)`) ⚠️ **MISSING FROM app.css** - Used in Skills legend
- `--accent-primary-30`: 30% opacity (`rgba(59, 130, 246, 0.3)`) ⚠️ **MISSING FROM app.css** - Used in selection, EngineeringNote border
- `--accent-primary-dark-20`: Dark blue 20% opacity (`rgba(30, 58, 138, 0.2)`) ⚠️ **MISSING FROM app.css** - Used in ProjectCard diagram overlay

**Status Colors:**
- `--status-success`: Success/positive state (`#10b981` - green-500) ⚠️ **MISSING FROM app.css**
- `--status-success-light`: Light success variant (`#34d399` - green-400) ⚠️ **MISSING FROM app.css** - Used in LatencySim
- `--status-warning`: Warning state (`#fbbf24` - amber-400) ⚠️ **MISSING FROM app.css**
- `--status-error`: Error state (`#ef4444` - red-500) ⚠️ **MISSING FROM app.css** - Used in CodeManifesto
- `--status-error-light`: Light error variant (`#f87171` - red-400) ⚠️ **MISSING FROM app.css** - Used in LatencySim

**Neutral Colors:**
- `--neutral-400`: Neutral gray (`#9ca3af`) ⚠️ **MISSING FROM app.css**
- `--neutral-500`: Medium gray (`#737373`) ⚠️ **MISSING FROM app.css** - Used in Skills chart labels
- `--neutral-600`: Dark gray (`#404040`) ⚠️ **MISSING FROM app.css** - Used in Skills chart strokes
- `--neutral-900`: Very dark (`#0d0d0d`) ⚠️ **MISSING FROM app.css** - Used in CodeManifesto code background

### 2. Typography Tokens

**Font Families:**
- `--font-sans`: Sans-serif font stack
  - Value: `"Geist Sans", system-ui, -apple-system, sans-serif`
- `--font-mono`: Monospace font stack
  - Value: `"Geist Mono", "Courier New", monospace`

**Font Sizes:**
- `--font-size-xs`: Extra small (`0.75rem` / 12px)
- `--font-size-sm`: Small (`0.875rem` / 14px)
- `--font-size-base`: Base (`1rem` / 16px)
- `--font-size-lg`: Large (`1.125rem` / 18px)
- `--font-size-xl`: Extra large (`1.25rem` / 20px)
- `--font-size-2xl`: 2X large (`1.5rem` / 24px)
- `--font-size-3xl`: 3X large (`1.875rem` / 30px)
- `--font-size-4xl`: 4X large (`2.25rem` / 36px)

**Font Weights:**
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

**Letter Spacing:**
- `--letter-spacing-tight`: `-0.02em`
- `--letter-spacing-normal`: `0`
- `--letter-spacing-wide`: `0.05em`
- `--letter-spacing-wider`: `0.1em`
- `--letter-spacing-widest`: `0.2em`

**Line Heights:**
- `--line-height-tight`: `1.2`
- `--line-height-normal`: `1.5`
- `--line-height-relaxed`: `1.6`
- `--line-height-loose`: `1.75`

### 3. Spacing Tokens

**Base Spacing Scale (4px increments):**
- `--spacing-0`: `0`
- `--spacing-1`: `0.25rem` / 4px
- `--spacing-2`: `0.5rem` / 8px
- `--spacing-3`: `0.75rem` / 12px
- `--spacing-4`: `1rem` / 16px
- `--spacing-5`: `1.25rem` / 20px
- `--spacing-6`: `1.5rem` / 24px
- `--spacing-8`: `2rem` / 32px
- `--spacing-10`: `2.5rem` / 40px
- `--spacing-12`: `3rem` / 48px
- `--spacing-16`: `4rem` / 64px
- `--spacing-20`: `5rem` / 80px
- `--spacing-24`: `6rem` / 96px

**Component-Specific Spacing:**
- `--section-padding`: Section vertical padding (`8rem` / 128px)
- `--section-padding-mobile`: Mobile section padding (`4rem` / 64px)
- `--container-padding`: Container horizontal padding (`1rem` / 16px)
- `--container-max-width`: Max container width (`72rem` / 1152px)

### 4. Animation & Transition Tokens

**Transition Durations:**
- `--transition-fast`: `0.15s` (150ms)
- `--transition-base`: `0.2s` (200ms) - **Default for theme changes**
- `--transition-slow`: `0.3s` (300ms)
- `--transition-slower`: `0.5s` (500ms)

**Animation Durations:**
- `--animation-fast`: `200ms`
- `--animation-base`: `400ms`
- `--animation-slow`: `800ms`
- `--animation-slower`: `1000ms`
- `--animation-slowest`: `2000ms`

**Easing Functions:**
- `--ease-in`: `cubic-bezier(0.4, 0, 1, 1)`
- `--ease-out`: `cubic-bezier(0, 0, 0.2, 1)`
- `--ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)`
- `--ease-back-out`: `cubic-bezier(0.34, 1.56, 0.64, 1)`

**Standard Transitions:**
- `--transition-theme`: `background-color var(--transition-base), color var(--transition-base), border-color var(--transition-base)`
- `--transition-colors`: `color var(--transition-base), background-color var(--transition-base)`
- `--transition-transform`: `transform var(--transition-base) var(--ease-out)`

### 5. Border & Radius Tokens

**Border Radius:**
- `--radius-none`: `0`
- `--radius-sm`: `0.25rem` / 4px
- `--radius-base`: `0.5rem` / 8px
- `--radius-md`: `0.75rem` / 12px
- `--radius-lg`: `1rem` / 16px
- `--radius-full`: `9999px` (for pills/capsules)

**Border Width:**
- `--border-width-thin`: `1px`
- `--border-width-base`: `2px`
- `--border-width-thick`: `4px`

### 6. Shadow Tokens

**Box Shadows:**
- `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `--shadow-base`: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
- `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
- `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
- `--shadow-xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`

**Accent Glow:**
- `--shadow-accent`: `0 0 10px var(--accent-primary-20)`
- `--shadow-accent-lg`: `0 0 20px var(--accent-primary-30)`

### 7. Z-Index Tokens

**Layer Stack:**
- `--z-base`: `0`
- `--z-dropdown`: `1000`
- `--z-sticky`: `1020`
- `--z-fixed`: `1030`
- `--z-modal-backdrop`: `1040`
- `--z-modal`: `1050`
- `--z-popover`: `1060`
- `--z-tooltip`: `1070`

### 8. Breakpoint Tokens

**Media Query Breakpoints:**
- `--breakpoint-sm`: `640px`
- `--breakpoint-md`: `768px` - **Primary breakpoint**
- `--breakpoint-lg`: `1024px`
- `--breakpoint-xl`: `1280px`
- `--breakpoint-2xl`: `1536px`

**Usage:**
```css
@media (min-width: 768px) {
  /* Desktop styles */
}
```

### 9. Interaction Tokens

**Scroll Thresholds:**
- `--scroll-threshold-nav`: `20px` (navbar backdrop blur trigger)

**Intersection Observer:**
- `--intersection-threshold`: `0.2` (20% visibility threshold)
- `--intersection-root-margin`: `0px 0px -50px 0px`

**Touch Targets:**
- `--touch-target-min`: `44px` (minimum touch target size)

## Usage Guidelines

### ✅ DO: Use Design Tokens

```svelte
<style>
  .card {
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: var(--spacing-6);
    border-radius: var(--radius-base);
    border: var(--border-width-thin) solid var(--border-color);
    transition: var(--transition-theme);
  }

  .button {
    background: var(--accent-primary);
    color: white;
    padding: var(--spacing-3) var(--spacing-6);
    border-radius: var(--radius-full);
    transition: var(--transition-colors);
  }

  .button:hover {
    background: var(--accent-primary-hover);
  }
</style>
```

### ❌ DON'T: Hardcode Values

```svelte
<style>
  /* ❌ WRONG: Hardcoded values */
  .card {
    background: #ffffff;
    color: #111827;
    padding: 1.5rem;
    border-radius: 8px;
    transition: background-color 0.2s, color 0.2s;
  }

  /* ❌ WRONG: Hardcoded colors */
  .button {
    background: #3b82f6;
  }
</style>
```

### Theme-Aware Components

All components MUST support both light and dark modes using design tokens:

```svelte
<style>
  .component {
    /* Use theme-aware tokens */
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--border-color);
    
    /* Always add transitions for theme switching */
    transition: var(--transition-theme);
  }
</style>
```

### Accent Color Usage

Use accent color tokens instead of hardcoded blue values:

```svelte
<style>
  /* ✅ CORRECT: Use accent tokens (once added to app.css) */
  .badge {
    color: var(--accent-primary-light);
    background: var(--accent-primary-10);
    border-color: var(--accent-primary);
  }

  /* ❌ WRONG: Hardcoded accent */
  .badge {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.1);
  }
</style>
```

**Current State**: Many components still use hardcoded colors. These should be refactored to use design tokens once tokens are added to `app.css`.

## Adding New Tokens

When adding new design tokens:

1. **Add to `src/app.css`** in the appropriate section
2. **Document here** in the relevant category
3. **Update this document** with usage examples if needed
4. **Use semantic naming**: `--spacing-section` not `--spacing-128px`
5. **Consider theme variants**: Add dark mode values if needed
6. **Follow naming convention**: `--category-variant-modifier` (e.g., `--accent-primary-hover`)

## Current Status: Missing Tokens

⚠️ **IMPORTANT**: Many design tokens are documented here but are **NOT YET DEFINED** in `src/app.css`. The following tokens need to be added to `app.css`:

### Required Accent Color Tokens
- `--accent-primary` and variants (hover, light, dark)
- `--accent-purple` and `--accent-purple-light`
- All accent opacity variants (10, 15, 20, 30, dark-20)

### Required Status Color Tokens
- `--status-success` and `--status-success-light`
- `--status-error` and `--status-error-light`
- `--status-warning`

### Required Neutral Color Tokens
- `--neutral-400`, `--neutral-500`, `--neutral-600`, `--neutral-900`

**Impact**: Components currently use hardcoded color values instead of these tokens, which breaks theme consistency and maintainability. Analysis found **91+ hardcoded color instances** across landing page components.

## Token Naming Convention

Format: `--{category}-{variant}-{modifier}`

Examples:
- `--bg-primary` (background, primary variant)
- `--text-secondary` (text, secondary variant)
- `--accent-primary-hover` (accent, primary variant, hover modifier)
- `--spacing-section-padding` (spacing, section variant, padding modifier)
- `--transition-theme` (transition, theme variant)

## Migration Guide

When refactoring existing code to use design tokens:

1. **Add missing tokens to `app.css`**: Many tokens are documented but not yet defined
2. **Identify hardcoded values**: Colors, spacing, durations, etc. (91+ instances found in landing page components)
3. **Find or create appropriate token**: Check existing tokens first, or add new ones
4. **Replace hardcoded value**: Use `var(--token-name)`
5. **Test theme switching**: Ensure dark mode works correctly
6. **Verify transitions**: Ensure smooth theme transitions

### Priority Refactoring Areas

Based on code analysis, these components need refactoring:

1. **Hero.svelte** - Hardcoded blue colors (`#3b82f6`, `#60a5fa`)
2. **Skills.svelte** - Multiple hardcoded colors (blue, purple, neutral grays)
3. **CareerChart.svelte** - Hardcoded blue colors and SVG stroke colors
4. **ProjectCard.svelte** - Hardcoded blue colors and rgba values
5. **CodeManifesto.svelte** - Hardcoded error colors and neutral backgrounds
6. **LatencySim.svelte** - Hardcoded status colors (success, error)
7. **EngineeringNote.svelte** - Hardcoded blue border color
8. **+page.svelte** - Hardcoded selection color

**Estimated Impact**: ~91 hardcoded color values across landing page components.

## Implementation Checklist

To complete the design token system:

- [ ] Add all accent color tokens to `app.css` (primary, purple, opacity variants)
- [ ] Add all status color tokens to `app.css` (success, error, warning with light variants)
- [ ] Add neutral color tokens to `app.css` (400, 500, 600, 900)
- [ ] Refactor `Hero.svelte` to use tokens
- [ ] Refactor `Skills.svelte` to use tokens
- [ ] Refactor `CareerChart.svelte` to use tokens
- [ ] Refactor `ProjectCard.svelte` to use tokens
- [ ] Refactor `CodeManifesto.svelte` to use tokens
- [ ] Refactor `LatencySim.svelte` to use tokens
- [ ] Refactor `EngineeringNote.svelte` to use tokens
- [ ] Refactor `+page.svelte` selection color to use tokens
- [ ] Test theme switching across all components
- [ ] Remove ⚠️ **MISSING FROM app.css** warnings from this document

## Related Documentation

- [Patterns](PATTERNS.md) - Styling patterns and examples
- [Coding Conventions](CODING_CONVENTIONS.md) - Code style guidelines
- [Component Patterns](../rules/component-patterns.mdc) - Component styling rules

---

**Last Updated**: Design tokens documentation for zhaoyu.io portfolio site. Analysis completed: 91+ hardcoded color instances identified across landing page components.
