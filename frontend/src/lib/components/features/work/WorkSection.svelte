<script lang="ts">
  import { onMount } from 'svelte';
  import ProjectCard from './ProjectCard.svelte';
  import BuilderCard from '$lib/components/features/builder/BuilderCard.svelte';
  import { projectsData, builderProjects } from '$lib/constants/content';
  import { SectionHeader } from '$lib/components/ui';
  import { observeSection } from '$lib/utils/section-observer';
  import { visibleItems } from '$lib/utils/feature-flags';

  const displayProjects = visibleItems(projectsData.projects);
  const displayBuilderProjects = visibleItems(builderProjects);
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

  <!-- Always rendered so the project cards prerender; the reveal is animation-only. -->
  <div class="projects-container reveal" class:revealed={sectionVisible}>
    {#each displayProjects as project (project.title)}
      <ProjectCard {...project} />
    {/each}
  </div>

  <div class="systems-grid reveal reveal-delayed" class:revealed={sectionVisible}>
    {#each displayBuilderProjects as project (project.title)}
      <BuilderCard {project} />
    {/each}
  </div>
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
      transition-delay: 0.2s;
    }

    .reveal.revealed {
      opacity: 1;
      transform: none;
    }
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
