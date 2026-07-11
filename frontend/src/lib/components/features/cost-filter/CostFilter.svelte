<script lang="ts">
  import type { SnapshotSource } from '$lib/types';

  let {
    sources,
    projects,
    selectedSources = $bindable<SnapshotSource[]>([]),
    selectedProjects = $bindable<string[]>([]),
  }: {
    sources: SnapshotSource[];
    projects: string[];
    selectedSources: SnapshotSource[];
    selectedProjects: string[];
  } = $props();

  function toggleSource(src: SnapshotSource) {
    selectedSources = selectedSources.includes(src)
      ? selectedSources.filter((v) => v !== src)
      : [...selectedSources, src];
  }

  function toggleProject(proj: string) {
    selectedProjects = selectedProjects.includes(proj)
      ? selectedProjects.filter((v) => v !== proj)
      : [...selectedProjects, proj];
  }

  function clearAll() {
    selectedSources = [];
    selectedProjects = [];
  }

  let hasFilters = $derived(selectedSources.length > 0 || selectedProjects.length > 0);
</script>

{#if sources.length > 0 || projects.length > 1}
  <div class="filter-bar">
    <div class="filter-chips">
      {#each sources as src}
        <button
          class="chip"
          class:chip-gcp={src === 'gcp-billing'}
          class:chip-github={src === 'github'}
          class:chip-active={selectedSources.includes(src)}
          onclick={() => toggleSource(src)}
          aria-pressed={selectedSources.includes(src)}
        >
          {src === 'gcp-billing' ? 'GCP Actual' : 'Estimate'}
        </button>
      {/each}

      {#if projects.length > 1}
        <span class="chip-divider"></span>
        {#each projects as proj}
          <button
            class="chip chip-project"
            class:chip-active-project={selectedProjects.includes(proj)}
            onclick={() => toggleProject(proj)}
            aria-pressed={selectedProjects.includes(proj)}
          >
            {proj}
          </button>
        {/each}
      {/if}

      {#if hasFilters}
        <button class="chip-clear" onclick={clearAll} aria-label="Clear filters"> ✕ clear </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .filter-bar {
    padding: var(--space-3) var(--space-5);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }

  .chip-divider {
    width: 1px;
    height: 16px;
    background: var(--border-color);
    margin: 0 var(--space-1);
  }

  .chip {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.625rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition:
      color 0.15s,
      border-color 0.15s,
      background-color 0.15s;
  }

  .chip:hover {
    color: var(--text-secondary);
    border-color: var(--text-muted);
  }

  /* GCP Actual chip */
  .chip-gcp.chip-active {
    background: rgba(16, 185, 129, 0.1);
    border-color: var(--status-success);
    color: var(--status-success);
  }

  /* Estimate chip */
  .chip-github.chip-active {
    background: var(--accent-infra-10);
    border-color: var(--accent-infra);
    color: var(--accent-infra);
  }

  /* Project chip */
  .chip-project.chip-active-project {
    background: var(--bg-secondary);
    border-color: var(--text-muted);
    color: var(--text-secondary);
  }

  .chip-clear {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.04em;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.15s;
    margin-left: var(--space-1);
  }

  .chip-clear:hover {
    color: var(--status-error);
  }

  @media (max-width: 640px) {
    .filter-bar {
      padding: var(--space-2) var(--space-4);
    }
  }
</style>
