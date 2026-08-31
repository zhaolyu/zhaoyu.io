<script lang="ts">
  import { browser } from '$app/environment';

  let copied = $state(false);
  const email = 'zhaolyu@gmail.com';
  const linkedinUrl = 'https://linkedin.com/in/zhaolyu';
  const githubUrl = 'https://github.com/zhaolyu';

  async function copyEmail() {
    if (!browser) return;

    try {
      await navigator.clipboard.writeText(email);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Clipboard API unavailable (older browsers / non-secure context) —
      // the address is select-all text, so manual copy still works.
    }
  }
</script>

<section id="connect" class="connect-section">
  <div class="connect-container">
    <div class="connect-header">
      <div class="header-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          ></path>
        </svg>
      </div>
      <h2 class="section-title">Let's Build Something.</h2>
      <p class="section-subtitle">
        I work where agent-era engineering meets a high-scale news platform: verification, interface
        performance, and the discipline that keeps machine work trustworthy. If you have strong
        opinions on any of the above, reach out.
      </p>

      <div class="status-block">
        <div class="status-row">
          <span class="status-key">Currently:</span>
          <span class="status-value">Senior Manager, Engineering at Versant (CNBC Core).</span>
        </div>
        <div class="status-row">
          <span class="status-key">Thinking about:</span>
          <span class="status-value"
            >Fail-open checks, agent verification loops, and sub-1:25 half-marathon splits.</span
          >
        </div>
      </div>
    </div>

    <div class="terminal-window">
      <div class="terminal-header">
        <div class="window-controls">
          <div class="control-dot control-red"></div>
          <div class="control-dot control-yellow"></div>
          <div class="control-dot control-green"></div>
        </div>
        <div class="terminal-title">zsh — 80x24</div>
      </div>

      <div class="terminal-content">
        <div class="flex gap-3 mb-6 flex-wrap">
          <span class="prompt flex-shrink-0">➜</span>
          <span class="command break-words min-w-0">./connect.sh --intent=build-together</span>
        </div>

        <div class="terminal-output">
          <div class="flex flex-row items-center justify-between gap-2 group">
            <div class="flex items-baseline gap-4 flex-1 min-w-0">
              <span class="output-label shrink-0 w-20">Email:</span>
              <span class="output-value select-all font-bold">{email}</span>
            </div>
            <button onclick={copyEmail} class="copy-button" class:copied>
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>

          <div class="flex flex-row items-center justify-between gap-2">
            <div class="flex items-baseline gap-4 flex-1 min-w-0">
              <span class="output-label shrink-0 w-20">LinkedIn:</span>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" class="output-link">
                /in/zhaolyu
              </a>
            </div>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" class="external-link">
              OPEN ↗
            </a>
          </div>

          <div class="flex flex-row items-center justify-between gap-2">
            <div class="flex items-baseline gap-4 flex-1 min-w-0">
              <span class="output-label shrink-0 w-20">GitHub:</span>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" class="output-link">
                /zhaolyu
              </a>
            </div>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" class="external-link">
              OPEN ↗
            </a>
          </div>
        </div>

        <div class="flex gap-3 animate-pulse mt-4">
          <span class="prompt">➜</span>
          <span class="cursor-blink"></span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .connect-section {
    padding: 6rem 1.5rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition:
      background-color 0.2s,
      color 0.2s,
      border-color 0.2s;
    scroll-margin-top: 5rem;
  }

  .connect-container {
    max-width: 64rem;
    margin: 0 auto;
    text-align: center;
  }

  .connect-header {
    margin-bottom: 2rem;
  }

  .header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--accent-primary-10);
    border: 1px solid var(--accent-primary-20);
    margin-bottom: 1rem;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--accent-primary-text);
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    transition: color 0.2s;
  }

  .section-subtitle {
    font-size: 1rem;
    color: var(--text-muted);
    transition: color 0.2s;
    margin-bottom: 1.5rem;
  }

  .status-block {
    display: inline-flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    background: var(--bg-secondary);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    margin-bottom: 2rem;
    text-align: left;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .status-row {
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .status-key {
    color: var(--accent-primary-text);
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: 0.03em;
  }

  .status-value {
    color: var(--text-secondary);
    transition: color 0.2s;
  }

  .terminal-window {
    max-width: 36rem;
    margin: 0 auto;
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  /* Light mode terminal styles */
  :global(html:not(.dark)) .terminal-window {
    background: var(--bg-secondary);
    border-color: rgba(0, 0, 0, 0.12);
  }

  :global(.dark) .terminal-window {
    background: #0d0d0d;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  /* Light mode terminal header */
  :global(html:not(.dark)) .terminal-header {
    background: #ffffff;
    border-bottom-color: rgba(0, 0, 0, 0.12);
  }

  :global(.dark) .terminal-header {
    background: rgba(0, 0, 0, 0.3);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .window-controls {
    display: flex;
    gap: 0.5rem;
  }

  .control-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: 1px solid;
  }

  .control-red {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }

  .control-yellow {
    background: rgba(234, 179, 8, 0.2);
    border-color: rgba(234, 179, 8, 0.5);
  }

  .control-green {
    background: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.5);
  }

  .terminal-title {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    transition: color 0.2s;
  }

  .terminal-content {
    padding: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.75;
    background: transparent;
    transition: background-color 0.2s;
  }

  /* Light mode terminal content */
  :global(html:not(.dark)) .terminal-content {
    background: #f8f9fa;
    color: var(--text-primary);
  }

  :global(.dark) .terminal-content {
    background: #0d0d0d;
    color: var(--text-primary);
  }

  .prompt {
    color: var(--accent-primary-text);
    flex-shrink: 0;
  }

  .command {
    color: var(--text-secondary);
    transition: color 0.2s;
    word-break: break-word;
    overflow-wrap: anywhere;
    flex: 1;
    min-width: 0;
  }

  .terminal-output {
    padding-left: 1rem;
    border-left: 2px solid var(--border-color);
    margin-left: 0.25rem;
    margin-bottom: 1rem;
    transition: border-color 0.2s;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Light mode terminal output border */
  :global(html:not(.dark)) .terminal-output {
    border-left-color: var(--accent-primary-20);
  }

  :global(.dark) .terminal-output {
    border-left-color: var(--accent-primary-20);
  }

  .output-label {
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .output-value {
    color: var(--text-primary);
    transition: color 0.2s;
  }

  .output-link {
    color: var(--accent-primary-text);
    text-decoration: none;
    transition: color 0.2s;
  }

  .output-link:hover {
    text-decoration: underline;
  }

  .copy-button {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .copy-button:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--accent-primary-20);
  }

  .copy-button.copied {
    background: var(--accent-primary-10);
    color: var(--accent-primary-text);
    border-color: var(--accent-primary-20);
  }

  .external-link {
    font-size: 0.625rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .external-link:hover {
    color: var(--text-primary);
  }

  .cursor-blink {
    width: 0.5rem;
    height: 1.25rem;
    background: var(--accent-primary-light);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    .connect-section {
      padding: 4rem 1rem;
    }

    .terminal-content {
      padding: 1rem;
    }
  }
</style>
