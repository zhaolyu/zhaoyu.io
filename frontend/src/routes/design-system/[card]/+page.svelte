<script lang="ts">
  import TokenGrid from '$lib/components/design-system/TokenGrid.svelte';
  import BuilderCard from '$lib/components/features/builder/BuilderCard.svelte';
  import { NoteExcerptCard } from '$lib/components/features/notes';
  import { SectionHeader } from '$lib/components/ui';
  import { tokenGroups } from '$lib/constants/design-tokens';
  import { builderProjects, notesData, type BuilderProject } from '$lib/constants/content';

  let { data } = $props();

  const group = $derived(tokenGroups.find((g) => g.id === data.card.slug));

  /**
   * Component previews use real site content so a card can never show a
   * component styled for data the site doesn't actually have. The status matrix
   * is synthesised from one real card, since no single page shows all six.
   */
  const leadProject = builderProjects[0];
  const STATUSES: BuilderProject['status'][] = [
    'active',
    'beta-pilot',
    'completed',
    'shipped',
    'in-progress',
    'exploring',
  ];

  const statusMatrix: BuilderProject[] = STATUSES.map((status) => ({
    ...leadProject,
    title: `Status: ${status}`,
    description: leadProject.description.slice(0, 120) + '…',
    status,
    link: undefined,
  }));

  const categoryMatrix: BuilderProject[] = (
    ['professional', 'independent', 'experiment'] as const
  ).map((category) => {
    const real = builderProjects.find((p) => p.category === category);
    return { ...(real ?? leadProject), category };
  });
</script>

<svelte:head>
  <title>{data.card.name} — zhaoyu.io design system</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="ds-card">
  <header class="ds-head">
    <p class="ds-group">{data.card.group}</p>
    <h1>{data.card.name}</h1>
    <p class="ds-subtitle">{data.card.subtitle}</p>
    {#if group}
      <p class="ds-description">{group.description}</p>
    {/if}
  </header>

  {#if group}
    <div class="ds-themes">
      <TokenGrid {group} />
      <TokenGrid {group} dark />
    </div>
  {:else if data.card.slug === 'system-card'}
    <section class="ds-section">
      <h2>Categories</h2>
      <div class="ds-grid">
        {#each categoryMatrix as project (project.category)}
          <BuilderCard {project} />
        {/each}
      </div>
    </section>
    <section class="ds-section">
      <h2>Statuses</h2>
      <div class="ds-grid">
        {#each statusMatrix as project (project.status)}
          <BuilderCard {project} />
        {/each}
      </div>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <div class="ds-grid">
        {#each categoryMatrix as project (project.category)}
          <BuilderCard {project} />
        {/each}
      </div>
    </section>
  {:else if data.card.slug === 'note-card'}
    <section class="ds-section">
      <h2>Light</h2>
      <div class="ds-grid">
        {#each notesData.notes.slice(0, 3) as note (note.slug)}
          <NoteExcerptCard {note} />
        {/each}
      </div>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <div class="ds-grid">
        {#each notesData.notes.slice(0, 3) as note (note.slug)}
          <NoteExcerptCard {note} />
        {/each}
      </div>
    </section>
  {:else if data.card.slug === 'section-header'}
    <section class="ds-section">
      <h2>Light</h2>
      <SectionHeader badge="Selected Work & Systems">
        Systems I've architected,<br />
        <span class="headline-accent">from CNBC to architectural sandboxes.</span>
      </SectionHeader>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <SectionHeader badge="Digital Garden" headline="Engineering Notes." accentText="" />
    </section>
  {/if}
</main>

<style>
  .ds-card {
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: var(--space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    min-height: 100vh;
    font-family: var(--font-sans);
  }

  .ds-head {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--space-md);
  }

  .ds-group {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--accent-primary-text);
    margin: 0;
  }

  h1 {
    font-size: var(--type-xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-snug);
    margin: 0;
  }

  h2 {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0;
  }

  .ds-subtitle {
    font-size: var(--type-sm);
    color: var(--text-secondary);
    margin: 0;
  }

  .ds-description {
    font-size: var(--type-sm);
    color: var(--text-muted);
    max-width: 68ch;
    margin: 0;
    line-height: var(--leading-normal);
  }

  .ds-themes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    align-items: start;
  }

  .ds-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  /* `.dark` only redefines tokens, so scoping it to a container renders the
     dark theme inline — no second page, no screenshot pair to keep in sync. */
  .ds-dark-scope {
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
  }

  .ds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
    gap: var(--space-lg);
  }

  @media (max-width: 900px) {
    .ds-themes {
      grid-template-columns: 1fr;
    }
  }
</style>
