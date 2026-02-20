<script lang="ts">
  import { onMount } from 'svelte';

  const STORAGE_CHECKS = 'manifesto-checks';
  const STORAGE_STREAK = 'manifesto-streak';
  const STORAGE_DATE = 'manifesto-streak-date';

  const principles = [
    {
      num: '01',
      title: 'The Water Is Rising',
      body: 'This is not a drill, not a fad, not hype. The technology works, it improves predictably, and the wealthiest institutions in history are committing trillions. Act like it.',
    },
    {
      num: '02',
      title: 'Kill Your Old Experience',
      body: "If you tried AI in 2023 or early 2024 and were unimpressed — that's ancient history. The models today are unrecognizable. Never evaluate the present with yesterday's experience.",
    },
    {
      num: '03',
      title: 'Have No Ego About It',
      body: 'The people who will struggle most are the ones who refuse to engage — who dismiss it as a fad, who feel using AI diminishes their expertise, who assume their field is immune. No field is.',
    },
    {
      num: '04',
      title: "Push, Don't Browse",
      body: "Don't treat AI like Google. Feed it your actual work. Give it the hard stuff. The people getting ahead aren't using AI casually — they're automating what used to take hours.",
    },
    {
      num: '05',
      title: 'Adapt as Identity',
      body: "The specific tools don't matter as much as the muscle of learning new ones quickly. Get comfortable being a beginner repeatedly. Adaptability is the only durable advantage.",
    },
  ];

  const checkItems = [
    { key: 'check-1', text: 'Spend 1 hour experimenting with AI on something new' },
    { key: 'check-2', text: 'Push AI into a task I assumed was "too hard" for it' },
    { key: 'check-3', text: 'Use the best model available, not the default' },
    { key: 'check-4', text: 'Identify one part of my work that AI could handle — and test it' },
    { key: 'check-5', text: 'Learn something new about how a model or tool works' },
  ];

  const rememberItems = [
    'AI capability is doubling every 4–7 months',
    'AI is now helping build the next AI',
    'The smartest people in the room are not dismissing this',
    'Nothing done on a screen is safe in the medium term',
    'The window to be early is closing',
  ];

  const butAlsoItems = [
    'Timelines are estimates, not guarantees',
    'Adoption lags capability — regulation, inertia, trust',
    'Relationships, presence, and judgment still matter',
    'Hype cycles overshoot before correcting',
    'Your worth is not your productivity',
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
      const savedChecks = localStorage.getItem(STORAGE_CHECKS);
      if (savedChecks) {
        checkState = JSON.parse(savedChecks);
      }
      const savedStreak = localStorage.getItem(STORAGE_STREAK);
      if (savedStreak) {
        streak = parseInt(savedStreak, 10) || 0;
      }
    } catch {
      // localStorage unavailable, use in-memory defaults
    }
  });

  function toggleCheck(key: string) {
    checkState = { ...checkState, [key]: !checkState[key] };
    try {
      localStorage.setItem(STORAGE_CHECKS, JSON.stringify(checkState));
    } catch {
      // ignore
    }
    updateStreak();
  }

  function updateStreak() {
    const allChecked = checkItems.every((item) => checkState[item.key]);
    if (!allChecked) return;

    const todayIso = new Date().toISOString().split('T')[0];
    try {
      const lastDate = localStorage.getItem(STORAGE_DATE);
      if (lastDate !== todayIso) {
        streak = streak + 1;
        localStorage.setItem(STORAGE_STREAK, String(streak));
        localStorage.setItem(STORAGE_DATE, todayIso);
      }
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
    } catch {
      // ignore
    }
  }
</script>

<svelte:head>
  <title>Manifesto — zhaoyu.io</title>
  <meta
    name="description"
    content="A personal manifesto on AI-augmented engineering — principles for building with large language models as a Principal Engineer."
  />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="manifesto-root">
  <!-- Grain overlay -->
  <div class="grain" aria-hidden="true"></div>

  <div class="container">
    <!-- Header -->
    <div class="header">
      <span class="tag">Daily Manifesto</span>
      <h1>Something Big<br />Is Happening</h1>
      <div class="date">{todayDate}</div>
    </div>

    <div class="divider"></div>

    <!-- Epigraph -->
    <p class="epigraph">
      "The gap between what I've been saying and what is actually happening has gotten far too big."
      <br /><br />
      Your job: <strong>close the gap between perception and reality every single day.</strong>
    </p>

    <!-- CORE PRINCIPLES -->
    <section class="section">
      <div class="section-label">Core Principles</div>
      <div class="principles">
        {#each principles as p}
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
        {#each checkItems as item}
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
            {#each rememberItems as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
        <div class="reality-card ground">
          <h4>But Also This</h4>
          <ul>
            {#each butAlsoItems as item}
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
          The person who walks into a meeting and says "I used AI to do this analysis in an hour
          instead of three days" is going to be the most valuable person in the room. Not
          eventually. Right now.
        </p>
        <span class="attr">— Matt Shumer</span>
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
        Based on <a
          href="https://x.com/mattshumer_/status/2021256989876109403"
          target="_blank"
          rel="noopener noreferrer">Something Big Is Happening</a
        >
        by Matt Shumer
        <br />
        "The future is already here. It just hasn't knocked on your door yet. It's about to."
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
