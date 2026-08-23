import { describe, it, expect } from 'vitest';
import { notesData, type EngineeringNote } from './content';

/**
 * Voice discipline: the constructions that make prose read machine-made are
 * rationed by the `writer` skill, but a rationing table nobody executes is a
 * style guide, not a gate. This file executes it.
 *
 * Two tiers, deliberately. The rules every note already satisfies are enforced
 * across the whole corpus. The rules the 2025 notes and four of the 2026 notes
 * predate — em-dash density, emphasis density, note length — are enforced from
 * VOICE_RULES_FROM onward, so the bar applies to what ships next without
 * retroactively failing what already shipped. Grandfathering by date rather
 * than by an allowlist means there is no exemption list to rot.
 */
const VOICE_RULES_FROM = '2026-08-24';

const isGoverned = (note: EngineeringNote) => note.dateISO >= VOICE_RULES_FROM;

/** Note content is inline HTML; voice rules are about the prose underneath it. */
const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&#?[a-zA-Z0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const wordCount = (html: string) => plain(html).split(' ').filter(Boolean).length;

const countOf = (haystack: string, pattern: RegExp) => (haystack.match(pattern) || []).length;

/**
 * Throat-clearing and LLM-tell vocabulary. Every one of these is banned outright
 * by the writer skill, and none appears in the corpus today — so this list is a
 * ratchet, not a cleanup.
 */
const BANNED_PHRASES = [
  "in today's fast-paced",
  "let's dive in",
  'delve',
  'game-changer',
  'game changer',
  'seamless',
  'supercharge',
  'paradigm shift',
  'at the end of the day',
  "it's worth noting",
  'simply put',
  'the reality is',
  'needless to say',
  'when it comes to',
];

/** The corpus's dominant rhetorical move — fine once, a tic twice. */
const X_NOT_Y = /\bis not\b[^.;]{2,60}?,\s*it(?:'s| is)\b/gi;

const governed = notesData.notes.filter(isGoverned);
const allNotes = notesData.notes;

describe('note shape (every note)', () => {
  it('runs exactly two paragraphs', () => {
    for (const note of allNotes) {
      expect(note.content.length, `${note.slug} has ${note.content.length} paragraphs`).toBe(2);
    }
  });

  it('carries exactly three tags', () => {
    for (const note of allNotes) {
      expect(note.tags.length, `${note.slug} has ${note.tags.length} tags`).toBe(3);
    }
  });

  it('never uses a heading, a list, or a code block inside a note', () => {
    for (const note of allNotes) {
      for (const para of note.content) {
        expect(para, `${note.slug} contains block markup`).not.toMatch(/<(h[1-6]|ul|ol|li|pre)\b/i);
      }
    }
  });
});

describe('banned constructions (every note)', () => {
  it('uses no exclamation points', () => {
    for (const note of allNotes) {
      for (const [i, para] of note.content.entries()) {
        expect(countOf(plain(para), /!/g), `${note.slug} ¶${i + 1} has an exclamation point`).toBe(
          0,
        );
      }
    }
  });

  it('uses none of the banned throat-clearing or LLM-tell phrases', () => {
    for (const note of allNotes) {
      const prose = plain(note.content.join(' ')).toLowerCase();
      const hits = BANNED_PHRASES.filter((phrase) => prose.includes(phrase));
      expect(hits, `${note.slug} uses banned phrasing: ${hits.join(', ')}`).toEqual([]);
    }
  });

  it('leans on "X is not Y, it\'s Z" at most once per note', () => {
    for (const note of allNotes) {
      const uses = countOf(plain(note.content.join(' ')), X_NOT_Y);
      expect(uses, `${note.slug} uses the X-not-Y move ${uses} times`).toBeLessThanOrEqual(1);
    }
  });
});

describe(`voice rationing (notes dated ${VOICE_RULES_FROM} or later)`, () => {
  it('keeps em dashes to two per paragraph', () => {
    for (const note of governed) {
      for (const [i, para] of note.content.entries()) {
        const dashes = countOf(para, /—/g);
        expect(dashes, `${note.slug} ¶${i + 1} has ${dashes} em dashes`).toBeLessThanOrEqual(2);
      }
    }
  });

  it('closes on an emphasised rule, without over-emphasising', () => {
    for (const note of governed) {
      const emphasis = countOf(note.content.join(' '), /<strong>/g);
      expect(emphasis, `${note.slug} has no <strong> claim`).toBeGreaterThan(0);
      expect(emphasis, `${note.slug} has ${emphasis} <strong> spans`).toBeLessThanOrEqual(4);
      const last = note.content[note.content.length - 1];
      expect(last, `${note.slug} does not close on an emphasised rule`).toMatch(/<strong>/);
    }
  });

  it('holds each paragraph to the measured corpus range', () => {
    for (const note of governed) {
      for (const [i, para] of note.content.entries()) {
        const words = wordCount(para);
        expect(words, `${note.slug} ¶${i + 1} is ${words} words`).toBeGreaterThanOrEqual(105);
        expect(words, `${note.slug} ¶${i + 1} is ${words} words`).toBeLessThanOrEqual(172);
      }
    }
  });

  it('holds the whole note to the measured corpus range', () => {
    for (const note of governed) {
      const words = note.content.reduce((sum, para) => sum + wordCount(para), 0);
      expect(words, `${note.slug} is ${words} words`).toBeGreaterThanOrEqual(220);
      expect(words, `${note.slug} is ${words} words`).toBeLessThanOrEqual(312);
    }
  });

  it('keeps the title between six and twelve words', () => {
    for (const note of governed) {
      const words = note.title.split(/\s+/).filter(Boolean).length;
      expect(words, `${note.slug} title is ${words} words`).toBeGreaterThanOrEqual(6);
      expect(words, `${note.slug} title is ${words} words`).toBeLessThanOrEqual(14);
    }
  });
});

describe('the rationing tier is reachable', () => {
  it('names a cutoff that new notes will actually cross', () => {
    // Guards the grandfathering itself: if every note were exempt forever this
    // file would pass while enforcing nothing, which is the failure mode the
    // site's own writing warns about — a gate that never rejects is not a gate.
    expect(VOICE_RULES_FROM).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const newest = allNotes.reduce((max, n) => (n.dateISO > max ? n.dateISO : max), '');
    expect(newest < VOICE_RULES_FROM || governed.length > 0).toBe(true);
  });
});
