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
  it('hides the unlaunched CNBC AI cards under default flags', () => {
    const projectTitles = visibleItems(projectsData.projects).map((p) => p.title);
    const builderTitles = visibleItems(builderProjects).map((p) => p.title);

    // Assert the gated cards exist before asserting they're hidden — otherwise
    // renaming a card turns the negative assertions below into no-ops.
    expect(projectsData.projects.map((p) => p.title)).toContain('CNBC AI Insight Engine');
    expect(builderProjects.map((p) => p.title)).toContain('CNBC AI Financial Assistant');

    expect(projectTitles).not.toContain('CNBC AI Insight Engine');
    expect(builderTitles).not.toContain('CNBC AI Financial Assistant');

    // the rest of the work remains visible
    expect(projectTitles).toContain('CNBC.com Next-Gen Migration');
    expect(builderTitles).toContain('CNBC Next-Gen Web Video');
    expect(builderTitles).toContain('CNBC UI Factory Initiative');
    expect(builderTitles).toContain('Cost-Guard: Infra Dashboard');
  });
});
