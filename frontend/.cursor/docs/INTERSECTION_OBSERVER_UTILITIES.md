# Intersection Observer Utilities

Comprehensive guide to scroll-triggered visibility and animation utilities in `src/lib/utils/`.

## Overview

The intersection observer utilities are split into two files:

1. **`intersection-core.ts`** - Low-level building blocks
2. **`section-observer.ts`** - High-level section observers

## Quick Decision Guide

**Use `observeSection` when:**
- You need simple show/hide functionality
- Section should appear once when scrolled into view
- No reanimation needed

**Use `createSectionObserver` when:**
- You need reanimation when scrolling back into view
- You need scroll-past detection
- You're animating SVGs or complex components
- You need conditional visibility callbacks

**Use `intersection-core.ts` directly when:**
- Building custom observer logic
- Need fine-grained control over observer behavior
- Creating specialized utilities

## File Structure

```
src/lib/utils/
├── intersection-core.ts    # Core utilities (low-level)
└── section-observer.ts     # Section observers (high-level)
```

---

## Core Utilities (`intersection-core.ts`)

Low-level building blocks for intersection observers.

### `createIntersectionObserver(callback, options?)`

Creates an IntersectionObserver with mobile-aware configuration and debouncing.

**Parameters:**
- `callback: IntersectionObserverCallback` - Function called when intersection changes
- `options?: IntersectionObserverOptions` - Optional configuration

**Returns:** `IntersectionObserver` instance

**Options:**
```typescript
interface IntersectionObserverOptions {
  threshold?: number;        // 0-1 ratio (default: mobile/desktop from config)
  rootMargin?: string;       // CSS margin string (default: mobile/desktop from config)
  debounceMs?: number;       // Debounce delay (default: 150ms mobile, 50ms desktop)
}
```

**Features:**
- Automatic mobile/desktop detection
- Debouncing to prevent flickering on mobile
- State change detection (only fires on actual changes)

**Example:**
```typescript
import { createIntersectionObserver } from '$lib/utils/intersection-core';

const observer = createIntersectionObserver(
  (entry, isIntersecting) => {
    if (isIntersecting) {
      console.log('Element is visible');
    }
  },
  { threshold: 0.2 }
);

observer.observe(element);
```

### `isMobileViewport(forceCheck?)`

Detects if viewport is mobile (< 768px) with caching.

**Parameters:**
- `forceCheck?: boolean` - Bypass cache and check again

**Returns:** `boolean`

**Features:**
- Caches result to avoid repeated checks
- Automatically invalidates cache on window resize

**Example:**
```typescript
import { isMobileViewport } from '$lib/utils/intersection-core';

if (isMobileViewport()) {
  // Mobile-specific logic
}
```

### `isScrolledPast(entry, threshold?)`

Checks if element has been scrolled past a threshold.

**Parameters:**
- `entry: IntersectionObserverEntry` - Observer entry
- `threshold?: number` - Pixels past viewport (default: from config)

**Returns:** `boolean`

**Example:**
```typescript
import { isScrolledPast } from '$lib/utils/intersection-core';

const observer = createIntersectionObserver((entry, isIntersecting) => {
  if (!isIntersecting && isScrolledPast(entry, 200)) {
    console.log('Scrolled 200px past element');
  }
});
```

### `checkInitialVisibility(element, threshold, callback)`

Checks if element is visible on mount and triggers callback.

**Parameters:**
- `element: HTMLElement` - Element to check
- `threshold: number` - Visibility threshold (0-1 ratio)
- `callback: () => void` - Function to call if visible

**Features:**
- Uses `requestAnimationFrame` for accurate timing
- Calculates visible ratio based on threshold

**Example:**
```typescript
import { checkInitialVisibility } from '$lib/utils/intersection-core';

checkInitialVisibility(element, 0.2, () => {
  console.log('Element is already 20% visible on mount');
});
```

---

## Section Observers (`section-observer.ts`)

High-level utilities for section visibility and animations.

### `observeSection(element, options)`

Simple utility for basic section visibility tracking.

**When to use:**
- Basic show/hide functionality
- Sections that appear once when scrolled into view
- No reanimation needed

**Parameters:**
- `element: HTMLElement | null` - Element to observe
- `options: ObserveSectionOptions` - Configuration

**Returns:** Cleanup function to disconnect observer

