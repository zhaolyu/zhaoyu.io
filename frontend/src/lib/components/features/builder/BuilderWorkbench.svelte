<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import BuilderCard from './BuilderCard.svelte';
  import { builderProjects } from '$lib/constants/content';
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

<section id="builder" class="workbench-section" bind:this={section}>
  <SectionHeader badge="Builder's Workbench">
    What I'm building<br />
    <span class="headline-accent">beyond the 9-to-5.</span>
  </SectionHeader>

  {#if sectionVisible}
    <div class="cards-grid" transition:fade={{ duration: 600 }}>
      {#each builderProjects as project}
        <BuilderCard {project} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .workbench-section {
    padding: 6rem 1.5rem;
    max-width: 72rem;
    margin: 0 auto;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition:
      background-color 0.2s,
      color 0.2s;
    scroll-margin-top: 2rem;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    .workbench-section {
      padding: 4rem 1rem;
    }

    .cards-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
