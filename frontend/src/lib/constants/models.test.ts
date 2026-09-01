import { describe, it, expect } from 'vitest';
import {
  MENTAL_MODELS,
  TEASER_COUNT,
  teaserModels,
  mentalModel,
  modelProblems,
  noteSlugSet,
  receiptDomains,
} from './models';

const noteSlugs = noteSlugSet();

describe('mental models registry', () => {
  it('publishes every model with a rule, a mechanism, receipts and a named origin', () => {
    for (const model of MENTAL_MODELS) {
      expect(modelProblems(model, noteSlugs), `problems in ${model.id}`).toEqual([]);
    }
  });

  it('requires receipts from at least two distinct domains', () => {
    // This is the whole distinction the page exists to hold: a claim that only
    // pays off in engineering is a heuristic and belongs in codeStandards.
    for (const model of MENTAL_MODELS) {
      expect(
        receiptDomains(model).length,
        `${model.id} spans too few domains`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it('rejects a single-domain model', () => {
    // Negative control: without this, the assertion above passes trivially if
    // receiptDomains is ever weakened to return a constant.
    const singleDomain = {
      ...MENTAL_MODELS[0],
      receipts: [{ domain: 'engineering' as const, text: 'One receipt, one domain.' }],
    };
    expect(modelProblems(singleDomain, noteSlugs)).toContainEqual(
      expect.stringContaining('a model needs 2 or it is a heuristic'),
    );
  });

  it('keeps ids unique and stable-looking', () => {
    const ids = MENTAL_MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolves every linked note against the shipped corpus', () => {
    for (const model of MENTAL_MODELS) {
      if (model.note) expect(noteSlugs.has(model.note), `${model.id} -> ${model.note}`).toBe(true);
    }
  });

  it('states each rule as one sentence', () => {
    for (const model of MENTAL_MODELS) {
      // The rule is the quotable line. Two sentences means it is a paragraph.
      const sentences = model.rule.split(/(?<=[.?!])\s+(?=[A-Z"“])/).filter(Boolean);
      expect(sentences.length, `${model.id}: "${model.rule}"`).toBeLessThanOrEqual(2);
      // Terminal punctuation, allowing a sentence that closes inside a quote.
      expect(model.rule.trim(), `${model.id} rule needs terminal punctuation`).toMatch(
        /[.?!]["'\u201d\u2019]?$/,
      );
    }
  });

  it('carries no em dashes anywhere in the registry', () => {
    // writer skill non-negotiable 6. content-voice.test.ts covers notesData;
    // a new surface with its own constant file would otherwise sit outside it.
    for (const model of MENTAL_MODELS) {
      const prose = [
        model.rule,
        model.mechanism,
        model.origin.label,
        ...model.receipts.map((r) => r.text),
      ].join(' ');
      expect(prose, `${model.id} contains a dash`).not.toMatch(/[—–]|(?<!-)--(?!-)/);
    }
  });

  it('gives an https link to every origin that claims one', () => {
    for (const model of MENTAL_MODELS) {
      if (model.origin.href) expect(model.origin.href).toMatch(/^https:\/\//);
    }
  });

  it('names a first-hand origin explicitly rather than leaving it blank', () => {
    // The provenance analogue of content.test.ts's unlinked-source rule: an
    // origin with no link has to say what it is, not trail off.
    for (const model of MENTAL_MODELS) {
      if (!model.origin.href) {
        expect(model.origin.label.length, `${model.id} origin is too thin`).toBeGreaterThan(20);
      }
    }
  });

  it('has enough models to fill the landing teaser', () => {
    expect(MENTAL_MODELS.length).toBeGreaterThanOrEqual(TEASER_COUNT);
    expect(teaserModels()).toHaveLength(TEASER_COUNT);
  });

  it('looks models up by id and returns undefined for an unknown one', () => {
    expect(mentalModel(MENTAL_MODELS[0].id)).toBe(MENTAL_MODELS[0]);
    expect(mentalModel('not-a-model')).toBeUndefined();
  });
});
