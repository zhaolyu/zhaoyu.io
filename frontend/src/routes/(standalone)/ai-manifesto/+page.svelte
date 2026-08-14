<script lang="ts">
  import { onMount } from 'svelte';
  import '@fontsource/dm-serif-display';
  import '@fontsource/jetbrains-mono/400.css';
  import '@fontsource/jetbrains-mono/600.css';
  import '@fontsource/source-sans-3/300.css';
  import '@fontsource/source-sans-3/400.css';
  import '@fontsource/source-sans-3/600.css';
  import '@fontsource/source-sans-3/700.css';

  const STORAGE_CHECKS = 'manifesto-checks';
  const STORAGE_STREAK = 'manifesto-streak';
  const STORAGE_DATE = 'manifesto-streak-date';
  const STORAGE_CHECK_DATE = 'manifesto-check-date';

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Factory Is Going Dark — a Working Thesis on AI-Augmented Engineering',
    author: { '@type': 'Person', name: 'Zhao Yu', url: 'https://zhaoyu.io' },
    url: 'https://zhaoyu.io/ai-manifesto',
    keywords: 'AI Engineering, Agent Architecture, Specification, Engineering Leadership',
  });
  // Tag assembled from split parts: a literal script open/close token anywhere
  // in this component (even in a string or comment) ends the surrounding block.
  const jsonLdScript = '<scr' + 'ipt type="application/ld+json">' + jsonLd + '</scr' + 'ipt>';

  const principles = [
    {
      num: '01',
      title: 'The Spec Is the Artifact',
      body: 'When agents can produce working code from any sufficiently precise description, the bottleneck moves upstream to the description. The specification becomes the primary engineering artifact; the codebase is a derivative — closer to a build output than to source.',
    },
    {
      num: '02',
      title: 'Fix the Loop, Not the Model',
      body: 'Agent failures are ambiguity failures of the loop, not intelligence failures of the agent. Smartness cannot supply a fact that was never specified. A real run has a goal, a boundary, tools, artifacts, and receipts — miss one and you made a wish, not a delegation.',
    },
    {
      num: '03',
      title: '"Done" Requires a Receipt',
      body: 'An agent declaring success is self-attestation by the party with the strongest incentive to call the job done. No diff, no test run, no artifact — no "done." The same review bar applies whether the author was a human or a machine.',
    },
    {
      num: '04',
      title: 'Deterministic Shells, Non-Deterministic Cores',
      body: 'Non-deterministic output demands a deterministic, accessible interface as its stability layer. The UI is a contract, not a display — that is what makes streaming AI trustworthy enough for 50M+ monthly users on a financial news platform.',
    },
    {
      num: '05',
      title: 'AI Is a Motorcycle, Not an Equalizer',
      body: 'AI equalizes execution speed — but execution was already cheap. What it amplifies is specification quality, which is a direct function of domain depth. It makes experts more productive faster than it makes novices competent. Keep earning the depth.',
    },
  ];

  const checkItems = [
    {
      key: 'check-1',
      text: 'Delegate one bounded task to an agent end-to-end — boundary and review bar, not keystrokes',
    },
    {
      key: 'check-2',
      text: 'Write the spec before the prompt: goal, boundary, tools, artifacts, receipts',
    },
    { key: 'check-3', text: 'Use the best model available, not the default' },
    {
      key: 'check-4',
      text: 'Reject one "done" that arrived without a receipt — the diff, the test run, the artifact',
    },
    { key: 'check-5', text: 'Capture one claim, pattern, or tension into the vault' },
  ];

  const rememberItems = [
    'Casual AI use is already table stakes — only the delegation tiers differentiate',
    'Reliability is engineered into the loop, not summoned from the model',
    'AI makes experts more productive faster than it makes novices competent',
    'Memory and context architecture beat model selection',
    'English is now a programming language — write it with an engineer’s precision',
  ];

  const butAlsoItems = [
    'Some engineering decisions only emerge from contact with the code',
    'A brownfield system is its own specification — respect what running code encodes',
    'AI-expanded scope carries errors you may not be qualified to catch',
    'Single-trial outcomes cannot grade a decision process',
    'Your worth is not your throughput',
  ];

  let checkState = $state<Record<string, boolean>>({});
  let streak = $state(0);
  let todayDate = $state('');

  onMount(() => {
    // Format today's date
    const now = new Date();
    todayDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Load persisted state
    try {
      const todayIso = now.toISOString().split('T')[0];
      const checkDate = localStorage.getItem(STORAGE_CHECK_DATE);

      // Only restore checks if they were saved today — auto-reset on new day
      if (checkDate === todayIso) {
        const savedChecks = localStorage.getItem(STORAGE_CHECKS);
        if (savedChecks) {
          checkState = JSON.parse(savedChecks);
        }
      }

      const savedStreak = localStorage.getItem(STORAGE_STREAK);
      if (savedStreak) {
        streak = parseInt(savedStreak, 10) || 0;
      }

      // A streak only survives if the last completed day was today or
      // yesterday — anything older means the chain is broken.
      const lastCompleted = localStorage.getItem(STORAGE_DATE);
      const yesterdayIso = new Date(now.getTime() - 86_400_000).toISOString().split('T')[0];
      if (streak > 0 && lastCompleted !== todayIso && lastCompleted !== yesterdayIso) {
        streak = 0;
        localStorage.setItem(STORAGE_STREAK, '0');
      }
    } catch {
      // localStorage unavailable, use in-memory defaults
    }
  });

  function toggleCheck(key: string) {
    checkState = { ...checkState, [key]: !checkState[key] };
    try {
      const todayIso = new Date().toISOString().split('T')[0];
      localStorage.setItem(STORAGE_CHECKS, JSON.stringify(checkState));
      localStorage.setItem(STORAGE_CHECK_DATE, todayIso);
    } catch {
      // ignore
    }
    updateStreak();
  }

  function updateStreak() {
    const allChecked = checkItems.every((item) => checkState[item.key]);
    if (!allChecked) return;

    const now = new Date();
    const todayIso = now.toISOString().split('T')[0];
    const yesterdayIso = new Date(now.getTime() - 86_400_000).toISOString().split('T')[0];
    try {
      const lastDate = localStorage.getItem(STORAGE_DATE);
      if (lastDate === todayIso) return; // already counted today

      // Consecutive only if the previous completion was yesterday;
      // a gap restarts the chain at 1 instead of silently continuing it.
      streak = lastDate === yesterdayIso ? streak + 1 : 1;
      localStorage.setItem(STORAGE_STREAK, String(streak));
      localStorage.setItem(STORAGE_DATE, todayIso);
    } catch {
      streak = streak + 1;
    }
  }

  function resetStreak() {
    streak = 0;
    checkState = {};
    try {
      localStorage.removeItem(STORAGE_CHECKS);
      localStorage.removeItem(STORAGE_STREAK);
      localStorage.removeItem(STORAGE_DATE);
      localStorage.removeItem(STORAGE_CHECK_DATE);
    } catch {
      // ignore
    }
  }
