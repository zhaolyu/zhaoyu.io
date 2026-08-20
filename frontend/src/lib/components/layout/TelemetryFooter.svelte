<script lang="ts">
  import { footerManifesto } from '$lib/constants/content';
  import { performanceMetrics } from '$lib/constants/content';

  /** The one figure the footer repeats is the public audience number, sourced. */
  const audience = performanceMetrics.find((m) => m.value === '47M');
</script>

<footer class="terminal-footer">
  <div class="footer-container">
    <div class="manifesto-grid">
      {#each footerManifesto as item (item.title)}
        <div class="manifesto-item">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      {/each}
    </div>

    <div class="status-bar">
      <div class="status-group">
        <div class="status-item">
          <span class="s-label">ENGINEERING</span>
          <span class="s-value">Sr. Manager, Engineering @ Versant</span>
        </div>
        {#if audience}
          <div class="status-item">
            <span class="s-label">SCALE</span>
            <span class="s-value">
              <a class="s-link" href={audience.source.href} target="_blank" rel="noopener">
                {audience.value} monthly uniques · ComScore
              </a>
            </span>
          </div>
        {/if}
      </div>
      <div class="status-group">
        <div class="status-item">
          <span class="s-label">OFF_CLOCK</span>
          <span class="s-value accent">Marathon 3:07 · 50K finisher</span>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="social-links">
        <a href="https://linkedin.com/in/zhaolyu" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/zhaolyu" target="_blank" rel="noopener">GitHub</a>
        <a href="/rss.xml">RSS</a>
      </div>
      <p class="copyright">
        © {new Date().getFullYear()} Zhao Yu —
        <span>Hand-coded with Svelte. Deployed to Cloudflare Edge.</span>
      </p>
    </div>
  </div>
</footer>

<style>
  .terminal-footer {
    width: 100%;
    padding: 5rem 1.25rem 2.5rem;
    background: var(--bg-inverse);
    border-top: 1px solid var(--border-on-inverse);
    font-family: var(--font-mono);
    color: var(--text-on-inverse-muted);
  }

  .footer-container {
    max-width: 72rem;
    margin: 0 auto;
  }

  /* ── Manifesto grid ── */

  .manifesto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2.5rem;
    margin-bottom: 5rem;
  }

  .manifesto-item h3 {
    font-size: var(--type-xs);
    color: var(--accent-on-inverse);
    letter-spacing: var(--tracking-widest);
    margin-bottom: 0.75rem;
    font-weight: var(--weight-bold);
    text-transform: uppercase;
  }

  .manifesto-item p {
    font-size: var(--type-sm);
    line-height: var(--leading-relaxed);
    color: var(--text-on-inverse-muted);
  }

  /* ── Status bar ── */

  .status-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 1.875rem;
    background: var(--surface-on-inverse);
    border: 1px solid var(--border-on-inverse);
    border-radius: var(--radius-sm);
    margin-bottom: 3.75rem;
  }

  .status-group {
    display: flex;
    gap: 2.5rem;
    flex-wrap: wrap;
  }

  .status-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .s-label {
    font-size: var(--type-2xs);
    color: var(--text-on-inverse-muted);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
  }

  .s-value {
    font-size: var(--type-xs);
    color: var(--text-on-inverse);
    font-weight: var(--weight-medium);
  }

  .s-value.accent,
  .s-link {
    color: var(--accent-on-inverse);
  }

  .s-link {
    text-decoration: none;
  }

  .s-link:hover,
  .s-link:focus-visible {
    text-decoration: underline;
  }

  /* ── Bottom bar ── */

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.25rem;
    border-top: 1px solid var(--border-on-inverse);
    padding-top: 2.5rem;
  }

  .social-links {
    display: flex;
    gap: 1.5rem;
  }

  .social-links a {
    font-size: var(--type-xs);
    color: var(--text-on-inverse-muted);
    text-decoration: none;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    transition: color var(--duration-base);
  }

  .social-links a:hover,
  .social-links a:focus-visible {
    color: var(--accent-on-inverse);
  }

  .copyright {
    font-size: var(--type-xs);
    color: var(--text-on-inverse-muted);
  }

  @media (max-width: 767px) {
    .status-bar {
      flex-direction: column;
      align-items: flex-start;
    }

    .status-group {
      gap: 1.25rem;
    }

    .bottom-bar {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
