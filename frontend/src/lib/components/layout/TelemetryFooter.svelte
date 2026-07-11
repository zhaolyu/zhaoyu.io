<script lang="ts">
  import { footerManifesto } from '$lib/constants/content';
</script>

<footer class="terminal-footer">
  <div class="footer-container">
    <div class="manifesto-grid">
      {#each footerManifesto as item (item.title)}
        <div class="manifesto-item">
          <h4>{item.title}</h4>
          <p>{item.body}</p>
        </div>
      {/each}
    </div>

    <div class="status-bar">
      <div class="status-group">
        <div class="status-item">
          <span class="s-label">ENGINEERING</span>
          <span class="s-value">Sr. Manager, Core Web @ CNBC</span>
        </div>
        <div class="status-item">
          <span class="s-label">SCALE</span>
          <span class="s-value">50M+ Monthly Uniques</span>
        </div>
      </div>
      <div class="status-group">
        <div class="status-item">
          <span class="s-label">MARATHON_PR</span>
          <span class="s-value">3:07:45</span>
        </div>
        <div class="status-item">
          <span class="s-label">HALF_PR</span>
          <span class="s-value">1:31:49</span>
        </div>
        <div class="status-item">
          <span class="s-label">NEXT_TARGET</span>
          <span class="s-value accent">Sub-1:25 HM</span>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="social-links">
        <a href="https://linkedin.com/in/zhaolyu" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/zhaolyu" target="_blank" rel="noopener">GitHub</a>
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
    background: #050505;
    border-top: 1px solid #1a1a1a;
    font-family: 'JetBrains Mono', 'IBM Plex Mono', var(--font-mono), monospace;
    color: #888;
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

  .manifesto-item h4 {
    font-size: 0.6875rem;
    color: #0077d5;
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
    font-weight: 800;
    text-shadow: 0 0 10px rgba(0, 119, 213, 0.3);
    text-transform: uppercase;
  }

  .manifesto-item p {
    font-size: 0.8125rem;
    line-height: 1.7;
    color: #aaa;
  }

  /* ── Status bar ── */

  .status-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 1.875rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2px;
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
    font-size: 0.5625rem;
    color: #444;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .s-value {
    font-size: 0.6875rem;
    color: #e0e0e0;
    font-weight: 500;
  }

  .s-value.accent {
    color: #0077d5;
  }

  /* ── Bottom bar ── */

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.03);
    padding-top: 2.5rem;
  }

  .social-links {
    display: flex;
    gap: 1.5rem;
  }

  .social-links a {
    font-size: 0.75rem;
    color: #666;
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
  }

  .social-links a:hover {
    color: #0077d5;
  }

  .copyright {
    font-size: 0.6875rem;
    color: #444;
  }

  .copyright span {
    opacity: 0.5;
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
