<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const card = $derived(data.card);
</script>

<svelte:head>
  <title>OG card — {card.slug}</title>
  <!-- Render targets for the screenshot script, not pages for readers. -->
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div id="main" class="og-card" class:is-note={card.kind !== 'profile'}>
  <div class="grid-bg"></div>
  <div class="glow"></div>

  <div class="content">
    <p class="eyebrow"><span class="dot"></span>{card.eyebrow}</p>
    <h1 class="title" class:title-note={card.kind === 'note'}>{card.title}</h1>
    {#if card.subtitle}
      <p class="subtitle">{card.subtitle}</p>
    {/if}
    <p class="footnote">
      {#each card.footnote as entry, i (entry)}
        {#if i > 0}<span class="sep">·</span>{/if}{entry}
      {/each}
    </p>
  </div>

  <div class="rule"></div>
  <p class="domain">zhaoyu.io</p>
</div>

<style>
  /* Fixed 1200x630 so the screenshot needs no scaling. Colours are hard-coded
     rather than themed: an OG card has no viewer theme to respond to. */
  /* Pin the page box to the card exactly. The root layout sets min-height on
     html/body for the real site; left alone here it lets the document scroll,
     and the screenshot clips the card's bottom strip. */
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 1200px;
    height: 630px;
    min-height: 0;
    overflow: hidden;
    background: #0a0e14;
  }

  .og-card {
    position: relative;
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #0a0e14;
    color: #f5f7fa;
    font-family: 'Inter', 'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 88px;
    box-sizing: border-box;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(128, 128, 128, 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(128, 128, 128, 0.07) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .glow {
    position: absolute;
    top: -140px;
    left: -100px;
    width: 620px;
    height: 620px;
    background: rgba(59, 130, 246, 0.16);
    filter: blur(120px);
    border-radius: 50%;
  }

  .content {
    position: relative;
    z-index: 1;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0 0 28px;
    font-family: 'Liberation Mono', 'DejaVu Sans Mono', monospace;
    font-size: 21px;
    letter-spacing: 0.2em;
    color: #4a8fe7;
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #4a8fe7;
    flex-shrink: 0;
  }

  .title {
    margin: 0;
    font-size: 104px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* Note titles are sentences, not a two-word name — they need to wrap. */
  .title-note {
    font-size: 54px;
    line-height: 1.16;
    letter-spacing: -0.015em;
    max-width: 15.5em;
  }

  .subtitle {
    margin: 26px 0 0;
    font-size: 40px;
    font-weight: 700;
    line-height: 1.2;
    color: #5b9bf0;
    letter-spacing: -0.01em;
  }

  .footnote {
    margin: 34px 0 0;
    font-family: 'Liberation Mono', 'DejaVu Sans Mono', monospace;
    font-size: 19px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8a94a6;
  }

  .sep {
    margin: 0 14px;
    color: #4b5563;
  }

  .rule {
    position: absolute;
    left: 88px;
    right: 88px;
    bottom: 118px;
    height: 1px;
    background: rgba(255, 255, 255, 0.09);
  }

  .domain {
    position: absolute;
    right: 88px;
    bottom: 60px;
    margin: 0;
    font-family: 'Liberation Mono', 'DejaVu Sans Mono', monospace;
    font-size: 25px;
    letter-spacing: 0.1em;
    color: #b6bfcc;
  }
</style>
