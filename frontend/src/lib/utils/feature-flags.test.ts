import { describe, it, expect } from 'vitest';
import { visibleItems } from './feature-flags';
import { projectsData, builderProjects } from '$lib/constants/content';

const items = [
  { title: 'unflagged' },
  { title: 'flagged', featureFlag: 'showCnbcAiWork' as const },
];

describe('visibleItems', () => {
  it('always keeps unflagged items', () => {
    expect(visibleItems(items, { showCnbcAiWork: false }).map((i) => i.title)).toEqual([
      'unflagged',
    ]);
  });

  it('keeps flagged items when their flag is enabled', () => {
    expect(visibleItems(items, { showCnbcAiWork: true }).map((i) => i.title)).toEqual([
      'unflagged',
      'flagged',
    ]);
  });

  it('returns an empty list untouched', () => {
    expect(visibleItems([], { showCnbcAiWork: true })).toEqual([]);
  });
});

describe('current site content', () => {
  it('ships no flagged content until CNBC announces — a flag hides a card, not the bundle', () => {
    // Anything gated by showCnbcAiWork stays out of this repository until it
    // is public (see FEATURE_FLAGS), so under default flags every card is
    // visible and none carries the flag.
    expect(projectsData.projects.every((p) => !p.featureFlag)).toBe(true);
    expect(builderProjects.every((p) => !p.featureFlag)).toBe(true);

    const projectTitles = visibleItems(projectsData.projects).map((p) => p.title);
    const builderTitles = visibleItems(builderProjects).map((p) => p.title);
    expect(projectTitles).toContain('CNBC.com Next-Gen Migration');
    expect(builderTitles).toContain('CNBC.com Next-Gen Platform & Video Rebuild');
    expect(builderTitles).toContain('AI-Powered Investing Tools (Frontend Architecture)');
    expect(builderTitles).toContain('Infrastructure & Privacy Separation');
    expect(builderTitles).toContain('Cost-Guard: FinOps Platform');
  });
});
