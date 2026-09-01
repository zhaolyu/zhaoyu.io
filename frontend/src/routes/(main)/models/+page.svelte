<script lang="ts">
  import { MENTAL_MODELS } from '$lib/constants/models';
  import { ModelCard } from '$lib/components/features/models';
  import { PERSON, SITE_URL, SITE_CARD_IMAGE, jsonLdScript } from '$lib/constants/structured-data';

  const canonicalUrl = `${SITE_URL}/models`;
  const pageTitle = 'Mental Models · Zhao Yu';
  const description =
    'Decision rules that hold in more than one domain, each with the mechanism that makes it work, a receipt from engineering and a receipt from outside it, and a named source.';

  // ItemList rather than Article: this is a registry, and an agent reading it
  // should get the rules as discrete items, not as one blob of prose.
  const listScript = jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mental models',
    description,
    url: canonicalUrl,
    author: PERSON,
    numberOfItems: MENTAL_MODELS.length,
    itemListElement: MENTAL_MODELS.map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: model.rule,
      description: model.mechanism,
      url: `${canonicalUrl}#${model.id}`,
    })),
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={SITE_CARD_IMAGE} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={pageTitle} />
  <meta property="twitter:description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD, not user input -->
  {@html listScript}
</svelte:head>

<main id="main" class="models-page">
  <a href="/" class="back-link">&larr; zhaoyu.io</a>
  <h1>Mental Models</h1>
  <p class="page-description">
    A heuristic pays off in one domain. A model pays off in two, and the second one is the test: if
    a rule only ever works in engineering, it is a technique and it belongs with the code standards.
    Each entry below carries the mechanism that makes it hold, receipts from at least two domains
    that share no vocabulary, and the source it came from. Several of these are relayed rather than
    mine, and those say so, because a borrowed model presented as a personal standard is an
    unsourced claim.
  </p>

  <ul class="models-list">
    {#each MENTAL_MODELS as model (model.id)}
      <li><ModelCard {model} /></li>
    {/each}
  </ul>
</main>

<style>
  .models-page {
    max-width: 52rem;
    min-width: 0;
    margin: 0 auto;
    /* Matches /blog: heavier above the title than below the last card, and
       both steps lighter on mobile. This was inverted (96 top / 128 bottom),
       which sat the page 32px higher than its sibling and left twice the dead
       space at the end of a phone scroll. */
    padding: var(--space-5xl) var(--section-x) var(--space-4xl);
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .back-link {
    display: inline-block;
    margin-bottom: var(--space-xl);
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    color: var(--text-secondary);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--accent-primary-text);
  }

  h1 {
    margin: 0 0 var(--space-md);
    font-size: var(--type-3xl);
    line-height: var(--leading-tight);
    font-weight: var(--weight-bold);
    text-wrap: balance;
  }

  .page-description {
    max-width: 62ch;
    margin: 0 0 var(--space-3xl);
    font-size: var(--type-md);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }

  .models-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .models-list > li {
    display: flex;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .models-page {
      padding: var(--space-4xl) var(--section-x) var(--space-3xl);
    }
  }
</style>
