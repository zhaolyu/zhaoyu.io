<script lang="ts">
  import { onMount } from 'svelte';
  import NoteExcerptCard from './NoteExcerptCard.svelte';
  import { notesData } from '$lib/constants/content';
  import { SectionHeader } from '$lib/components/ui';
  import { observeSection } from '$lib/utils/section-observer';

  let sectionVisible = $state(false);
  let notesSection: HTMLElement;

  onMount(() => {
    return observeSection(notesSection, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.1, // Override to trigger earlier for this section
    });
  });
</script>

<section id="notes" class="engineering-notes" bind:this={notesSection}>
  <SectionHeader badge="Writing" headline="Engineering Notes." accentText="" />
  <div class="section-description">
    Architectural decisions, performance constraints, and trade-offs from production. Every note
    carries a receipt.
  </div>

  <!-- Always rendered so the notes prerender; the reveal is animation-only.
       Each card links to the note's canonical /blog/{slug} page — the full
       bodies live there, not on the landing page. -->
  <div class="notes-container reveal" class:revealed={sectionVisible}>
    <ul class="notes-grid">
      {#each notesData.notes as note (note.slug)}
        <li>
          <NoteExcerptCard {note} />
        </li>
      {/each}
    </ul>
    <a href="/blog" class="all-notes-link">All notes, individually addressable &rarr;</a>
  </div>
</section>

<style>
  .engineering-notes {
    padding: var(--section-y-lg) var(--section-x);
    max-width: 72rem;
    margin: 0 auto;
    background: var(--bg-primary);
    color: var(--text-primary);
    scroll-margin-top: var(--space-3xl);
    transition:
      background-color var(--duration-base),
      color var(--duration-base);
  }

  .section-description {
    color: var(--text-secondary);
    font-size: var(--type-md);
    line-height: var(--leading-relaxed);
    font-weight: var(--weight-light);
    max-width: 42rem;
    margin-bottom: var(--space-3xl);
    transition: color var(--duration-base);
  }

  .notes-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xl);
  }

  /* auto-fill lands on 3 columns at the 72rem container, 2 at tablet,
     1 on phones — no per-breakpoint column counts to maintain. */
  .notes-grid {
    display: grid;
    /* min() keeps the track from forcing a 19rem column into a narrower
       container — without it the cards ran 8px past a 320px viewport and gave
       the whole document a horizontal scrollbar. */
    grid-template-columns: repeat(auto-fill, minmax(min(19rem, 100%), 1fr));
    gap: var(--space-lg);
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Flex li so the card stretches to the tallest card in its row. */
  .notes-grid > li {
    display: flex;
  }

  .all-notes-link {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .all-notes-link:hover {
    text-decoration: underline;
  }

  /* Entrance animation only when JS runs and motion is allowed; content is
     always in the DOM so crawlers and no-JS readers get the full section. */
  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
    .reveal {
      opacity: 0;
      transform: translateY(16px);
      transition:
        opacity 0.6s var(--ease-out),
        transform 0.5s var(--ease-out);
    }

    .reveal.revealed {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    .engineering-notes {
      padding: var(--section-y-mobile) var(--section-x);
    }

    .section-description {
      margin-bottom: var(--space-xl);
    }
  }
</style>
