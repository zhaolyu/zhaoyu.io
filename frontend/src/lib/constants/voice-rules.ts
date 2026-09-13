// Voice rules, one source. content-voice.test.ts is the gate on content.ts;
// scripts/draft-lint.mjs is the same gate on a draft that is not in content.ts
// yet. The two used to be separate statements of the same numbers and drifted:
// the writer skill said 110-160 words per paragraph, the test said 105-172.
// Every rule below is stated once and imported by both. Node 24 strips the
// types at import time, so the CLI needs no build step.

export interface SourceLike {
  label?: string;
  href?: string;
  /** Commit sha, sha range, or file:line where a first-hand claim can be checked. */
  ref?: string;
  /** The host the mechanism was verified on: windows, wsl, linux, macos, ci. */
  host?: string;
  /** YYYY-MM-DD. */
  verified_on?: string;
}

export interface NoteLike {
  slug?: string;
  title?: string;
  dateISO?: string;
  format?: string;
  tags?: string[];
  content?: string[];
  sources?: SourceLike[];
}

export interface Finding {
  rule: string;
  where: string;
  detail: string;
}

/** Rules the 2025 notes predate are enforced from this date onward. */
export const VOICE_RULES_FROM = '2026-08-24';
/** First-hand sources must carry {ref, host, verified_on} from this date onward. */
export const RECEIPT_SCHEMA_FROM = '2026-09-12';

export const plain = (html: string): string =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&#?[a-zA-Z0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const wordCount = (html: string): number => plain(html).split(' ').filter(Boolean).length;
export const countOf = (haystack: string, pattern: RegExp): number =>
  (haystack.match(pattern) || []).length;
export const withoutCode = (html: string): string =>
  html.replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, ' ');

