<script lang="ts">
  import { DESIGN_SYSTEM_CARDS } from '$lib/constants/design-system';

  const groups = ['Foundations', 'Components'] as const;
</script>

<svelte:head>
  <title>Design system — zhaoyu.io</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main id="main" class="ds-index">
  <header>
    <p class="eyebrow">Design system</p>
    <h1>The tokens and components this site is built from.</h1>
    <p class="lede">
      Every card below renders the real component against the real tokens — nothing here is a
      mockup, so a card cannot advertise something the site no longer ships. Run
      <code>pnpm design-system</code> to write these pages into
      <code>design-system/</code> as the hand-off bundle for Claude Design.
    </p>
  </header>

  {#each groups as group (group)}
    <section>
      <h2>{group}</h2>
      <ul>
        {#each DESIGN_SYSTEM_CARDS.filter((c) => c.group === group) as card (card.slug)}
          <li>
            <a href="/design-system/{card.slug}">
              <span class="card-name">{card.name}</span>
              <span class="card-subtitle">{card.subtitle}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</main>

<style>
  .ds-index {
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    padding: var(--space-4xl) var(--space-lg);
    max-width: 60rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    font-family: var(--font-sans);
  }

  .eyebrow {
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--accent-primary-text);
    margin: 0 0 var(--space-sm);
  }

  h1 {
    font-size: var(--type-2xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
    margin: 0 0 var(--space-md);
    max-width: 24ch;
  }

  .lede {
    font-size: var(--type-md);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    font-weight: var(--weight-light);
    max-width: 60ch;
    margin: 0;
  }

  code {
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    background: var(--bg-secondary);
    border-radius: var(--radius-xs);
    padding: 0.1rem 0.35rem;
  }

  h2 {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 var(--space-md);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(17rem, 100%), 1fr));
    gap: var(--space-sm);
  }

  a {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    padding: var(--space-md);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    text-decoration: none;
    color: inherit;
    transition:
      border-color var(--duration-base),
      box-shadow var(--duration-base);
  }

  a:hover {
    border-color: var(--accent-primary-20);
    box-shadow: var(--shadow-md);
  }

  .card-name {
    font-size: var(--type-base);
    font-weight: var(--weight-bold);
  }

  .card-subtitle {
    font-size: var(--type-xs);
    color: var(--text-muted);
    line-height: var(--leading-normal);
  }
</style>
