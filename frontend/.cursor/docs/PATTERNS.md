# Patterns

Last verified against the code on 2026-10-04. `CLAUDE.md` (repo root) is authoritative.

Each pattern names a real file to copy from. Earlier versions of this page showed `+server.ts`
API routes, a `services/` client, client-side `fetch` and `$:` reactive statements; the site
has none of these. It is fully static with no backend.

## Component

Copy from `src/lib/components/ui/SectionHeader.svelte`.

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    children?: Snippet;
  }

  let { label, children }: Props = $props();
</script>

<div class="thing">
  <p class="thing-label">{label}</p>
  {#if children}{@render children()}{/if}
</div>

<style>
  .thing {
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    background: var(--surface-raised);
  }

  .thing-label {
    font-size: var(--type-sm);
    color: var(--text-muted);
  }
</style>
```

- A feature component lives in `src/lib/components/features/<name>/<Name>.svelte` with an
  `index.ts` that re-exports it; import it from that folder
  (`import { Hero } from '$lib/components/features/hero'`).
- A reusable primitive goes in `ui/` and is added to `ui/index.ts`. If people will reuse it,
  register a preview card in `src/lib/constants/design-system.ts`.

## Landing section with a scroll reveal

Copy from `src/lib/components/features/work/WorkSection.svelte` or `skills/Skills.svelte`.

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

<section id="example" class="example" bind:this={section}>
  <!-- Always rendered so the content prerenders; the reveal is animation-only. -->
  <div class="reveal" class:revealed={sectionVisible}>...</div>
</section>

<style>
  .example {
    max-width: var(--content-max);
    margin: 0 auto;
    padding: var(--section-y) var(--section-x);
  }

  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
    .reveal {
      opacity: 0;
      transform: translateY(16px);
      transition:
        opacity var(--duration-slow) var(--ease-out),
        transform var(--duration-slow) var(--ease-out);
    }

    .reveal.revealed {
      opacity: 1;
      transform: none;
    }
  }
</style>
```

Never gate content with `{#if sectionVisible}`. Width follows the Layout rule in
`.interface-design/system.md`: a self-padded section caps at `var(--content-max)`; an inner
container inside a padded wrapper caps at `calc(var(--content-max) - 2 * var(--section-x))`.
Then place the section in `src/routes/(main)/+page.svelte` (and the nav, if it is a
destination).

## Content-driven prerendered route

Copy from `src/routes/(main)/blog/[slug]/+page.ts`. Data comes from `$lib/constants`, not from
a network call.

```ts
import { error } from '@sveltejs/kit';
import { notesData } from '$lib/constants/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => notesData.notes.map((note) => ({ slug: note.slug }));

export const load: PageLoad = ({ params }) => {
  const note = notesData.notes.find((n) => n.slug === params.slug);
  if (!note) error(404, 'Note not found');
  return { note };
};
```

`src/routes/+layout.ts` sets `export const prerender = true` for the whole site. Content that
can be feature-flagged goes through `visibleItems` from `$lib/utils/feature-flags` in the
page, the sitemap and `entries` alike (see `work/[slug]/+page.ts`).

## Prerendered endpoint

Copy from `src/routes/sitemap.xml/+server.ts`: `export const prerender = true` and a `GET`
that returns a `Response` built from constants. These are build-time files, not APIs; test
them by calling `GET()` directly (`sitemap.test.ts`).

## Shared state

- **Store** (`src/lib/stores/theme.ts`): a `writable` wrapped in a factory that exposes
  `subscribe` plus intent methods (`toggle`, `set`, `init`). Browser access is guarded with
  `browser` from `$app/environment`. Consumers read it with `$theme`.
- **Runes class** (`src/lib/hud.svelte.ts`, `db.svelte.ts`, `simulator.svelte.ts`): a class
  with `$state` fields and methods, exported as a singleton. Lifecycle (start, stop) is
  driven by the consuming component's `onMount` so nothing runs site-wide.

## Client-only work on a prerendered page

`/infra` ships a prerendered shell; `costDB.start()` dynamically imports PGlite from
`onMount`, so nothing browser-only runs at build time (`src/routes/infra/+page.ts`,
`src/lib/db.svelte.ts`). Follow that shape for any browser-only dependency.

## Copy

All site copy lives in `src/lib/constants/content.ts` and is covered by guard tests. Edit it
through the `writer` skill; components only render it.
