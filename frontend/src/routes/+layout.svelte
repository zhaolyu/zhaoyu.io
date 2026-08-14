<script lang="ts">
  import '../app.css';
  import '../app.print.css';
</script>

<svelte:head>
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Zhao Yu — Engineering Notes"
    href="https://zhaoyu.io/rss.xml"
  />
</svelte:head>

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
</style>
