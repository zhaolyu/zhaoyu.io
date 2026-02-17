<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="standalone-nav">
  <div class="inner">
    <a href="/" class="back-link">
      <svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="brand">zhaoyu.io</span>
    </a>

    <ThemeToggle />
  </div>
</header>

<style>
  .standalone-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    padding: 16px 0;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .inner {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #8888a0;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #e8e8ec;
  }

  .arrow {
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  .back-link:hover .arrow {
    transform: translateX(-3px);
  }

  .brand {
    font-family: 'JetBrains Mono', 'Geist Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
</style>
