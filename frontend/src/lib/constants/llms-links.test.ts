import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { notesData } from './content';

// llms.txt is hand-curated prose, but its note links must stay real: a renamed
// or deleted slug would otherwise ship dead links to every AI agent reading it.
const llmsPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../../static/llms.txt');
const llms = readFileSync(llmsPath, 'utf8');

describe('llms.txt link integrity', () => {
  it('only links note slugs that exist in content.ts', () => {
    const slugs = new Set(notesData.notes.map((note) => note.slug));
    const linked = [...llms.matchAll(/zhaoyu\.io\/blog\/([a-z0-9-]+)/g)].map((m) => m[1]);

    expect(linked.length).toBeGreaterThan(0);
    for (const slug of linked) {
      expect(slugs, `llms.txt links a note that no longer exists: ${slug}`).toContain(slug);
    }
  });

  it('routes agents to the canonical note index at /blog', () => {
    expect(llms).toContain('https://zhaoyu.io/blog');
  });

  it('includes the newest note so highlights do not go stale', () => {
    const newest = notesData.notes.reduce((max, note) => (note.dateISO > max.dateISO ? note : max));
    expect(llms, `llms.txt is missing the newest note: ${newest.slug}`).toContain(newest.slug);
  });
});
