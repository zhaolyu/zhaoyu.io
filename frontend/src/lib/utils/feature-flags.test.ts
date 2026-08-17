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
  it('hides the unlaunched AI product-internals card under default flags', () => {
    const projectTitles = visibleItems(projectsData.projects).map((p) => p.title);
    const builderTitles = visibleItems(builderProjects).map((p) => p.title);

    // Assert the gated card exists before asserting it's hidden — otherwise
    // renaming a card turns the negative assertion below into a no-op.
    expect(projectsData.projects.map((p) => p.title)).toContain('CNBC AI Insight Engine');
    expect(projectTitles).not.toContain('CNBC AI Insight Engine');

    // the rest of the work remains visible — including the AI assistant
    // summary card, which ships unflagged because its copy is scoped to the
    // beta pilot rather than to an unlaunched public product.
    expect(projectTitles).toContain('CNBC.com Next-Gen Migration');
    expect(builderTitles).toContain('AI Financial Assistant (Architecture Pilot)');
    expect(builderTitles).toContain('CNBC.com Next-Gen Platform & Video Rebuild');
    expect(builderTitles).toContain('Infrastructure & Privacy Separation');
    expect(builderTitles).toContain('Cost-Guard: FinOps Platform');
  });
});
