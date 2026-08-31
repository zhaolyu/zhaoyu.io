<script lang="ts">
  import { onMount } from 'svelte';
  import { performanceMetrics } from '$lib/constants/content';
  import { observeSection } from '$lib/utils/section-observer';

  let sectionVisible = $state(false);
  let skillsContainer: HTMLElement;

  onMount(() => {
    return observeSection(skillsContainer, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.1,
    });
  });
</script>

<section id="impact" class="skills" bind:this={skillsContainer}>
  <div class="skills-container">
    <!-- Always rendered so the content prerenders; the reveal is animation-only. -->
    <div class="skills-content reveal" class:revealed={sectionVisible}>
      <div class="skills-text">
        <div class="skills-badge">
          <span class="badge-dot"></span>
          <p class="badge-text">Receipts</p>
        </div>
        <h2 class="skills-headline">
          The numbers,<br />
          <span class="highlight-blue">with receipts.</span>
        </h2>
        <p class="skills-description">
          Every figure here is public and linked to its source: Versant's investor materials, Chrome
          UX Report field data, or the record of the role. Nothing that isn't
          <span class="highlight-text">publicly disclosed</span> is stated.
        </p>
      </div>

      <dl class="metrics-grid">
        {#each performanceMetrics as metric (metric.label)}
          <div class="metric-card">
            <dt class="metric-label">{metric.label}</dt>
            <dd class="metric-value">{metric.value}</dd>
            <dd class="metric-sublabel">{metric.sublabel}</dd>
            <dd class="metric-basis">
              {metric.basis}.
              <a class="metric-source" href={metric.source.href} target="_blank" rel="noopener">
                Source: {metric.source.label}
              </a>
            </dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</section>

<style>
  .skills {
    width: 100%;
    padding: 6rem 2rem;
    background: var(--bg-primary);
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--border-color);
    scroll-margin-top: 4rem;
  }

  .skills-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .skills-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3rem;
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

    .reveal.revealed {
      opacity: 1;
      transform: none;
    }
  }

  .skills-text {
    max-width: 32rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .skills-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .badge-dot {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--accent-primary);
    border-radius: 9999px;
    box-shadow: 0 0 10px var(--accent-primary);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .badge-text {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent-primary-text);
  }

  .skills-headline {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .highlight-blue {
    color: var(--accent-primary-text);
  }

  .highlight-text {
    color: var(--text-primary);
    font-weight: 600;
  }

  .skills-description {
    font-size: 1.125rem;
    line-height: 1.75;
    color: var(--text-secondary);
    font-weight: 300;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
  }

  .metric-card {
    margin: 0;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition:
      border-color 0.3s,
      background-color 0.3s,
      transform 0.3s;
  }

  .metric-card:hover {
    border-color: var(--text-muted);
    background: var(--bg-primary);
    transform: translateY(-2px);
  }

  .metric-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--text-primary);
    font-family: var(--font-mono);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .metric-label {
    font-size: 0.7rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-top: 0.5rem;
  }

  .metric-sublabel {
    font-size: 0.7rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-primary-text);
    opacity: 0.7;
  }

  .metric-card dd {
    margin: 0;
  }

  .metric-basis {
    margin-top: var(--space-sm) !important;
    font-size: var(--type-xs);
    line-height: var(--leading-snug);
    color: var(--text-secondary);
  }

  .metric-source {
    display: block;
    margin-top: var(--space-2xs);
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .metric-source:hover,
  .metric-source:focus-visible {
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    .metric-value {
      font-size: var(--type-2xl);
    }
  }

  /* The row layout needs about 881px of content box — a 512px text column that
     does not shrink, a 6rem gap, and 273px of metrics. At 768px only 704px is
     available, so the metrics used to run 145px past the viewport and give the
     whole document a horizontal scrollbar. Stay stacked until there is room.
     (The 768px `grid-template-columns: repeat(2, 1fr)` that used to live here
     was identical to the base rule and did nothing.) */
  @media (min-width: 1024px) {
    .skills-content {
      flex-direction: row;
      align-items: center;
      gap: var(--space-4xl);
    }

    .skills-text {
      flex-shrink: 0;
    }
  }

  @media (max-width: 767px) {
    .skills {
      padding: var(--section-y-mobile) var(--section-x);
    }
  }
</style>
