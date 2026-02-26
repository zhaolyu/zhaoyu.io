<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import ProjectCard from './ProjectCard.svelte';
  import BuilderCard from '$lib/components/features/builder/BuilderCard.svelte';
  import { projectsData, builderProjects } from '$lib/constants/content';
  import { SectionHeader } from '$lib/components/ui';
  import { observeSection } from '$lib/utils/section-observer';

  const displayProjects = projectsData.projects;
  let sectionVisible = $state(false);
  let workSection: HTMLElement;

  onMount(() => {
    return observeSection(workSection, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.1,
    });
  });
</script>

<section id="work" class="work-section" bind:this={workSection}>
  <SectionHeader badge="Selected Work & Systems">
    Systems I've architected,<br />
    <span class="headline-accent">from CNBC to architectural sandboxes.</span>
  </SectionHeader>

  {#if sectionVisible}
    <div class="projects-container" transition:fade={{ duration: 600 }}>
      {#each displayProjects as project}
        <ProjectCard {...project} />
      {/each}
    </div>

    <div class="systems-grid" transition:fade={{ duration: 600, delay: 200 }}>
      {#each builderProjects as project}
        <BuilderCard {project} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .work-section {
    padding: 8rem 1.5rem;
    max-width: 72rem;
    margin: 0 auto;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition:
      background-color 0.2s,
      color 0.2s;
    scroll-margin-top: 4rem;
  }

  @media (min-width: 768px) {
    .work-section {
      scroll-margin-top: 5rem;
    }
  }

  .projects-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-bottom: 4rem;
  }

  .systems-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }

  @media (max-width: 768px) {
    .work-section {
      padding: 8rem 1.5rem 4rem 1.5rem;
    }

    .systems-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
