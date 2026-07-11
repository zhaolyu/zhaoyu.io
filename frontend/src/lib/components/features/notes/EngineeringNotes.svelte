<script lang="ts">
  import { onMount } from 'svelte';
  import EngineeringNote from './EngineeringNote.svelte';
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
  <SectionHeader badge="Digital Garden" headline="Engineering Notes." accentText="" />
  <div class="section-description">
    A collection of architectural decisions, performance constraints, and trade-offs I've
    encountered in production.
  </div>

  <!-- Always rendered so the notes prerender; the reveal is animation-only. -->
  <div class="notes-container reveal" class:revealed={sectionVisible}>
    {#each notesData.notes as note (note.slug)}
      <EngineeringNote
        slug={note.slug}
        title={note.title}
        date={note.date}
        tags={note.tags}
        content={note.content}
      />
    {/each}
    <a href="/blog" class="all-notes-link">All notes, individually addressable &rarr;</a>
  </div>
</section>

<style>
  .engineering-notes {
    padding: 8rem 1.5rem;
    max-width: 72rem;
    margin: 0 auto;
    background: var(--bg-primary);
    color: var(--text-primary);
    scroll-margin-top: 4rem;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  .section-description {
    color: var(--text-secondary);
    font-size: 1.125rem;
    line-height: 1.75;
    font-weight: 300;
    max-width: 42rem;
    margin-bottom: 4rem;
    transition: color 0.2s;
  }

  .notes-container {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .all-notes-link {
    display: inline-block;
    margin-top: 2rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-primary-light);
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
        opacity 0.6s ease,
        transform 0.5s ease;
    }

    .reveal.revealed {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    .engineering-notes {
      padding: 4rem 1.5rem;
    }
  }
</style>
