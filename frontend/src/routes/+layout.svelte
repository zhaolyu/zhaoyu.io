<script lang="ts">
  import '../app.css';
  import '../app.print.css';
</script>

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
