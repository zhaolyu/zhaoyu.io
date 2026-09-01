<script lang="ts">
  import { onMount } from 'svelte';
  import ModelCard from './ModelCard.svelte';
  import { teaserModels, MENTAL_MODELS } from '$lib/constants/models';
  import { SectionHeader } from '$lib/components/ui';
  import { observeSection } from '$lib/utils/section-observer';

  let sectionVisible = $state(false);
  let section: HTMLElement;

  const models = teaserModels();
  const remaining = MENTAL_MODELS.length - models.length;

  onMount(() => {
    return observeSection(section, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.1,
    });
  });
</script>

<section id="models" class="mental-models" bind:this={section}>
  <SectionHeader
    badge="Models"
    headline="Rules that pay off in more than one domain."
    accentText=""
  />
  <div class="section-description">
    A heuristic works in one place. A model works in two, which is the test each of these has to
    pass before it lands here: a receipt from engineering and a receipt from somewhere that shares
    no vocabulary with it.
  </div>

  <!-- Always rendered so the cards prerender; the reveal is animation-only. -->
  <div class="models-container reveal" class:revealed={sectionVisible}>
    <ul class="models-grid">
      {#each models as model (model.id)}
        <li><ModelCard {model} compact /></li>
      {/each}
    </ul>
    <a href="/models" class="all-models-link">
      All {MENTAL_MODELS.length} models, with the mechanism and the receipts &rarr;
    </a>
    <p class="teaser-note">{remaining} more on the page.</p>
  </div>
</section>

<style>
  /* Matches the notes section: the whole section is constrained and centred, so
     the header, the description and the grid share one left edge. Before this
     the header sat full-bleed at the page edge, the description was centred and
     the grid was centred in its own container: three alignments in one section,
     where every sibling section has one. */
  .mental-models {
    padding: var(--section-y) var(--section-x);
    max-width: 72rem;
    margin: 0 auto;
    background: var(--bg-primary);
    scroll-margin-top: var(--space-3xl);
  }

  .section-description {
    max-width: 42rem;
    margin: 0 0 var(--space-3xl);
    font-size: var(--type-md);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }

  .models-grid {
    display: grid;
    /* auto-fill and min(19rem, 100%) mirror the notes grid, so the two card
       rows on the landing page break at the same widths. */
    grid-template-columns: repeat(auto-fill, minmax(min(19rem, 100%), 1fr));
    gap: var(--space-lg);
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .models-grid > li {
    display: flex;
    min-width: 0;
  }

  .all-models-link {
    display: inline-block;
    margin-top: var(--space-xl);
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .all-models-link:hover {
    text-decoration: underline;
  }

  .teaser-note {
    margin: var(--space-2xs) 0 0;
    font-size: var(--type-xs);
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .mental-models {
      padding: var(--section-y-mobile) var(--section-x);
    }
  }
</style>
