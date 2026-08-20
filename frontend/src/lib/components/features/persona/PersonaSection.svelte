<script lang="ts">
  import { onMount } from 'svelte';
  import { narrativeBio } from '$lib/constants/content';
  import { CareerTimeline } from '$lib/components/features/career-chart';
  import { SectionHeader } from '$lib/components/ui';
  import { observeSection } from '$lib/utils/section-observer';

  /** The About section: the narrative bio, then the career as a timeline. */
  let sectionVisible = $state(false);
  let section: HTMLElement;

  onMount(() => {
    return observeSection(section, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.1,
    });
  });
</script>

<section id="about" class="persona-section" bind:this={section}>
  <SectionHeader badge="About">
    Both tracks.<br />
    <span class="headline-accent">On purpose.</span>
  </SectionHeader>

  <!-- Always rendered so the bio and timeline prerender; the reveal is animation-only. -->
  <div class="bio-card reveal" class:revealed={sectionVisible}>
    <h3 class="card-title">{narrativeBio.title}</h3>
    <div class="card-body">
      {#each narrativeBio.paragraphs as paragraph (paragraph)}
        <p class="card-paragraph">{paragraph}</p>
      {/each}
    </div>
  </div>

  <div class="reveal reveal-delayed" class:revealed={sectionVisible}>
    <CareerTimeline />
  </div>
</section>

<style>
  .persona-section {
    padding: 6rem 1.5rem;
    max-width: 72rem;
    margin: 0 auto;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition:
      background-color 0.2s,
      color 0.2s;
    border-bottom: 1px solid var(--border-color);
    scroll-margin-top: 4rem;
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

    .reveal-delayed {
      transition-delay: 0.15s;
    }

    .reveal.revealed {
      opacity: 1;
      transform: none;
    }
  }

  .bio-card {
    padding: var(--space-xl);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: var(--space-lg);
    transition:
      border-color 0.3s,
      background-color 0.3s;
  }

  .bio-card .card-paragraph {
    max-width: 72ch;
  }

  .card-title {
    font-size: 0.875rem;
    font-family: var(--font-mono);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent-primary-text);
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .card-paragraph {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--text-secondary);
    font-weight: 300;
  }

  @media (max-width: 768px) {
    .persona-section {
      padding: 4rem 1rem;
    }
  }
</style>
