# Landing page rethink — audit and proposal

Status: proposal, awaiting Zhao's direction on the open decisions at the bottom.
Produced on the `claude/zhaoyu-landing-page-audit-hek2li` branch, 2026-08-31.
Companion change, already landed on this branch: the `writer` skill now calibrates
against named writers (`.claude/skills/writer/references/calibration.md`) — Larson for
register, Koe for readability — and its register test ("would this sentence survive on
lethain.com unedited?") is the same test this audit applies to the page.

## The diagnosis

The page's problem is not the content — it is the information architecture and the
register of the top three screens. The craft material already exists and is strong; it
is just subordinated to the résumé material.

**Current section order** (`frontend/src/routes/(main)/+page.svelte:61-69`):

| # | Section | What it is | Register |
|---|---|---|---|
| 1 | Hero | Job title badge, positioning headline, scope claim, motto chips | résumé |
| 2 | Skills ("Impact at Scale") | 4-metric grid: 47M uniques, 1.7s LCP, team size, years | half platform, half résumé |
| 3 | WorkSection | Employer project cards + independent builds | mixed |
| 4 | EngineeringNotes | The 13 notes and essays — the actual thinking | craft |
| 5 | CodeManifesto (+ LatencySim) | bad/good code standards — actual mental models | craft |
| 6 | PersonaSection | Narrative bio + career timeline | résumé |
| 7 | Connect | Contact | — |

A reader gets two and a half screens of "who employs me and at what scope" before the
first sentence of thinking. The mental models — the footer manifesto's `URL > Store`,
`WET > DRY`, the code standards, the notes' named models (fail-open checks, the receipts
rule) — are the best material on the site and they live in positions 4, 5, and the
literal page footer.

## Findings, specific

1. **The hero headline is a value proposition about its author.**
   `content.ts:68` — "I lead engineering teams that turn platform performance into
   audience and revenue." Its own doc comment says who it is for: "Written for a
   Director / Head-of-Engineering reader" (`content.ts:60`). That is LinkedIn-headline
   register — a sentence whose job is positioning, not explaining. It fails the writer
   skill's own register test.

2. **One scope claim, repeated ~6 times on one page.** "Player-coach" + the
   8+2/~20-engineer headcount appears in the hero accent (`content.ts:70`), the tagline
   (`:73`), both social descriptions (`:634-636`), the OG title (`+page.svelte:41`), the
   narrative bio title and body (`:617-619`), and the 2026 timeline note (`:501`).
   Stated once, scope is a fact; stated six times, it is a campaign.

3. **The metrics grid ranks résumé facts as impact.** Two of the four "Impact at Scale"
   cards are "Direct team: 8 + 2 QE" and "Years shipping: 10+" (`content.ts:112-127`).
   The receipts discipline (every figure public and linked) is genuinely differentiating
   — but team size and tenure are not impact, they are biography. Sitting beside 47M
   uniques and 1.7s LCP in section 2, they tip the whole grid from "receipts" to
   "pitch."

4. **Employer-marketing language inside work cards.** "…television's most affluent and
   educated weekday daytime audience, 27 quarters running" (`content.ts:530`) is
   Versant's investor-deck voice, sourced or not. Same family: "the direct-to-consumer
   bet Versant has described to investors" (`:561`). A craft page describes the
   engineering problem; the audience-quality superlative is the employer selling itself
   through the portfolio.

5. **Motto chips are brand-speak.** "Low Latency · High Leverage · Deep Focus"
   (`content.ts:79`) is a personal brand tagline. The footer manifesto items do the
   same job with actual content.

6. **The craft assets are underweighted, not missing.**
   - 13 notes, including two essays ("Your Checks Are Lying to You" is the single
     realest artifact on the site) — position 4.
   - `codeStandards` bad/good pairs — position 5.
   - `footerManifesto` — four genuine mental models — the footer.
   - Case-study decision records at `/work/{slug}` — linked from cards.

   Compare lethain.com: the homepage *is* the writing; the bio is one line. That is the
   shape of a craft-first site, and every asset needed to adopt it already exists here.

## Proposal

### Option A — writer-first restructure (recommended)

Reorder to: **Hero (rewritten) → Writing → Mental models → Selected work → About →
Connect**, with the register fixed as sections move.

