# Design Tokens Documentation Updates Needed

This document contains the updates that need to be made to `DESIGN_TOKENS.md` since the file cannot be edited programmatically.

## Summary

The `DESIGN_TOKENS.md` file needs to be updated to reflect:
1. Which tokens are documented but missing from `app.css`
2. Additional tokens that are used in components but not documented
3. Current state analysis showing 91+ hardcoded color instances

## Required Updates to DESIGN_TOKENS.md

### 1. Update Accent Colors Section (around line 47-51)

**Replace:**
```
**Primary Accent (Blue):**
- `--accent-primary`: Primary accent color (`#3b82f6` - blue-500)
- `--accent-primary-hover`: Hover state (`#2563eb` - blue-600)
- `--accent-primary-light`: Light variant (`#60a5fa` - blue-400)
- `--accent-primary-dark`: Dark variant (`#1d4ed8` - blue-700)
```

**With:**
```
**Primary Accent (Blue):**
- `--accent-primary`: Primary accent color (`#3b82f6` - blue-500) ⚠️ **MISSING FROM app.css**
- `--accent-primary-hover`: Hover state (`#2563eb` - blue-600) ⚠️ **MISSING FROM app.css**
- `--accent-primary-light`: Light variant (`#60a5fa` - blue-400) ⚠️ **MISSING FROM app.css** - Used extensively
- `--accent-primary-dark`: Dark variant (`#1d4ed8` - blue-700) ⚠️ **MISSING FROM app.css**

**Purple Accent:**
- `--accent-purple`: Purple accent color (`#c084fc` - purple-400) ⚠️ **MISSING FROM app.css** - Used in Skills chart
- `--accent-purple-light`: Light purple variant (`#a855f7` - purple-600) ⚠️ **MISSING FROM app.css** - Used in Skills chart goals
```

### 2. Update Accent Opacity Variants (around line 57-60)

**Replace:**
```
**Accent Opacity Variants:**
- `--accent-primary-10`: 10% opacity (`rgba(59, 130, 246, 0.1)`)
- `--accent-primary-20`: 20% opacity (`rgba(59, 130, 246, 0.2)`)
- `--accent-primary-30`: 30% opacity (`rgba(59, 130, 246, 0.3)`)
```

**With:**
```
**Accent Opacity Variants:**
- `--accent-primary-10`: 10% opacity (`rgba(59, 130, 246, 0.1)`) ⚠️ **MISSING FROM app.css** - Used in ProjectCard tags
- `--accent-primary-15`: 15% opacity (`rgba(59, 130, 246, 0.15)`) ⚠️ **MISSING FROM app.css** - Used in Skills chart glow
- `--accent-primary-20`: 20% opacity (`rgba(59, 130, 246, 0.2)`) ⚠️ **MISSING FROM app.css** - Used in Skills legend
- `--accent-primary-30`: 30% opacity (`rgba(59, 130, 246, 0.3)`) ⚠️ **MISSING FROM app.css** - Used in selection, EngineeringNote border
- `--accent-primary-dark-20`: Dark blue 20% opacity (`rgba(30, 58, 138, 0.2)`) ⚠️ **MISSING FROM app.css** - Used in ProjectCard diagram overlay
```

### 3. Update Status Colors (around line 62-65)

**Replace:**
```
**Status Colors:**
- `--status-success`: Success/positive state (`#10b981` - green-500)
- `--status-warning`: Warning state (`#fbbf24` - amber-400)
- `--status-error`: Error state (`#ef4444` - red-500)
```

**With:**
```
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
```

### 4. Add New Section After "Adding New Tokens" (around line 309)

**Add after line 318:**
```
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
```

### 5. Update "Accent Color Usage" Section (around line 288-307)

**Update the comment in the example:**
```
  /* ✅ CORRECT: Use accent tokens (once added to app.css) */
```

**And add after the example:**
```
**Current State**: Many components still use hardcoded colors. These should be refactored to use design tokens once tokens are added to `app.css`.
```

### 6. Update "Migration Guide" (around line 331-339)

**Replace:**
```
1. **Identify hardcoded values**: Colors, spacing, durations, etc.
2. **Find or create appropriate token**: Check existing tokens first
3. **Replace hardcoded value**: Use `var(--token-name)`
4. **Test theme switching**: Ensure dark mode works correctly
5. **Verify transitions**: Ensure smooth theme transitions
```

**With:**
```
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
```

### 7. Add Implementation Checklist Before "Related Documentation" (around line 341)

**Add:**
```
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
```

### 8. Update "Last Updated" Footer (line 349)

**Replace:**
```
**Last Updated**: Design tokens documentation for zhaoyu.io portfolio site.
```

**With:**
```
**Last Updated**: Design tokens documentation for zhaoyu.io portfolio site. Analysis completed: 91+ hardcoded color instances identified across landing page components.
```

## Notes

- All tokens marked with ⚠️ **MISSING FROM app.css** need to be added to `src/app.css`
- The documentation-handling rule has been updated to allow legitimate content updates
- This summary can be deleted once the main documentation is updated
