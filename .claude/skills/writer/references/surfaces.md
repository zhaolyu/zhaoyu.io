# Surfaces, constraints, and verified facts

Everything below lives in `frontend/src/lib/constants/content.ts` unless noted.

## Verified figures — use these, never invent new ones

**The disclosure policy governs this table.** Versant is a public company: every
employer-related number on any surface must carry a public source from `SOURCES`
in `content.ts`, and `disclosure-guard.test.ts` scans copy, `og.ts`,
`structured-data.ts`, `llms.txt`, and the page roots against a deny-list.
Add a new figure to `SOURCES` (with its public citation) before using it in prose.

| Fact | Value | Source |
|---|---|---|
| CNBC digital audience | ~47M monthly unique visitors (ComScore) | Versant Investor Day deck, Dec 2025, slide 66 |
| CNBC.com field performance | 1.7s p75 LCP, all devices, Jul 2026 | Chrome UX Report (public field data) |
| Org | 20 engineers, 3 web teams, CNBC Core (Versant) | LinkedIn / role of record |
| Production years | 9+ (intern 2016 → Senior Manager 2026) | Career timeline |
| Next-gen platform + AI investing tools | Public cover: Versant Q2-2026 earnings call | Lazarus quote, 6 Aug 2026 |
| Running | 3:07 marathon, 50K ultra finish | Personal record |

**Deny-listed — never write these, even if you find them in old copy or git
history:** `50M+`, `1.1s LCP`, `Top 1%`, `<300ms TTFB`, `98.4%` cache hit,
subscription ARR or subscriber counts, AI-assistant beta size or pipeline
internals, unannounced video roadmap items, internal governance metrics
(velocity/defect percentages), "sole frontend architect", "I own the".
The AI work is described only as "leading the frontend architecture for the
AI-powered investing tools in CNBC's next-generation platform" until CNBC
announces the product.

## One story on every surface

There is no positioning flag — `goLoudPositioning` was removed. Hero, narrative
bio, social descriptions, JSON-LD, and `llms.txt` all tell the same story:
loud on role and outcomes, quiet on internals. `positioning.test.ts` enforces
the shared title/employer string, the 40-word headline cap, and the one-figure
bio; run it after touching any of those surfaces. `FEATURE_FLAGS.showCnbcAiWork`
still exists, but nothing gated by it lives in the repo until CNBC announces —
a flag hides a card, not the shipped bundle.

## Surface specs

**Engineering notes** (`notesData.notes`) — see the main SKILL.md. Newest first; `date` is
display ("Aug 2026"), `dateISO` is `YYYY-MM`. RSS sorts defensively but the array is
maintained newest-first.

**Hero** (`heroContent`) — badge is the title line, all caps, separated by `·`. `headline.primary`
is a short declarative sentence ending in a period. `headline.accent` is the positioning
claim, one line. `bio` is one dense paragraph, 40–60 words, at most one figure (enforced by
`positioning.test.ts`), ending on what the reader gets. `motto` is three two-word phrases.

**Projects** (`projectsData.projects`) — `description` is one paragraph, 55–80 words,
structured as: what was architected → the technical move → the measured result. Two `metrics`
each, label in caps. 4 tags. Lead with the architecture decision, not the company.

**Narrative bio** (`narrativeBio`) — 3–4 paragraphs. Paragraph 1 is the career arc as a
*deliberate* sequence (the IC→EM→IC→EM path is the point, "a choice, not a detour").
Paragraph 2 is AI governance. Final paragraph is the running/discipline close. Keep the
through-line: player-coach by design.

**Persona** (`personaData`) — 2 operating-principle cards rendered inside the
"How I work" section, each `title` + 2 short paragraphs (35–55 words each). Each
card ties an engineering principle to its business consequence.

**Footer manifesto** (`footerManifesto`) — 4 items. `title` is 3–5 words, ideally an
asymmetric comparison (`URL > Store`, `Server > Client`). `body` is one sentence, 20–30 words,
stating the rule and its justification.

**Social descriptions** (`socialDescriptions`, a plain constant) — `meta` caps at
160 characters (enforced); `twitter` is shorter and drops the numbers.

**Code standards** (`codeStandards`) — `bad` / `good` snippet pairs with a `note`. The bad
snippet must be a real trap someone would write, commented with why it fails; the good one
must be the minimal correct version, not an idealized rewrite.

**AI manifesto** (`src/routes/(standalone)/ai-manifesto/+page.svelte`) — longer form, its
own layout. Same voice, but this is the one place where a thesis may run past two paragraphs.
Keep it consistent with whatever the notes currently argue; if a note contradicts the
manifesto, one of them is out of date.

**`static/llms.txt`** — hand-curated prose for agents. Plain text, no marketing register,
no positioning flag. Every note link must resolve to a live slug and the newest note must
appear (`llms-links.test.ts` enforces both).

## Note tag vocabulary

Reuse before inventing:

`AI Engineering` · `Agent Architecture` · `Reliability` · `Engineering Management` ·
`Architecture` · `Distributed Systems` · `LLM Mechanics` · `System Prompt Architecture` ·
`Specification` · `HCI` · `React Performance` · `State Management` · `API Design` ·
`Backend` · `Edge Computing` · `Performance` · `Productivity` · `Career` · `SEO` ·
`Structured Data` · `UX` · `Independence` · `Meta` · `60fps`
