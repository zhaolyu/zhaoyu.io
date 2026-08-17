import { describe, it, expect } from 'vitest';
import {
  buildHeroContent,
  buildNarrativeBio,
  buildBuilderProjects,
  buildSocialDescriptions,
} from './content';
import { FEATURE_FLAGS } from './config';

/**
 * The go-loud flip happens once, months after this code was written. These
 * assertions are what stop a one-sided edit — updating the loud copy while
 * the quiet copy silently rots, or vice versa — from shipping unnoticed.
 */
const QUIET = { goLoudPositioning: false };
const LOUD = { goLoudPositioning: true };

const PLATFORM_CARD = 'CNBC.com Next-Gen Platform & Video Rebuild';

const platformCard = (flags: { goLoudPositioning: boolean }) => {
  const card = buildBuilderProjects(flags).find((p) => p.title === PLATFORM_CARD);
  if (!card) throw new Error(`${PLATFORM_CARD} card is missing from builderProjects`);
  return card;
};

describe('positioning flag — quiet state', () => {
  it('ships the scope-describing hero', () => {
    const hero = buildHeroContent(QUIET);
    expect(hero.headline.accent).toBe(
      'Player-Coach: Platform Architecture, Core Video & AI Governance.',
    );
    expect(hero.bio).not.toMatch(/AI financial assistant|next-gen web video experience/);
  });

  it('omits the surface-ownership paragraph from the persona bio', () => {
    const paragraphs = buildNarrativeBio(QUIET).paragraphs;
    expect(paragraphs.join(' ')).not.toMatch(/revenue engine|owning both ends/);
  });

  it('drops the monetization framing and product-continuity scope from the platform card', () => {
    const card = platformCard(QUIET);
    expect(card.description).not.toMatch(
      /monetization engine|[redacted]|technical continuity|Acting product owner|PM vacancy/,
    );
    expect(card.metrics).toContainEqual({ label: 'Playback', value: 'Live + VOD' });
  });

  it('claims video architecture but not video team leadership', () => {
    // The quiet card may say it architected the video experiences; only the
    // loud one says he leads the team shipping them.
    const card = platformCard(QUIET);
    expect(card.description).toMatch(/core video streaming experiences/);
    expect(card.description).not.toMatch(/lead the team|surfaces in flight/i);
  });

  it('keeps social descriptions scope-describing', () => {
    const { meta, twitter } = buildSocialDescriptions(QUIET);
    expect(`${meta} ${twitter}`).not.toMatch(/AI financial assistant|next-gen web video/);
  });
});

describe('positioning flag — go-loud state', () => {
  it('ships the surface-ownership hero', () => {
    const hero = buildHeroContent(LOUD);
    expect(hero.headline.accent).toBe(
      'I own the platform, video, and AI surfaces a financial audience runs on.',
    );
    expect(hero.bio).toMatch(/AI financial assistant/);
  });

  it('adds the surface-ownership paragraph to the persona bio', () => {
    const quiet = buildNarrativeBio(QUIET).paragraphs;
    const loud = buildNarrativeBio(LOUD).paragraphs;

    expect(loud).toHaveLength(quiet.length + 1);
    expect(loud[1]).toMatch(/revenue engine/);
  });

  it('adds the monetization framing and product-continuity scope to the platform card', () => {
    const card = platformCard(LOUD);
    expect(card.description).toMatch(/monetization engine/);
    expect(card.description).toMatch(/technical continuity across all of them/);
    // The video-team leadership detail the standalone video card used to carry:
    // leading the team, the five surfaces, and the layers they span.
    expect(card.description).toMatch(/I lead the team building the video surfaces/);
    expect(card.description).toMatch(/[redacted]/);
    expect(card.description).toMatch(/player architecture, playback state/);
    // Guard against the retired overstatement: the team has no PM vacancy —
    // several PMs rotate through per project. See ops/queue.md
    // `pm-claim-overstatement-FLAGGED` in the exocortex vault.
    expect(card.description).not.toMatch(/Acting product owner|PM vacancy/);
    expect(card.metrics).toContainEqual({
      label: 'Product Continuity',
      value: 'Across rotating PMs',
    });
  });

  it('leads social descriptions with AI and video', () => {
    const { meta, twitter } = buildSocialDescriptions(LOUD);
    expect(meta).toMatch(/AI financial assistant/);
    expect(twitter).toMatch(/next-gen web video/);
  });
});

describe('positioning-invariant content', () => {
  it('keeps the canonical team phrasing in both states — it must match LinkedIn either way', () => {
    for (const flags of [QUIET, LOUD]) {
      expect(buildHeroContent(flags).bio).toMatch(/20-engineer organization/);
      expect(buildHeroContent(flags).bio).toMatch(/Senior Manager, Engineering/);
      expect(buildNarrativeBio(flags).paragraphs[0]).toMatch(/20-engineer organization/);
    }
  });

  it('keeps the platform card visible and same-length in both states', () => {
    expect(buildBuilderProjects(QUIET)).toHaveLength(buildBuilderProjects(LOUD).length);
    expect(platformCard(QUIET).metrics).toHaveLength(2);
    expect(platformCard(LOUD).metrics).toHaveLength(2);
  });

  it('keeps the platform rebuild card first so it leads Selected Work', () => {
    expect(buildBuilderProjects(QUIET)[0].title).toBe(PLATFORM_CARD);
  });

  it('ships the AI assistant card unflagged, grounded to the beta pilot', () => {
    for (const flags of [QUIET, LOUD]) {
      const card = buildBuilderProjects(flags).find((p) =>
        p.title.startsWith('AI Financial Assistant'),
      );
      // Grounding guard: the assistant is a validated pilot cohort, not a
      // site-wide production surface. Copy must not imply otherwise.
      expect(card?.featureFlag).toBeUndefined();
      expect(card?.status).toBe('beta-pilot');
      expect(card?.description).toMatch(/[redacted] beta cohort/);
    }
  });
});

describe('shipped defaults', () => {
  it('ships the quiet state until the flag is deliberately flipped', () => {
    expect(FEATURE_FLAGS.goLoudPositioning).toBe(false);
    expect(FEATURE_FLAGS.showCnbcAiWork).toBe(false);
  });
});