</script>

<svelte:head>
  <title>AI Thesis — Zhao Yu</title>
  <meta
    name="description"
    content="Zhao Yu's working thesis on AI-augmented engineering: specification quality as the bottleneck, agent loops and receipts, and deterministic interfaces around non-deterministic systems."
  />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://zhaoyu.io/ai-manifesto" />
  <meta property="og:title" content="AI Thesis — Zhao Yu" />
  <meta
    property="og:description"
    content="Zhao Yu's working thesis on AI-augmented engineering: specification quality as the bottleneck, agent loops and receipts, and deterministic interfaces around non-deterministic systems."
  />
  <meta property="og:image" content="https://zhaoyu.io/og/site.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://zhaoyu.io/ai-manifesto" />
  <meta property="twitter:title" content="AI Thesis — Zhao Yu" />
  <meta
    property="twitter:description"
    content="Zhao Yu's working thesis on AI-augmented engineering: specification quality as the bottleneck, agent loops and receipts, and deterministic interfaces around non-deterministic systems."
  />
  <link rel="canonical" href="https://zhaoyu.io/ai-manifesto" />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, self-authored JSON-LD, not user input -->
  {@html jsonLdScript}
</svelte:head>

<div class="manifesto-root">
  <!-- Grain overlay -->
  <div class="grain" aria-hidden="true"></div>

  <div class="container">
    <!-- Header -->
    <div class="header">
      <span class="tag">Working Thesis</span>
      <h1>The Factory<br />Is Going Dark</h1>
      <div class="date">{todayDate}</div>
    </div>

    <div class="divider"></div>

    <!-- Epigraph -->
    <p class="epigraph">
      Software is heading toward the dark factory: agents doing the implementation, humans holding
      the two endpoints.
      <br /><br />
      My job:
      <strong
        >write specifications an agent cannot misread, and demand receipts it cannot fake.</strong
      >
    </p>

    <!-- CORE PRINCIPLES -->
    <section class="section">
      <div class="section-label">Core Principles</div>
      <div class="principles">
        {#each principles as p (p.num)}
          <div class="principle">
            <div class="num">{p.num}</div>
            <div class="content">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- DAILY CHECKLIST -->
    <section class="section">
      <div class="section-label">Daily Non-Negotiables</div>
      <div class="checklist">
        {#each checkItems as item (item.key)}
          <button
            class="check-item"
            class:checked={checkState[item.key]}
            onclick={() => toggleCheck(item.key)}
            type="button"
          >
            <div class="checkbox">
              {#if checkState[item.key]}
                <span class="checkmark">✓</span>
              {/if}
            </div>
            <span class="check-text">{item.text}</span>
          </button>
        {/each}
      </div>
    </section>

    <!-- REALITY CHECK -->
    <section class="section">
      <div class="section-label">Stay Grounded — The Balance</div>
      <div class="reality-cards">
        <div class="reality-card hype">
          <h4>Remember This</h4>
          <ul>
            {#each rememberItems as item (item)}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
        <div class="reality-card ground">
          <h4>But Also This</h4>
          <ul>
            {#each butAlsoItems as item (item)}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      </div>
    </section>

    <!-- QUOTE -->
    <section class="section">
      <div class="quote-block">
        <p>
          "I use AI" stopped being the differentiator. Whether you can hand an agent a boundary and
          a review bar — instead of still typing every line yourself — is the one that's left.
        </p>
        <span class="attr">— from my claim vault, on where the leverage moved</span>
      </div>
    </section>

    <!-- STREAK -->
    <section class="section">
      <div class="streak-section">
        <div class="streak-number">{streak}</div>
        <div class="streak-label">Day Streak</div>
        <div class="streak-sub">Days in a row you've completed all 5 non-negotiables</div>
        <button class="streak-reset" onclick={resetStreak} type="button">Reset Streak</button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <p>
        These are my operating principles, argued from nine years of production systems and tested
        daily against real work.
        <br />
        Influences worth reading in full:
        <a
          href="https://shumer.dev/something-big-is-happening"
          target="_blank"
          rel="noopener noreferrer">Matt Shumer's "Something Big Is Happening"</a
        >
        on urgency, and Kleppmann's <em>Designing Data-Intensive Applications</em> on why the loop patterns
        are older than the agents.
      </p>
    </footer>
  </div>
</div>

<style>
  /* Light mode (default) */
  .manifesto-root {
    --m-bg: #f5f5f8;
    --m-surface: #ffffff;
    --m-surface-hover: #ededf2;
    --m-border: #e0e0e8;
    --m-border-strong: #b8b8c8;
    --m-text: #1a1a2e;
    --m-text-dim: #6b6b88;
    --m-accent: #e04020;
    --m-accent-glow: rgba(224, 64, 32, 0.08);
    --m-accent-border: rgba(224, 64, 32, 0.2);
    --m-green: #28a060;
    --m-green-dim: rgba(40, 160, 96, 0.1);
    --m-green-border: rgba(40, 160, 96, 0.2);
    --m-amber: #b07010;

    background: var(--m-bg);
    color: var(--m-text);
    font-family: 'Source Sans 3', sans-serif;
    min-height: calc(100vh - 64px); /* account for navbar height */
    overflow-x: hidden;
    position: relative;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  /* Dark mode */
  :global(html.dark) .manifesto-root {
    --m-bg: #0a0a0c;
    --m-surface: #17171c;
    --m-surface-hover: #1e1e26;
    --m-border: #2d2d3a;
    --m-border-strong: #52527a;
    --m-text: #e8e8ec;
    --m-text-dim: #8888a0;
    --m-accent: #f05030;
    --m-accent-glow: rgba(240, 80, 48, 0.15);
    --m-accent-border: rgba(240, 80, 48, 0.25);
    --m-green: #30c870;
    --m-green-dim: rgba(48, 200, 112, 0.12);
    --m-green-border: rgba(48, 200, 112, 0.2);
    --m-amber: #e8a020;
  }

  .grain {
    position: fixed;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 96px 24px 80px; /* 96px = 64px navbar + 32px breathing room */
    position: relative;
    z-index: 1;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 56px;
    animation: fadeUp 0.8s ease both;
  }

  .header .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--m-accent);
    margin-bottom: 16px;
    display: block;
  }

  .header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 20px;
    background: linear-gradient(135deg, var(--m-text) 30%, var(--m-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header .date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--m-text-dim);
  }

  .divider {
    width: 60px;
    height: 1px;
    background: var(--m-accent);
    margin: 32px auto;
    opacity: 0.6;
  }

  /* Epigraph */
  .epigraph {
    text-align: center;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.7;
    color: var(--m-text-dim);
    max-width: 600px;
    margin: 0 auto 56px;
    font-style: italic;
    animation: fadeUp 0.8s 0.15s ease both;
  }

  .epigraph strong {
    color: var(--m-text);
    font-weight: 600;
    font-style: normal;
  }

  /* Sections */
  .section {
    margin-bottom: 48px;
    animation: fadeUp 0.8s ease both;
  }

  .section:nth-child(3) {
    animation-delay: 0.2s;
  }
  .section:nth-child(4) {
    animation-delay: 0.3s;
  }
  .section:nth-child(5) {
    animation-delay: 0.4s;
  }
  .section:nth-child(6) {
    animation-delay: 0.5s;
  }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--m-text-dim);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--m-border);
  }

  /* Principles */
  .principles {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .principle {
    background: var(--m-surface);
    border: 1px solid var(--m-border);
    border-radius: 10px;
    padding: 20px 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    transition: all 0.25s ease;
  }

  .principle:hover {
    background: var(--m-surface-hover);
    border-color: var(--m-border-strong);
    transform: translateX(4px);
  }

  .num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--m-accent);
    background: var(--m-accent-glow);
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .content h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 17px;
    font-weight: 400;
    margin-bottom: 6px;
    color: var(--m-text);
  }

  .content p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--m-text-dim);
    font-weight: 400;
  }

  /* Checklist */
  .checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .check-item {
    background: var(--m-surface);
    border: 1px solid var(--m-border);
    border-radius: 10px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    width: 100%;
    text-align: left;
    color: var(--m-text);
    font-family: 'Source Sans 3', sans-serif;
  }

  .check-item:hover {
    background: var(--m-surface-hover);
  }

  .check-item.checked {
    opacity: 0.65;
  }

  .checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid var(--m-border-strong);
    border-radius: 5px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .check-item.checked .checkbox {
    background: var(--m-green);
    border-color: var(--m-green);
  }

  .checkmark {
    color: #000;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
  }

  .check-text {
    font-size: 15px;
    font-weight: 400;
    transition: all 0.2s ease;
  }

  .check-item.checked .check-text {
    text-decoration: line-through;
    color: var(--m-text-dim);
  }

  /* Reality cards */
  .reality-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  @media (max-width: 600px) {
    .reality-cards {
      grid-template-columns: 1fr;
    }
  }

  .reality-card {
    border-radius: 10px;
    padding: 20px;
    border: 1px solid var(--m-border);
  }

  .reality-card.hype {
    background: linear-gradient(135deg, var(--m-accent-glow), transparent);
    border-color: var(--m-accent-border);
  }

  .reality-card.ground {
    background: linear-gradient(135deg, var(--m-green-dim), transparent);
    border-color: var(--m-green-border);
  }

  .reality-card h4 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .reality-card.hype h4 {
    color: var(--m-accent);
  }
  .reality-card.ground h4 {
    color: var(--m-green);
  }

  .reality-card ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .reality-card li {
    font-size: 13px;
    line-height: 1.5;
    color: var(--m-text-dim);
    padding-left: 14px;
    position: relative;
  }

  .reality-card li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--m-text-dim);
  }

  /* Quote */
  .quote-block {
    background: var(--m-surface);
    border-left: 3px solid var(--m-accent);
    border-radius: 0 10px 10px 0;
    padding: 24px 28px;
  }

  .quote-block p {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    line-height: 1.6;
    font-weight: 400;
    color: var(--m-text);
  }

  .quote-block .attr {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--m-text-dim);
    margin-top: 12px;
    display: block;
  }

  /* Streak */
  .streak-section {
    text-align: center;
    padding: 32px;
    background: var(--m-surface);
    border: 1px solid var(--m-border);
    border-radius: 14px;
  }

  .streak-number {
    font-family: 'DM Serif Display', serif;
    font-size: 64px;
    line-height: 1;
    background: linear-gradient(135deg, var(--m-amber), var(--m-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .streak-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--m-text-dim);
    margin-bottom: 16px;
  }

  .streak-sub {
    font-size: 13px;
    color: var(--m-text-dim);
    font-weight: 400;
  }

  .streak-reset {
    margin-top: 16px;
    background: transparent;
    border: 1px solid var(--m-border);
    color: var(--m-text-dim);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .streak-reset:hover {
    border-color: var(--m-accent);
    color: var(--m-accent);
  }

  /* Footer */
  .footer {
    text-align: center;
    margin-top: 64px;
    padding-top: 32px;
    border-top: 1px solid var(--m-border);
  }

  .footer p {
    font-size: 13px;
    color: var(--m-text-dim);
    font-weight: 400;
    line-height: 1.7;
  }

  .footer a {
    color: var(--m-accent);
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .footer a:hover {
    opacity: 0.8;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