1. **Hero.** Drop the all-caps job-title badge (role stays in `<title>`, JSON-LD, and
   About). Headline becomes a craft thesis in plain first person — what he works on and
   the standard the site holds itself to (the receipts rule is the natural candidate:
   it is the site's most distinctive idea and already its enforcement mechanism).
   One or two sentences, no numbers. CTA primary flips to "Read the notes"; "Selected
   work" becomes secondary. Motto chips deleted.
2. **Writing moves to section 2.** Rename from "Digital Garden / Engineering Notes" to
   just "Writing" or "Notes." Lead with the two essays, then the note grid.
3. **Mental models become a real section (3).** Merge `footerManifesto` (the four
   rules) with `codeStandards` (the evidence for them) and the two `personaData`
   operating principles into one section — each model stated as a rule, with the
   bad/good pair or a linked note as its receipt. This is the section the current page
   scattered across positions 5, 6, and the footer.
4. **Selected work compacts to section 4.** Keep decision-record framing; strip the
   employer-marketing sentences (finding 4). Fold the two *platform* metrics (47M,
   1.7s LCP) into the migration card where they are evidence for a specific decision —
   the standalone "Impact at Scale" grid dissolves.
5. **About (5) absorbs the résumé.** Team size, years, the player-coach story, and the
   timeline all live here — stated once, with sources. This is the one place the
   Director-reader copy belongs, and it keeps every disclosure-policy guarantee intact.
6. **Unchanged:** receipts/disclosure discipline everywhere, JSON-LD, llms.txt, the
   scope-claim constraints in `positioning.test.ts` (the *claims* stay identical; only
   their frequency and placement change).

### Option B — register-only pass (lighter)

Keep the section order. Rewrite the hero headline/bio in the calibrated register, delete
the motto chips, cut the duplicate scope claims down to hero-accent + bio, demote the
two résumé metrics out of the grid (leaving 47M + 1.7s), and strip the
employer-marketing sentences. Roughly a copy-only PR against `content.ts` plus small
test updates. Improves the smell without changing what the page argues first.

**Recommendation: A, staged as two PRs** — copy/register first (it is most of the win
and low-risk), structure second. B is a fallback if A feels like too much motion before
the next-gen rebuild ships.

**Either option folds in the em-dash scrub.** The em dash is banned for new prose as of
2026-08-31 (writer skill non-negotiable 6; `content-voice.test.ts` enforces zero for
notes dated from the cutoff). Surface copy (hero, bio, projects, persona, footer, meta)
has no date field to grandfather by, so it gets scrubbed the moment the register pass
rewrites it. The shipped notes keep their dashes until each is next edited; a dedicated
scrub of the two essays is a separate editorial decision, since it rewrites published
prose.

## Test and surface impact (Option A)

- `positioning.test.ts` — shared title/employer string, 40-word headline cap, one-figure
  bio: all touched by the hero rewrite; update the expectations alongside the copy, never
  widen the scope-claim rules themselves.
- `content.test.ts` — metric basis/source rules survive; the grid's data moves, so
  selectors over `performanceMetrics` need review if the constant is split or renamed.
- `disclosure-guard.test.ts` — unaffected in principle (it walks every route); re-run.
- `og.test.ts` + `pnpm og` — OG title/description change with the hero; regenerate.
- `llms.txt` + `socialDescriptions` + JSON-LD — keep telling one story ("one story on
  every surface" rule): if the page leads with craft, the meta description should too.
- `design-system.ts` registry + `/design-system` previews — section changes must be
  reflected there or the preview pages drift.

## Open decisions (need Zhao)

1. **A or B** — full restructure or register-only pass?
2. **`<title>` and OG:** keep "Senior Manager, Engineering at Versant (CNBC Core)" for
   search/recruiter surfaces while the page body leads with craft, or move the whole
   identity to craft-first? (Keeping it is defensible: `<title>` is a finding aid, not
   the page's argument.)
3. **Hero thesis:** the receipts rule, the fail-open-checks idea, or a plainer "what I
   work on" sentence? (Draft candidates should go through the `writer` skill — it now
   carries the calibration for exactly this.)
4. **Does "Impact at Scale" survive anywhere?** Proposal says no as a standalone grid;
   the numbers survive attached to the work that produced them.
