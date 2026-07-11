<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { personaData, narrativeBio } from '$lib/constants/content';
  import { SectionHeader } from '$lib/components/ui';
  import { observeSection } from '$lib/utils/section-observer';

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

<section id="persona" class="persona-section" bind:this={section}>
  <SectionHeader badge="Principles & Persona">
    How I think,<br />
    <span class="headline-accent">outside the codebase.</span>
  </SectionHeader>

  {#if sectionVisible}
    <div class="bio-card" in:fly={{ y: 20, duration: 400 }}>
      <h3 class="card-title">{narrativeBio.title}</h3>
      <div class="card-body">
        {#each narrativeBio.paragraphs as paragraph (paragraph)}
          <p class="card-paragraph">{paragraph}</p>
        {/each}
      </div>
    </div>

    <div class="persona-grid" transition:fade={{ duration: 600, delay: 150 }}>
      {#each personaData as item, i (item.title)}
        <div class="persona-card" in:fly={{ y: 20, duration: 400, delay: i * 100 }}>
          <h3 class="card-title">{item.title}</h3>
          <div class="card-body">
            {#each item.body as paragraph (paragraph)}
              <p class="card-paragraph">{paragraph}</p>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
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
  }

  .bio-card {
    padding: var(--space-6);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: var(--space-5);
    transition:
      border-color 0.3s,
      background-color 0.3s;
  }

  .bio-card .card-paragraph {
    max-width: 72ch;
  }

  .persona-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }

  .persona-card {
    padding: var(--space-6);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition:
      border-color 0.3s,
      background-color 0.3s,
      transform 0.3s;
  }

  .persona-card:hover {
    border-color: var(--text-muted);
    background: var(--bg-primary);
    transform: translateY(-2px);
  }

  .card-title {
    font-size: 0.875rem;
    font-family: var(--font-mono);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent-primary-light);
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

    .persona-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
