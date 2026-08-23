import { describe, expect, it } from 'vitest';
import { groupNotesByMonth } from './note-groups';
import type { EngineeringNote } from '$lib/constants/content';
import { notesData } from '$lib/constants/content';

const note = (slug: string, dateISO: string): EngineeringNote => ({
  slug,
  title: slug,
  date: dateISO,
  dateISO,
  tags: ['a', 'b', 'c'],
  sources: [{ label: 'First-hand: fixture' }],
  content: ['one', 'two'],
});

describe('groupNotesByMonth', () => {
  it('collapses a month of notes into a single labelled group', () => {
    // The reason this exists: eleven notes entered the repo the same day, and a
    // per-row date printed that string eleven times.
    const groups = groupNotesByMonth([
      note('a', '2026-07-11'),
      note('b', '2026-07-11'),
      note('c', '2026-07-11'),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('July 2026');
    expect(groups[0].monthISO).toBe('2026-07');
    expect(groups[0].notes.map((n) => n.slug)).toEqual(['a', 'b', 'c']);
  });

  it('orders months newest first regardless of input order', () => {
    const groups = groupNotesByMonth([
      note('jul', '2026-07-11'),
      note('dec', '2026-12-02'),
      note('aug', '2026-08-14'),
    ]);
    expect(groups.map((g) => g.monthISO)).toEqual(['2026-12', '2026-08', '2026-07']);
  });

  it('sorts across year boundaries by date, not by month number', () => {
    const groups = groupNotesByMonth([note('old', '2025-12-01'), note('new', '2026-01-05')]);
    expect(groups.map((g) => g.label)).toEqual(['January 2026', 'December 2025']);
  });

  it('preserves the incoming order within a month', () => {
    const groups = groupNotesByMonth([note('later', '2026-07-28'), note('earlier', '2026-07-02')]);
    // The array is maintained newest-first upstream; grouping must not reorder.
    expect(groups[0].notes.map((n) => n.slug)).toEqual(['later', 'earlier']);
  });

  it('labels every month name correctly', () => {
    const groups = groupNotesByMonth(
      Array.from({ length: 12 }, (_, i) =>
        note(`m${i}`, `2026-${String(i + 1).padStart(2, '0')}-01`),
      ),
    );
    expect(groups.map((g) => g.label)).toEqual([
      'December 2026',
      'November 2026',
      'October 2026',
      'September 2026',
      'August 2026',
      'July 2026',
      'June 2026',
      'May 2026',
      'April 2026',
      'March 2026',
      'February 2026',
      'January 2026',
    ]);
  });

  it('keeps a note with an unusable date rather than dropping it', () => {
    // Losing a note from the archive is worse than showing it unheaded.
    const groups = groupNotesByMonth([note('good', '2026-07-11'), note('bad', 'not-a-date')]);
    expect(groups.flatMap((g) => g.notes).map((n) => n.slug)).toEqual(['good', 'bad']);
    expect(groups.at(-1)?.label).toBe('');
  });

  it('returns nothing for no notes', () => {
    expect(groupNotesByMonth([])).toEqual([]);
  });

  it('accounts for every real note exactly once', () => {
    const groups = groupNotesByMonth(notesData.notes);
    const slugs = groups.flatMap((g) => g.notes).map((n) => n.slug);
    expect(slugs).toHaveLength(notesData.notes.length);
    expect(new Set(slugs).size).toBe(notesData.notes.length);
  });

  it('gives every real group a heading, so none renders untitled', () => {
    for (const group of groupNotesByMonth(notesData.notes)) {
      expect(group.label, `${group.monthISO} has no label`).toMatch(/^[A-Z][a-z]+ \d{4}$/);
      expect(group.monthISO).toMatch(/^\d{4}-\d{2}$/);
    }
  });
});
