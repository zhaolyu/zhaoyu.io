<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CaseStudy } from '$lib/constants/case-studies';
  import { notesData } from '$lib/constants/content';

  interface Props {
    study: CaseStudy;
    /** The study's architecture diagram (an inline SVG), rendered in the figure. */
    diagram?: Snippet;
  }

  let { study, diagram }: Props = $props();

  const related = $derived(
    study.relatedNotes
      .map((slug) => notesData.notes.find((n) => n.slug === slug))
      .filter((n) => n !== undefined),
  );

  /** Section order is the argument's order; titles are the reader's map. */
  const proseSections = $derived([
    { id: 'context', title: 'Context', paragraphs: study.sections.context },
    { id: 'constraints', title: 'Constraints', paragraphs: study.sections.constraints },
    { id: 'options', title: 'Options considered', paragraphs: study.sections.options },
    { id: 'decision', title: 'The decision', paragraphs: study.sections.decision },
  ]);

  const closingSections = $derived([
    { id: 'regrets', title: 'What went wrong', paragraphs: study.sections.regrets },
    { id: 'my-role', title: 'My role vs. the team’s', paragraphs: study.sections.myRoleVsTeam },
  ]);
</script>

<article class="case-study">
  <header class="cs-header">
    <p class="cs-eyebrow">Case study · {study.period}</p>
    <h1 class="cs-title">{study.title}</h1>
    <p class="cs-one-liner">{study.oneLiner}</p>
    <p class="cs-role">{study.role}</p>
  </header>

  {#each proseSections as section (section.id)}
    <section class="cs-section" aria-labelledby="cs-{section.id}">
      <h2 class="cs-section-title" id="cs-{section.id}">{section.title}</h2>
      {#each section.paragraphs as paragraph (paragraph)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- self-authored study content from case-studies.ts, not user input -->
        {@html `<p class="cs-paragraph">${paragraph}</p>`}
      {/each}
    </section>
  {/each}

  <section class="cs-section" aria-labelledby="cs-architecture">
    <h2 class="cs-section-title" id="cs-architecture">Architecture</h2>
    <figure class="cs-figure">
      <div class="cs-diagram" data-diagram={study.sections.architecture.diagram}>
        {#if diagram}{@render diagram()}{/if}
      </div>
      <figcaption class="cs-caption">{study.sections.architecture.caption}</figcaption>
    </figure>
  </section>

  <section class="cs-section" aria-labelledby="cs-outcome">
    <h2 class="cs-section-title" id="cs-outcome">Measured outcome</h2>
    <dl class="cs-outcomes">
      {#each study.sections.outcome as item (item.metric)}
        <div class="cs-outcome">
          <dt class="cs-outcome-metric">{item.metric}</dt>
          <dd class="cs-outcome-value">{item.value}</dd>
          <dd class="cs-outcome-basis">
            {item.basis}{#if item.source}.
              <a href={item.source.href} target="_blank" rel="noopener">{item.source.label}</a>
            {/if}
          </dd>
        </div>
      {/each}
    </dl>
  </section>

  {#each closingSections as section (section.id)}
    <section class="cs-section" aria-labelledby="cs-{section.id}">
      <h2 class="cs-section-title" id="cs-{section.id}">{section.title}</h2>
      {#each section.paragraphs as paragraph (paragraph)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- self-authored study content from case-studies.ts, not user input -->
        {@html `<p class="cs-paragraph">${paragraph}</p>`}
      {/each}
    </section>
  {/each}

  <footer class="cs-footer">
    <h2 class="cs-section-title">Sources</h2>
    <ul class="cs-sources">
      {#each study.sources as source (source.href)}
        <li><a href={source.href} target="_blank" rel="noopener">{source.label}</a></li>
      {/each}
    </ul>

    {#if related.length > 0}
      <h2 class="cs-section-title">Related notes</h2>
      <ul class="cs-sources">
        {#each related as note (note.slug)}
          <li><a href="/blog/{note.slug}">{note.title}</a></li>
        {/each}
      </ul>
    {/if}

    <div class="cs-stack">
      {#each study.stack as tech (tech)}
        <span class="cs-stack-tag">{tech}</span>
      {/each}
    </div>
  </footer>
</article>

<style>
  .case-study {
    max-width: 48rem;
    margin: 0 auto;
    color: var(--text-primary);
  }

  .cs-header {
    margin-bottom: var(--space-2xl);
  }

  .cs-eyebrow {
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--accent-primary-text);
    margin-bottom: var(--space-sm);
  }

  .cs-title {
    font-size: var(--type-3xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-md);
  }

  .cs-one-liner {
    font-size: var(--type-lg);
    line-height: var(--leading-normal);
    color: var(--text-secondary);
    margin-bottom: var(--space-sm);
  }

  .cs-role {
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    color: var(--text-muted);
  }

  .cs-section {
    margin-bottom: var(--space-2xl);
  }

  .cs-section-title {
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    font-weight: var(--weight-bold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--accent-primary-text);
    margin-bottom: var(--space-md);
  }

  .case-study :global(.cs-paragraph) {
    font-size: var(--type-base);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    margin-bottom: var(--space-md);
  }

  .case-study :global(.cs-paragraph a) {
    color: var(--accent-primary-text);
    text-decoration: underline;
    text-decoration-color: var(--accent-primary-30);
    text-underline-offset: 2px;
  }

  .case-study :global(.cs-paragraph a:hover) {
    text-decoration-color: currentColor;
  }

  .cs-figure {
    margin: 0;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    padding: var(--space-lg);
  }

  .cs-caption {
    margin-top: var(--space-md);
    font-size: var(--type-sm);
    line-height: var(--leading-normal);
    color: var(--text-muted);
  }

  .cs-outcomes {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
    margin: 0;
  }

  @media (min-width: 768px) {
    .cs-outcomes {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .cs-outcome {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    padding: var(--space-md);
  }

  .cs-outcome dd {
    margin: 0;
  }

  .cs-outcome-metric {
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--text-muted);
  }

  .cs-outcome-value {
    font-family: var(--font-mono);
    font-size: var(--type-xl);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
    margin-top: var(--space-2xs);
  }

  .cs-outcome-basis {
    margin-top: var(--space-xs);
    font-size: var(--type-xs);
    line-height: var(--leading-snug);
    color: var(--text-secondary);
  }

  .cs-outcome-basis a {
    color: var(--accent-primary-text);
    text-decoration: none;
  }

  .cs-outcome-basis a:hover,
  .cs-outcome-basis a:focus-visible {
    text-decoration: underline;
  }

  .cs-footer {
    border-top: 1px solid var(--border-color);
    padding-top: var(--space-xl);
  }

  .cs-sources {
    list-style: none;
    margin: 0 0 var(--space-lg);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .cs-sources a {
    font-size: var(--type-sm);
    color: var(--accent-primary-text);
    text-decoration: underline;
    text-decoration-color: var(--accent-primary-30);
    text-underline-offset: 2px;
  }

  .cs-sources a:hover {
    text-decoration-color: currentColor;
  }

  .cs-stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .cs-stack-tag {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--text-muted);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    padding: var(--space-2xs) var(--space-sm);
  }
</style>
