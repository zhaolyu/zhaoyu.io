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
    active: 'ACTIVE',
    'beta-pilot': 'BETA PILOT',
    completed: 'COMPLETED',
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
      {#each project.metrics as metric (metric.label)}
        <div class="metric">
          <span class="metric-value">{metric.value}</span>
          <span class="metric-label">{metric.label}</span>
        </div>
      {/each}
    </div>
  {/if}

  <div class="card-stack">
    {#each project.stack as tech (tech)}
      <span class="stack-tag">{tech}</span>
    {/each}
  </div>

  {#if project.link}
    <a class="card-link" href={project.link.href}>
      {project.link.label}
      <span aria-hidden="true">→</span>
    </a>
  {/if}
</div>

<style>
  /* Type hierarchy on this card, loudest first:
     1. classification — category badge: mono, uppercase, widest tracking
     2. measurement    — status badge, metric value + label: mono, no prose
     3. description    — title, body, stack tags: sans, sentence case
     Mono is reserved for measured values and identifiers so it still reads as
     emphasis; anything descriptive stays in sans. */

  .builder-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base),
      transform var(--duration-base),
      box-shadow var(--duration-base);
  }

  /* --shadow-lg is redefined under .dark, so one rule covers both themes. */
  .builder-card:hover {
    border-color: var(--accent-primary-20);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .card-link {
    font-size: var(--type-xs);
    font-family: var(--font-mono);
    color: var(--accent-primary-text);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: var(--space-2xs);
    transition: gap var(--duration-base);
  }

  .card-link:hover {
    gap: 0.625rem;
    text-decoration: underline;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  /* Classification — the loudest label on the card. */
  .category-badge {
    font-size: var(--type-2xs);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
    border: 1px solid;
    font-weight: var(--weight-semibold);
  }

  /* Each takes the readable-on-surface accent, which app.css flips under .dark;
     the -10/-20 alpha washes stay hue-matched to the un-flipped brand colour. */
  .category-professional {
    color: var(--accent-professional);
    border-color: var(--accent-primary-20);
    background: var(--accent-primary-10);
  }

  .category-independent {
    color: var(--accent-independent);
    border-color: var(--accent-independent-20);
    background: var(--accent-independent-10);
  }

  .category-experiment {
    color: var(--accent-experiment);
    border-color: var(--accent-infra-20);
    background: var(--accent-infra-10);
  }

  /* Measurement — reads as state, not prose, so it stays mono. */
  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: var(--type-2xs);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color var(--duration-base);
  }

  .status-dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot-shipped,
  .dot-completed {
    background: var(--status-success);
  }

  .dot-in-progress,
  .dot-active {
    background: var(--accent-primary-light);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .dot-exploring,
  .dot-beta-pilot {
    background: var(--status-warning);
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
    font-size: var(--type-base);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
    line-height: var(--leading-snug);
    transition: color var(--duration-base);
  }

  /* The measure cap only bites on the full-width lead card in the systems
     grid; a two-up card is never wide enough to reach it. */
  .card-description {
    font-size: var(--type-sm);
    color: var(--text-secondary);
    line-height: var(--leading-normal);
    max-width: 68ch;
    flex: 1;
    transition: color var(--duration-base);
  }

  .card-metrics {
    display: flex;
    gap: var(--space-lg);
    padding: var(--space-sm) 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    transition: border-color var(--duration-base);
  }

  .metric {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  /* Measurement — mono earns its place on values and their labels. */
  .metric-value {
    font-size: var(--type-sm);
    font-weight: var(--weight-bold);
    font-family: var(--font-mono);
    color: var(--text-primary);
    transition: color var(--duration-base);
  }

  .metric-label {
    font-size: var(--type-2xs);
    font-family: var(--font-mono);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color var(--duration-base);
  }

  .card-stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: auto;
  }

  /* Description — these are prose keywords, not system output, so they drop
     out of mono-uppercase and render sentence case in sans as authored. */
  .stack-tag {
    font-size: var(--type-xs);
    font-family: var(--font-sans);
    letter-spacing: var(--tracking-normal);
    color: var(--text-muted);
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xs);
    padding: var(--space-2xs) var(--space-xs);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base),
      color var(--duration-base);
  }
</style>
