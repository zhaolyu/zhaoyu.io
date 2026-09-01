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
  .mental-models {
    padding: var(--section-y) var(--section-x);
    background: var(--bg-primary);
  }

  .section-description {
    max-width: 60ch;
    margin: 0 auto var(--space-xl);
    font-size: var(--type-md);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    text-align: center;
  }

  .models-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: var(--space-lg);
    max-width: 72rem;
    /* min-width:0 lets the grid narrow past its content instead of overflowing. */
    min-width: 0;
    margin: 0 auto;
    padding: 0;
    list-style: none;
  }

  .models-grid > li {
    display: flex;
    min-width: 0;
  }

  .all-models-link {
    display: block;
    margin-top: var(--space-xl);
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    color: var(--accent-primary-text);
    text-align: center;
    text-decoration: none;
  }

  .all-models-link:hover {
    text-decoration: underline;
  }

  .teaser-note {
    margin: var(--space-2xs) 0 0;
    font-size: var(--type-xs);
    color: var(--text-muted);
    text-align: center;
  }

  @media (max-width: 768px) {
    .mental-models {
      padding: var(--section-y-mobile) var(--section-x);
    }
  }
</style>
