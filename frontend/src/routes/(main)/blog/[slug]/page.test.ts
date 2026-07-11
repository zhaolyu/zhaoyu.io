import { describe, it, expect } from 'vitest';
import { load, entries } from './+page';
import { notesData } from '$lib/constants/content';

describe('blog [slug] entries', () => {
  it('prerenders one entry per engineering note', () => {
    const result = entries();
    expect(result).toEqual(notesData.notes.map((n) => ({ slug: n.slug })));
  });
});

describe('blog [slug] load', () => {
  it('returns the matching note for a valid slug', () => {
    const note = notesData.notes[0];
    const result = load({ params: { slug: note.slug } } as Parameters<typeof load>[0]);
    expect(result).toEqual({ note });
  });

  it('throws a 404 for an unknown slug', () => {
    expect(() =>
      load({ params: { slug: 'not-a-real-note' } } as Parameters<typeof load>[0]),
    ).toThrow(expect.objectContaining({ status: 404 }));
  });
});
