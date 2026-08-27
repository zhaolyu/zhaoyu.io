<script lang="ts">
  import '../app.css';
  import '../app.print.css';
  // Preload the one face that renders above the fold. Importing it with ?url
  // gives Vite's hashed, fingerprinted path, so the preload can never point at
  // a stale file the way a hardcoded href in app.html would.
  import geistSans400 from '@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2?url';
  import { AUTHOR_NAME } from '$lib/constants/structured-data';
</script>

<svelte:head>
  <!-- Identity every page shares. Crawlers that build link cards read these
       from Open Graph rather than the JSON-LD, so they live here once. -->
  <meta name="author" content={AUTHOR_NAME} />
  <meta property="og:site_name" content={AUTHOR_NAME} />
  <meta property="og:locale" content="en_US" />

  <link rel="preload" as="font" type="font/woff2" href={geistSans400} crossorigin="anonymous" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Zhao Yu — Engineering Notes"
    href="https://zhaoyu.io/rss.xml"
  />
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>

<slot />

<style>
  :global(html),
  :global(body) {
    margin: 0;
    width: 100%;
    min-height: 100%;
  }

  :global(body) {
    font-family: var(--font-sans);
  }

  /* Bypass-blocks (WCAG 2.4.1): visible only while focused. */
  .skip-link {
    position: absolute;
    top: var(--space-sm);
    left: var(--space-sm);
    z-index: 100;
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius-md);
    background: var(--accent-primary);
    color: var(--bg-primary);
    font-family: var(--font-mono);
    font-size: var(--type-sm);
    text-decoration: none;
    transform: translateY(-200%);
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .skip-link:focus-visible {
    transform: none;
    outline: 2px solid var(--text-primary);
    outline-offset: 2px;
  }
</style>