/** Throat-clearing and LLM-tell vocabulary. A ratchet, not a cleanup. */
export const BANNED_PHRASES: string[] = [
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

/** The corpus's dominant rhetorical move: fine once, a tic twice. */
export const X_NOT_Y = /\bis not\b[^.;]{2,60}?,\s*it(?:'s| is)\b/gi;
/** Em dash, en dash, or double hyphen: every glyph that does the dash's job. */
export const DASH = /—|–|--/;

export const isGoverned = (note: NoteLike): boolean => (note.dateISO || '') >= VOICE_RULES_FROM;
export const isEssay = (note: NoteLike): boolean => note.format === 'essay';
export const isBlock = (chunk: string): boolean =>
  /^<(h[1-6]|ul|ol|blockquote|pre|figure)\b/.test(chunk);
export const hasBlockMarkup = (chunk: string): boolean => /<(h[1-6]|ul|ol|li|pre)\b/i.test(chunk);

/** Shape caps, the measured corpus range. Stated here and nowhere else. */
export const SHAPE = {
  tags: 3,
  standard: {
    paragraphs: 2,
    paraWords: [105, 172] as const,
    totalWords: [220, 312] as const,
    titleWords: [6, 14] as const,
    strongMax: 4,
  },
  essay: { minBlocks: 8, minH2: 2, words: [900, 2500] as const },
};

/**
 * Lint one note against every rule content-voice.test.ts enforces.
 * Empty result means clean.
 */
export function lintNote(note: NoteLike): Finding[] {
  const f: Finding[] = [];
  const push = (rule: string, where: string, detail: string) => f.push({ rule, where, detail });
  const content = Array.isArray(note.content) ? note.content : [];
  const essay = isEssay(note);
  const governed = !essay && isGoverned(note);

  if (!Array.isArray(note.tags) || note.tags.length !== SHAPE.tags)
    push('tags', 'note', `${(note.tags || []).length} tags, need exactly ${SHAPE.tags}`);

  if (!essay) {
    if (content.length !== SHAPE.standard.paragraphs)
      push(
        'paragraphs',
        'note',
        `${content.length} paragraphs, need exactly ${SHAPE.standard.paragraphs}`,
      );
    content.forEach((p, i) => {
      if (hasBlockMarkup(p))
        push('block-markup', `¶${i + 1}`, 'heading, list, or code block inside a note');
    });
  } else {
    if (content.length < SHAPE.essay.minBlocks)
      push(
        'essay-blocks',
        'essay',
        `${content.length} blocks, need at least ${SHAPE.essay.minBlocks}`,
      );
    const h2 = content.filter((c) => /^<h2\b/.test(c)).length;
    if (h2 < SHAPE.essay.minH2)
      push('essay-h2', 'essay', `${h2} h2 sections, need at least ${SHAPE.essay.minH2}`);
    const words = content.reduce((s, c) => s + wordCount(c), 0);
    const [lo, hi] = SHAPE.essay.words;
    if (words < lo || words > hi) push('essay-words', 'essay', `${words} words, need ${lo}..${hi}`);
    content.forEach((c, i) => {
      if (!isBlock(c) && hasBlockMarkup(c))
        push('block-markup', `block ${i + 1}`, 'block markup inside a paragraph');
    });
    if (!/<strong>/.test(content[content.length - 1] || ''))
      push('closing-strong', 'essay', 'does not close on an emphasised rule');
  }

  content.forEach((p, i) => {
    if (countOf(plain(p), /!/g) > 0) push('exclamation', `¶${i + 1}`, 'exclamation point');
  });
  const prose = plain(content.join(' ')).toLowerCase();
  const hits = BANNED_PHRASES.filter((b) => prose.includes(b));
  if (hits.length) push('banned-phrase', 'note', hits.join(', '));
  const xy = countOf(plain(content.join(' ')), X_NOT_Y);
  if (xy > 1) push('x-not-y', 'note', `used ${xy} times, at most 1`);

  if (DASH.test(note.title || '')) push('dash', 'title', 'em dash, en dash, or double hyphen');
  content.forEach((c, i) => {
    const n = countOf(withoutCode(c), new RegExp(DASH.source, 'g'));
    if (n > 0) push('dash', `block ${i + 1}`, `${n} dash(es) outside <code>`);
  });

  if (governed) {
    const em = countOf(content.join(' '), /<strong>/g);
    if (em === 0) push('closing-strong', 'note', 'no <strong> claim');
    if (em > SHAPE.standard.strongMax)
      push('strong-count', 'note', `${em} <strong> spans, at most ${SHAPE.standard.strongMax}`);
    if (!/<strong>/.test(content[content.length - 1] || ''))
      push('closing-strong', 'note', 'does not close on an emphasised rule');
    let total = 0;
    const [plo, phi] = SHAPE.standard.paraWords;
    content.forEach((p, i) => {
      const w = wordCount(p);
      total += w;
      if (w < plo || w > phi) push('para-words', `¶${i + 1}`, `${w} words, need ${plo}..${phi}`);
    });
    const [tlo, thi] = SHAPE.standard.totalWords;
    if (total < tlo || total > thi)
      push('total-words', 'note', `${total} words, need ${tlo}..${thi}`);
    const tw = (note.title || '').split(/\s+/).filter(Boolean).length;
    const [wlo, whi] = SHAPE.standard.titleWords;
    if (tw < wlo || tw > whi) push('title-words', 'title', `${tw} words, need ${wlo}..${whi}`);
  }
  return f;
}

const FIRSTHAND = /^first-hand\b/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Receipt schema. A first-hand source is a claim about the author's own
 * system, so it names where it can be checked (`ref`), the host the mechanism
 * was verified on (`host`), and when (`verified_on`). Written from the
 * 2026-09-11 failure where three judges verified a Windows incident on Linux.
 */
export function lintReceipts(note: NoteLike): Finding[] {
  const f: Finding[] = [];
  const sources = Array.isArray(note.sources) ? note.sources : [];
  if (sources.length === 0)
    f.push({
      rule: 'sources',
      where: 'note',
      detail: 'no sources; every note carries at least one',
    });
  sources.forEach((s, i) => {
    if (!FIRSTHAND.test(String(s.label || ''))) return;
    const where = `sources[${i}]`;
    if (!s.ref || typeof s.ref !== 'string')
      f.push({
        rule: 'receipt-ref',
        where,
        detail: 'first-hand source has no ref (commit sha or file:line)',
      });
    if (!s.host || typeof s.host !== 'string')
      f.push({
        rule: 'receipt-host',
        where,
        detail: 'first-hand source names no host the mechanism was verified on',
      });
    if (!s.verified_on || !DATE.test(String(s.verified_on)))
      f.push({
        rule: 'receipt-date',
        where,
        detail: 'first-hand source has no verified_on date (YYYY-MM-DD)',
      });
  });
  return f;
}

export const receiptSchemaApplies = (note: NoteLike): boolean =>
  (note.dateISO || '') >= RECEIPT_SCHEMA_FROM;
