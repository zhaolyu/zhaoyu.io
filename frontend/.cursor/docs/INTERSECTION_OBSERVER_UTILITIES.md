# Intersection Observer Utilities

Last verified against `src/lib/utils/intersection-core.ts` and `section-observer.ts` on
2026-10-04.

Two modules drive scroll-triggered behaviour:

| Module                 | Level | Use it for                                                                                     |
| ---------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| `section-observer.ts`  | high  | `observeSection` (one-shot reveal) and `createSectionObserver` (re-trigger, scroll-past)       |
| `intersection-core.ts` | low   | Building blocks: observer factory, mobile detection, scroll-past and initial-visibility checks |

## The rule that comes first

Content always renders. The observer only flips a flag that a CSS class reads, and the
animation itself is gated on
`@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`. Never write
`{#if visible}` around content: every route is prerendered, and gated content would be
missing from the HTML. (Earlier versions of this page showed `{#if sectionVisible}` with
`transition:fade`; do not copy that.)

## `observeSection(element, options)`: one-shot reveal

```ts
observeSection(element: HTMLElement | null, options: ObserveSectionOptions): () => void

interface ObserveSectionOptions {
  onVisible: () => void;            // called when the element intersects
  threshold?: number;               // 0 to 1; default from ANIMATION_CONFIG (mobile or desktop)
  checkInitialVisibility?: boolean; // default true: fire on mount if already in view
}
```

Returns a cleanup that disconnects the observer; a `null` element returns a no-op. Used by
`WorkSection`, `EngineeringNotes`, `Skills`, `MentalModels` and `PersonaSection`.

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { observeSection } from '$lib/utils/section-observer';

  let sectionVisible = $state(false);
  let section: HTMLElement;

  onMount(() =>
    observeSection(section, { onVisible: () => (sectionVisible = true), threshold: 0.1 }),
  );
</script>

<section bind:this={section}>
  <div class="reveal" class:revealed={sectionVisible}>Always in the HTML</div>
</section>
```

The `.reveal` / `.revealed` CSS lives in each component, inside the media query above (see
`Skills.svelte` or [PATTERNS.md](PATTERNS.md)).

## `createSectionObserver(element, options?)`: re-trigger and scroll-past

```ts
createSectionObserver(element: HTMLElement | null, options?: SectionObserverOptions): () => void

interface SectionObserverOptions extends IntersectionObserverOptions {
  scrollPastThreshold?: number; // px; default ANIMATION_CONFIG.scrollPastThreshold (200)
  enableReanimation?: boolean;  // default false
  onVisible?: () => void;
  onHidden?: () => void;
  onScrolledPast?: () => void;  // only called when enableReanimation is true
}
```

Behaviour:

- With `enableReanimation`, `onVisible` fires on first entry and again on re-entry only after
  the element was scrolled past by more than `scrollPastThreshold`; leaving the viewport by
  less than that does not reset it (prevents flicker).
- Without it, `onVisible` fires on every entry and `onHidden` only once scrolled well past.
- It always checks initial visibility on mount (no option to turn that off).

Used by `LatencySim.svelte`, which restarts its simulation on re-entry and skips autoplay when
`prefers-reduced-motion: reduce` is set. Any re-triggered animation must respect reduced
motion the same way.

## `intersection-core.ts`

| Function                     | Signature                                                                                                                 | Notes                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `createIntersectionObserver` | `(callback: (entry, isIntersecting) => void, options?: { threshold?, rootMargin?, debounceMs? }) => IntersectionObserver` | Mobile-aware defaults; debounced (150ms mobile, 50ms desktop, `0` disables); callback fires only when the intersecting state changes |
| `isMobileViewport`           | `(forceCheck = false) => boolean`                                                                                         | `window.innerWidth < 768`, cached per width; `false` on the server                                                                   |
| `isScrolledPast`             | `(entry, threshold = ANIMATION_CONFIG.scrollPastThreshold) => boolean`                                                    | `entry.boundingClientRect.top < -threshold`                                                                                          |
| `checkInitialVisibility`     | `(element, threshold, callback) => void`                                                                                  | In a `requestAnimationFrame`, calls `callback` if the visible ratio is at least `threshold`                                          |

## Configuration

Defaults come from `ANIMATION_CONFIG` in `src/lib/constants/config.ts`:

| Setting               | Desktop               | Mobile (< 768px)      |
| --------------------- | --------------------- | --------------------- |
| `threshold`           | `0.2`                 | `0.15`                |
| `rootMargin`          | `'0px 0px -50px 0px'` | `'0px 0px -80px 0px'` |
| `scrollPastThreshold` | `200` px              | `200` px              |

## Tests

`intersection-core.test.ts` and `section-observer.test.ts` mock `IntersectionObserver` and
cover the debounce, state-change, scroll-past and initial-visibility paths. Extend them when
you change either module.
