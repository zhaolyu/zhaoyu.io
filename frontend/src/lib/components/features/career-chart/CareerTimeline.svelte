<script lang="ts">
  import { careerHistory } from '$lib/constants/content';

  /**
   * The career as a list of roles, not a self-scored chart. Rendered inside
   * the About section; the host owns the section, header, and reveal state.
   */
  const history = careerHistory.points;
</script>

<ol class="career-points" aria-label="Career timeline">
  {#each history as point (point.year)}
    <li class="career-point">
      <div class="career-point-year">
        <span class="career-point-dot" aria-hidden="true"></span>
        {point.year}
      </div>
      <div class="career-point-role">{point.role}</div>
      <div class="career-point-company">{point.company}</div>
      {#if point.note}
        <p class="career-point-note">{point.note}</p>
      {/if}
    </li>
  {/each}
</ol>

<style>
  .career-points {
    display: grid;
    grid-template-columns: 1fr;
    align-items: start;
    gap: var(--space-md);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 768px) {
    .career-points {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
    }
  }

  .career-point {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    text-align: left;
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .career-point-year {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--type-sm);
    font-family: var(--font-mono);
    color: var(--accent-primary-text);
    font-weight: var(--weight-bold);
    margin-bottom: var(--space-2xs);
  }

  .career-point-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--radius-full);
    border: 2px solid var(--accent-primary);
    background: var(--bg-primary);
    flex: none;
    transition: background-color var(--duration-base);
  }

  .career-point-role {
    font-size: var(--type-base);
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
    margin-bottom: var(--space-2xs);
  }

  .career-point-company {
    font-size: var(--type-xs);
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .career-point-note {
    font-size: var(--type-sm);
    line-height: var(--leading-normal);
    color: var(--text-secondary);
    margin-top: var(--space-xs);
    transition: color var(--duration-base);
  }
</style>
