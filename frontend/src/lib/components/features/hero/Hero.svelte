<script lang="ts">
  import { heroContent } from '$lib/constants/content';
  import { handleAnchorNavigation } from '$lib/utils/navigation';

  // Light emphasis on the two phrases that carry the story; each replace is a
  // no-op when the phrase is absent, so a copy edit cannot break the markup.
  const formattedBio = $derived(
    heroContent.bio
      .replace(/still ships/g, '<strong class="bio-emphasis">still ships</strong>')
      .replace(/carries a receipt/g, '<span class="bio-metric">carries a receipt</span>'),
  );
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
      {heroContent.headline.primary}
      <!-- A subhead, not a second headline: at display size these 15 words ran
           to three lines and pushed both CTAs past the fold on a 1280x720
           laptop. Kept inside the h1 so the outline and positioning.test.ts's
           combined word count are unchanged. -->
      <span class="hero-subhead block">
        {heroContent.headline.accent}
      </span>
    </h1>

    <p class="hero-bio mx-auto">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- self-authored bio from content.ts, not user input -->
      {@html formattedBio}
    </p>

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

  /* ---------- Bio emphasis (injected by formattedBio) ---------- */

  :global(.hero-bio .bio-emphasis) {
    color: var(--text-primary);
    font-weight: var(--weight-regular);
    transition: color var(--duration-base);
  }

  :global(.hero-bio .bio-metric) {
    padding-bottom: var(--space-2xs);
    border-bottom: 1px solid var(--accent-primary-30);
    color: var(--text-primary);
    transition:
      color var(--duration-base),
      border-color var(--duration-base);
  }

  :global(.hero-bio .bio-metric:hover) {
    border-bottom-color: var(--accent-primary);
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
