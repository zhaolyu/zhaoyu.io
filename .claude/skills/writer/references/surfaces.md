# Surfaces, constraints, and verified facts

Everything below lives in `frontend/src/lib/constants/content.ts` unless noted.

## Verified figures — use these, never invent new ones

| Fact | Value |
|---|---|
| CNBC.com LCP | 1.1s (top 1%) |
| Monthly users | [redacted] |
| Akamai TTFB | [redacted], global |
| Edge cache hit rate | [redacted] |
| Production years | 9+ |
| Org | 20 engineers, 3 web teams, CNBC Web & Make It (Versant) |
| CNBC.com business | [redacted]–55M ARR, [redacted] subscribers |
| AI assistant | [redacted] beta cohort — a pilot, **not** a site-wide surface |
| AI governance outcome | [redacted] increase, [redacted] high-severity defects |
| Running | 3:07 marathon, 50K ultra finish, sub-1:25 half in the crosshairs |

Two standing accuracy rules the copy already enforces: the AI assistant is described as a
beta pilot, and the title ("Senior Manager, Engineering") is stated as fact in both
positioning variants. Don't let a rewrite inflate either.

## The positioning flag

`FEATURE_FLAGS.goLoudPositioning` (in `config.ts`) switches hero, narrative bio, and social
descriptions between a **stealth** variant (scope, no surface-ownership claims) and a
**go-loud** variant (explicit ownership of the AI and video surfaces).

- Any edit to hero / narrative bio / social descriptions must be made in **both** variants,
  or deliberately in one with a comment saying which.
- `positioning.test.ts` asserts both states. Run it after any change there.
- Agent-facing copy (JSON-LD, `llms.txt`) deliberately does **not** follow the flag. Keep it
  factual and flag-independent.

## Surface specs

**Engineering notes** (`notesData.notes`) — see the main SKILL.md. Newest first; `date` is
display ("Aug 2026"), `dateISO` is `YYYY-MM`. RSS sorts defensively but the array is
maintained newest-first.

**Hero** (`heroContent`) — badge is the title line, all caps, separated by `·`. `headline.primary`
is a short declarative sentence ending in a period. `headline.accent` is the positioning
claim, one line. `bio` is one dense paragraph, 55–75 words, ending on the performance
credentials. `motto` is three two-word phrases.

**Projects** (`projectsData.projects`) — `description` is one paragraph, 55–80 words,
structured as: what was architected → the technical move → the measured result. Two `metrics`
each, label in caps. 4 tags. Lead with the architecture decision, not the company.

**Narrative bio** (`narrativeBio`) — 3–4 paragraphs. Paragraph 1 is the career arc as a
*deliberate* sequence (the IC→EM→IC→EM path is the point, "a choice, not a detour").
Paragraph 2 is AI governance. Final paragraph is the running/discipline close. Keep the
through-line: player-coach by design.

**Persona** (`personaData`) — 4 cards, each `title` + exactly 2 short paragraphs (35–55 words
each). This is the one surface where personality outranks receipts, but each card still
lands on a concrete: a metric, a cuisine, a market.

**Footer manifesto** (`footerManifesto`) — 4 items. `title` is 3–5 words, ideally an
asymmetric comparison (`URL > Store`, `Server > Client`). `body` is one sentence, 20–30 words,
stating the rule and its justification.

**Social descriptions** (`buildSocialDescriptions`) — `meta` caps at ~160 characters (it's
also what `noteExcerpt` truncates to); `twitter` is shorter and drops the numbers. Both
follow the positioning flag.

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
