<script lang="ts">
  import { heroContent } from '$lib/constants/content';
  import { handleAnchorNavigation } from '$lib/utils/navigation';

  const { identity } = heroContent;

  // One line per sentence, so a two-sentence thesis never breaks mid-thought
  // ("Done is a claim. The / receipt is…"). A one-sentence headline is a no-op.
  const headlineLines = heroContent.headline.primary.split(/(?<=\.)\s+/);
</script>

<section
  class="hero-section relative w-full overflow-hidden flex items-center justify-center border-b"
>
  <div class="hero-backdrop absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
    <div class="hero-grid absolute inset-0"></div>
    <div class="radial-overlay absolute inset-0"></div>
  </div>

  <!-- No entrance reveal here on purpose: the headline is the LCP element, and
       gating it on hydration would hide the largest paint behind the JS bundle.
       Below-the-fold sections still use the observeSection reveal. -->
  <div class="hero-content relative z-10 text-center mx-auto">
    <h1 class="hero-headline">
      {#each headlineLines as line, i (i)}
        <!-- The trailing space keeps the text content "claim. The", not
             "claim.The", for screen readers and crawlers. -->
        <span class="hero-headline-line">{line}{i < headlineLines.length - 1 ? ' ' : ''}</span>
      {/each}
      <!-- A subhead, not a second headline: at display size these 15 words ran
           to three lines and pushed both CTAs past the fold on a 1280x720
           laptop. Kept inside the h1 so the outline and positioning.test.ts's
           combined word count are unchanged. -->
      <span class="hero-subhead block">
        {heroContent.headline.accent}
      </span>
    </h1>

    <p class="hero-bio mx-auto">{heroContent.bio}</p>

    <div class="hero-actions flex flex-col md:flex-row justify-center items-center">
      <a
        href="/#notes"
        onclick={(e) => handleAnchorNavigation(e, '/#notes')}
        class="cta cta-primary w-full md:w-auto"
      >
        {heroContent.cta.primary}
      </a>
      <a
        href="/#work"
        onclick={(e) => handleAnchorNavigation(e, '/#work')}
        class="cta cta-secondary w-full md:w-auto"
      >
        {heroContent.cta.secondary}
      </a>
    </div>

    <!-- Identity, stated once and quietly: under the CTAs, at secondary weight,
         so the thesis is what the page says first and the role is there for
         anyone who looks for it. -->
    <p class="hero-identity">
      {identity.name} · {identity.role} · {identity.location}
    </p>
  </div>
</section>

<style>
  /* Sized to the copy, not to the viewport. The old min-height: 100vh forced a
     full screen of scroll before any content and still overflowed, because the
     content itself ran to 961px. */
  .hero-section {
    min-height: 85vh;
    background-color: var(--bg-primary);
    border-color: var(--border-color);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .hero-content {
    max-width: 64rem;
    padding-top: var(--space-4xl);
    padding-right: var(--section-x);
    padding-bottom: var(--space-2xl);
    padding-left: var(--section-x);
  }

  /* ---------- Backdrop ---------- */

  .hero-grid {
    background-image:
      linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
      linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
    background-size: var(--space-lg) var(--space-lg);
  }

  .radial-overlay {
    background: radial-gradient(circle at 50% 50%, transparent 0%, var(--bg-primary) 70%);
    transition: background var(--duration-base);
  }

  /* ---------- Type ---------- */

  .hero-headline {
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    font-size: var(--type-2xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    text-wrap: balance;
    transition: color var(--duration-base);
  }

  .hero-headline-line {
    display: block;
  }

  /* One step below the headline and above the bio: classification, then
     measurement, then description. Solid --accent-primary-text rather than the
     old gradient — it is the theme-flipped, AA-safe accent, and the gradient
     was the loudest thing on the page. */
  .hero-subhead {
    margin-top: var(--space-sm);
    color: var(--accent-primary-text);
    font-size: var(--type-lg);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-normal);
    transition: color var(--duration-base);
  }

  .hero-bio {
    max-width: 62ch;
    margin-bottom: var(--space-lg);
    color: var(--text-secondary);
    font-size: var(--type-md);
    font-weight: var(--weight-light);
    line-height: var(--leading-relaxed);
    transition: color var(--duration-base);
  }

  /* ---------- Actions ---------- */

  .hero-actions {
    gap: var(--space-md);
  }

  .cta {
    padding: var(--space-sm) var(--space-xl);
    border: 1px solid transparent;
    border-radius: var(--radius-full);
    font-size: var(--type-base);
    text-decoration: none;
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base),
      color var(--duration-base);
  }

  /* --text-primary / --bg-primary already invert between themes, so the solid
     button stays inverted without a .dark override. */
  .cta-primary {
    background: var(--text-primary);
    color: var(--bg-primary);
    font-weight: var(--weight-bold);
  }

  .cta-primary:hover {
    background: var(--text-secondary);
  }

  .cta-secondary {
    border-color: var(--border-color);
    color: var(--text-secondary);
    font-weight: var(--weight-medium);
  }

  .cta-secondary:hover {
    background: var(--surface-raised);
    color: var(--text-primary);
  }

  /* ---------- Identity ---------- */

  /* Description tier, below the bio: sans, muted, the smallest text in the
     hero. A fact for the reader who goes looking, not a badge. */
  .hero-identity {
    margin-top: var(--space-xl);
    color: var(--text-muted);
    font-size: var(--type-sm);
    font-weight: var(--weight-regular);
    line-height: var(--leading-relaxed);
    transition: color var(--duration-base);
  }

  /* ---------- Responsive ---------- */

  @media (min-width: 768px) {
    .hero-headline {
      font-size: var(--type-3xl);
      margin-bottom: var(--space-lg);
    }

    .hero-subhead {
      margin-top: var(--space-md);
      font-size: var(--type-xl);
    }

    .hero-bio {
      font-size: var(--type-lg);
    }
  }

  @media (min-width: 1024px) {
    .hero-headline {
      font-size: var(--type-4xl);
    }
  }
</style>
