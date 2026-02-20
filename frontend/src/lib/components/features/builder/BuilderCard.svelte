<script lang="ts">
  import type { BuilderProject } from '$lib/constants/content';

  interface Props {
    project: BuilderProject;
  }

  let { project }: Props = $props();

  const categoryLabel: Record<BuilderProject['category'], string> = {
    professional: 'PROFESSIONAL',
    independent: 'INDEPENDENT',
    experiment: 'EXPERIMENT',
  };

  const statusLabel: Record<BuilderProject['status'], string> = {
    shipped: 'SHIPPED',
    'in-progress': 'IN PROGRESS',
    exploring: 'EXPLORING',
  };
</script>

<div class="builder-card">
  <div class="card-top">
    <span class="category-badge category-{project.category}">
      {categoryLabel[project.category]}
    </span>
    <span class="status-badge status-{project.status}">
      <span class="status-dot dot-{project.status}"></span>
      {statusLabel[project.status]}
    </span>
  </div>

  <h3 class="card-title">{project.title}</h3>
  <p class="card-description">{project.description}</p>

  {#if project.metrics}
    <div class="card-metrics">
      {#each project.metrics as metric}
        <div class="metric">
          <span class="metric-value">{metric.value}</span>
          <span class="metric-label">{metric.label}</span>
        </div>
      {/each}
    </div>
  {/if}

  <div class="card-stack">
    {#each project.stack as tech}
      <span class="stack-tag">{tech}</span>
    {/each}
  </div>
</div>

<style>
  .builder-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      transform 0.2s,
      box-shadow 0.2s;
  }

  .builder-card:hover {
    border-color: var(--accent-primary-20);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  :global(.dark) .builder-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .category-badge {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    border: 1px solid;
    font-weight: 600;
  }

  .category-professional {
    color: var(--accent-primary-light);
    border-color: var(--accent-primary-20);
    background: var(--accent-primary-10);
  }

  .category-independent {
    color: #f59e0b;
    border-color: rgba(245, 158, 11, 0.2);
    background: rgba(245, 158, 11, 0.08);
  }

  .category-experiment {
    color: #06b6d4;
    border-color: rgba(6, 182, 212, 0.2);
    background: rgba(6, 182, 212, 0.08);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.625rem;
    font-family: var(--font-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .status-dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot-shipped {
    background: #22c55e;
  }

  .dot-in-progress {
    background: var(--accent-primary-light);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .dot-exploring {
    background: #f59e0b;
  }

  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .card-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    transition: color 0.2s;
  }

  .card-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    flex: 1;
    transition: color 0.2s;
  }

  .card-metrics {
    display: flex;
    gap: 1.5rem;
    padding: 0.75rem 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    transition: border-color 0.2s;
  }

  .metric {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .metric-value {
    font-size: 0.875rem;
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--text-primary);
    transition: color 0.2s;
  }

  .metric-label {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .card-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: auto;
  }

  .stack-tag {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.2rem 0.5rem;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s;
  }
</style>