**Options:**
```typescript
interface ObserveSectionOptions {
  onVisible: () => void;              // Required: Called when section becomes visible
  threshold?: number;                  // 0-1 ratio (default: from config)
  checkInitialVisibility?: boolean;    // Check on mount (default: true)
}
```

**Example:**
```svelte
<script>
  import { observeSection } from '$lib/utils/section-observer';
  
  let sectionVisible = $state(false);
  let container: HTMLElement;
  
  onMount(() => {
    return observeSection(container, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.1
    });
  });
</script>

<section bind:this={container}>
  {#if sectionVisible}
    <div transition:fade>Content appears when scrolled into view</div>
  {/if}
</section>
```

**Used by:**
- `WorkSection.svelte`
- `EngineeringNotes.svelte`

---

### `createSectionObserver(element, options?)`

Advanced section observer with reanimation and scroll-past detection.

**When to use:**
- SVG animations that need to re-trigger
- Sections that should reanimate when scrolled back into view
- Need scroll-past detection
- Complex visibility logic

**Parameters:**
- `element: HTMLElement | null` - Element to observe
- `options?: SectionObserverOptions` - Configuration

**Returns:** Cleanup function to disconnect observer

**Options:**
```typescript
interface SectionObserverOptions extends IntersectionObserverOptions {
  scrollPastThreshold?: number;    // Pixels for scroll-past detection (default: from config)
  enableReanimation?: boolean;      // Enable reanimation (default: false)
  onVisible?: () => void;           // Called when section becomes visible
  onHidden?: () => void;            // Called when section becomes hidden
  onScrolledPast?: () => void;     // Called when scrolled past (requires enableReanimation)
}
```

**Reanimation Behavior:**
- When `enableReanimation: true`, `onVisible` is called:
  - First time entering view
  - Re-entering after being scrolled past
- `onScrolledPast` is called when element is scrolled well past the threshold
- Prevents flickering by keeping content visible if not scrolled far enough

**Example 1: Basic Reanimation**
```svelte
<script>
  import { createSectionObserver } from '$lib/utils/section-observer';
  
  let sectionVisible = $state(false);
  let container: HTMLElement;
  
  onMount(() => {
    return createSectionObserver(container, {
      enableReanimation: true,
      onVisible: () => {
        sectionVisible = true;
      },
      onScrolledPast: () => {
        sectionVisible = false; // Reset for next animation
      }
    });
  });
</script>
```

**Example 2: SVG Animation with Counter Key Pattern**
```svelte
<script>
  import { createSectionObserver } from '$lib/utils/section-observer';
  import { draw } from 'svelte/transition';
  
  let sectionVisible = $state(false);
  let animationKey = $state(0); // Counter for forcing transition re-trigger
  let container: HTMLElement;
  
  onMount(() => {
    let hasScrolledPast = false;
    
    return createSectionObserver(container, {
      enableReanimation: true,
      onVisible: () => {
        if (hasScrolledPast) {
          // Reset and remount to trigger animation
          sectionVisible = false;
          animationKey++;
          setTimeout(() => {
            sectionVisible = true;
          }, 0);
        } else {
          // First time
          sectionVisible = true;
          animationKey++;
        }
        hasScrolledPast = false;
      },
      onScrolledPast: () => {
        hasScrolledPast = true;
      },
      threshold: 0.2
    });
  });
</script>

<section bind:this={container}>
  {#if sectionVisible}
    {#key animationKey}
      <path
        d={pathD}
        in:draw={{ duration: 2000 }}
      />
    {/key}
  {/if}
</section>
```

**Used by:**
- `CareerChart.svelte` - SVG path animation
- `LatencySim.svelte` - Simulation re-trigger
- `Skills.svelte` - SVG polygon animations

---

## Common Patterns

### Pattern 1: Simple Show/Hide

```svelte
<script>
  import { observeSection } from '$lib/utils/section-observer';
  
  let visible = $state(false);
  let element: HTMLElement;
  
  onMount(() => {
    return observeSection(element, {
      onVisible: () => visible = true
    });
  });
</script>

<div bind:this={element}>
  {#if visible}
    <div transition:fade>Content</div>
  {/if}
</div>
```

### Pattern 2: SVG Animation Re-trigger

