import { describe, it, expect } from 'vitest';
import { noteExcerpt } from './note-excerpt';

describe('noteExcerpt', () => {
  it('strips HTML tags from the first paragraph', () => {
    const note = {
      title: 'Title',
      content: ['Plain <strong>bold</strong> and <code>code</code> text.'],
    };
    expect(noteExcerpt(note)).toBe('Plain bold and code text.');
  });

  it('truncates to the default 160 characters', () => {
    const note = { title: 'Title', content: ['x'.repeat(500)] };
    expect(noteExcerpt(note)).toHaveLength(160);
  });

  it('respects a custom maxLength', () => {
    const note = { title: 'Title', content: ['abcdefghij'] };
    expect(noteExcerpt(note, 5)).toBe('abcde');
  });

  it('falls back to the title when there is no content', () => {
    const note = { title: 'Fallback Title', content: [] };
    expect(noteExcerpt(note)).toBe('Fallback Title');
  });

  it('does not pad short paragraphs', () => {
    const note = { title: 'Title', content: ['Short.'] };
    expect(noteExcerpt(note)).toBe('Short.');
  });
});