```svelte
<script>
  import { createSectionObserver } from '$lib/utils/section-observer';
  
  let visible = $state(false);
  let key = $state(0);
  let element: HTMLElement;
  
  onMount(() => {
    let scrolledPast = false;
    
    return createSectionObserver(element, {
      enableReanimation: true,
      onVisible: () => {
        if (scrolledPast) {
          visible = false;
          key++;
          setTimeout(() => visible = true, 0);
        } else {
          visible = true;
          key++;
        }
        scrolledPast = false;
      },
      onScrolledPast: () => {
        scrolledPast = true;
      }
    });
  });
</script>

<div bind:this={element}>
  {#if visible}
    {#key key}
      <svg>
        <path in:draw={{ duration: 2000 }} />
      </svg>
    {/key}
  {/if}
</div>
```

### Pattern 3: Progress Animation

```svelte
<script>
  import { createSectionObserver } from '$lib/utils/section-observer';
  import { tweened } from 'svelte/motion';
  
  let visible = $state(false);
  let key = $state(0);
  let progress = tweened(0);
  let element: HTMLElement;
  
  function triggerAnimation() {
    visible = true;
    key++;
    progress.set(0);
    setTimeout(() => progress.set(1), 100);
  }
  
  onMount(() => {
    return createSectionObserver(element, {
      enableReanimation: true,
      onVisible: triggerAnimation
    });
  });
</script>

<div bind:this={element}>
  {#if visible}
    {#key key}
      <div style="width: {$progress * 100}%">Progress</div>
    {/key}
  {/if}
</div>
```

---

## Configuration

Utilities use `ANIMATION_CONFIG` from `$lib/constants/config`:

```typescript
// Default thresholds
mobile: { threshold: 0.1, rootMargin: '0px' }
desktop: { threshold: 0.2, rootMargin: '0px' }

// Scroll-past threshold
scrollPastThreshold: 200 // pixels
```

---

## Best Practices

1. **Always return cleanup function from `onMount`**
   ```svelte
   onMount(() => {
     return observeSection(element, { onVisible: ... });
   });
   ```

2. **Use counter keys for transition re-triggering**
   ```svelte
   let animationKey = $state(0);
   // In onVisible: animationKey++
   {#key animationKey}
     <element in:transition />
   {/key}
   ```

3. **Reset state when scrolled past for clean reanimation**
   ```typescript
   onScrolledPast: () => {
     sectionVisible = false;
   }
   ```

4. **Choose the right utility**
   - Simple show/hide → `observeSection`
   - Reanimation needed → `createSectionObserver`
   - Custom logic → `intersection-core.ts` directly

5. **Handle null elements gracefully**
   - All utilities handle `null` elements
   - Return no-op cleanup function if element is null

---

## Troubleshooting

### Animation doesn't re-trigger

**Problem:** SVG or transition doesn't re-animate when scrolling back into view.

**Solution:** Use counter key pattern:
```svelte
let key = $state(0);
onVisible: () => { key++; }
{#key key}
  <element in:transition />
{/key}
```

### Layout shifts on scroll

**Problem:** Content unmounts/remounts causing layout jumps.

**Solution:** Keep content rendered, use CSS opacity/visibility:
```svelte
<div class:invisible={!visible}>
  <!-- Content stays in DOM -->
</div>
```

### Observer not firing

**Problem:** `onVisible` not called when element enters view.

**Solution:** 
- Check element binding: `bind:this={element}`
- Verify threshold is appropriate
- Check if element is already visible on mount (use `checkInitialVisibility`)

---

## API Reference Summary

### `intersection-core.ts`

| Function | Purpose | Returns |
|----------|---------|---------|
| `createIntersectionObserver(callback, options?)` | Create observer with mobile-aware config | `IntersectionObserver` |
| `isMobileViewport(forceCheck?)` | Detect mobile viewport (cached) | `boolean` |
| `isScrolledPast(entry, threshold?)` | Check if scrolled past threshold | `boolean` |
| `checkInitialVisibility(element, threshold, callback)` | Check initial visibility on mount | `void` |

### `section-observer.ts`

| Function | Purpose | Returns |
|----------|---------|---------|
| `observeSection(element, options)` | Simple section visibility | `() => void` (cleanup) |
| `createSectionObserver(element, options?)` | Advanced with reanimation | `() => void` (cleanup) |

---

## Related Documentation

- [Patterns](PATTERNS.md) - Component patterns and examples
- [File Organization](FILE_ORGANIZATION.md) - Project structure
- [Coding Conventions](CODING_CONVENTIONS.md) - Code style guidelines

---

**Last Updated**: Documentation for intersection observer utilities in zhaoyu.io portfolio site.
