---
name: writer
description: Write or edit any user-facing prose on zhaoyu.io — engineering notes and blog posts, hero/bio copy, project and persona blurbs, the AI manifesto, footer manifesto lines, meta and OG descriptions, llms.txt. Use for every word a reader or an agent will see, including small edits to existing copy in frontend/src/lib/constants/content.ts. Triggers: "write a note", "draft a post", "add a note about X", "rewrite the bio", "tighten this copy", "update the hero", "new blog post".
---

# writer

Copy on this site is code: it lives in `frontend/src/lib/constants/content.ts` and ships
through the same lint/type/test gates as everything else. Writing here means editing
TypeScript and leaving the suite green.

The house style is claim-first, receipt-backed, and short. It comes from a specific
lineage — the Pyramid Principle by way of [lethain](https://lethain.com/pyramid-principle/)
(lead with the answer), Larson's rule to *invert the writing structure for reading*,
[jvns](https://jvns.ca/blog/2023/06/05/some-blogging-myths/) on honest hedging over
false authority, and [Willison](https://simonwillison.net/2022/Nov/6/what-to-blog-about/)
on shipping the thing you built rather than polishing drafts forever.

The voice is calibrated against named writers, not an abstract standard:
[references/calibration.md](references/calibration.md) holds the per-writer moves —
Will Larson (lethain) for register, Dan Koe for hooks and readability — including the
moves that are deliberately **not** adopted. Every draft runs its calibration check
before shipping. The one-line version: describe the work, never sell the worker —
a sentence that couldn't survive on lethain.com unedited is marketing, and marketing
is the register this site does not ship.

## What a note is for

The site's owner, 2026-09-26: *"I want to create posts that show the lesson I'm learning
from building agentic systems and the flows that drive impact to my learning and growing
as an AI Engineer,"* and *"I treat these as insights for myself as well."*

So a note has two readers. One is an engineer building agentic systems, who should leave
able to do something differently. The other is the author, for whom the note is the
record of an insight: what changed in practice, and why. A note that serves only the
first reader is a tutorial, and one that serves only the second is a diary entry. The
notes that belong here serve both. That is why a note shows the author's own before and
after, not only an observation about how a system behaved; says whether the change is
adopted (and where it is recorded) or still being learned; and names the agent-work
context in its own words. `writer-judge` enforces this as its worth test, run first on
every note and essay (surface copy has no lesson line and skips it).

## The six non-negotiables

1. **Claim first.** Sentence one states the claim or the observed failure. No windup, no
   "recently I've been thinking about," no definition of the topic.
2. **Every note carries a receipt.** A number, a named system, a cited study, or a specific
   incident you can point at. The site's own standard — *done without an attached artifact
   is self-attestation* — applies to its prose too.
3. **Never invent a receipt.** Do not fabricate a metric, headcount, dollar figure, date,
   or outcome. If a claim needs a number you don't have, ask, or write the sentence so it
   doesn't need one. Verified figures are listed in [references/surfaces.md](references/surfaces.md).
   **A mechanism is a receipt too.** The harder failure is not a made-up number but a
   true-sounding *causal story* no artifact records — crediting a change with a cost that
   predated it, or describing how something worked by reading the file at HEAD and
   narrating it as the past. Ten judge passes across two notes on 2026-09-10 failed this
   way, every one with the deterministic gates green. Read
   [references/receipts.md](references/receipts.md) before writing any sentence that says
   how something worked or what caused what.
   **A first-hand receipt names where and on what.** Every `sources` entry whose label
   begins "First-hand" carries `ref` (a commit sha, sha range, or `file:line`), `host`
   (windows, wsl, linux, macos, ci: the host the mechanism was verified on), and
   `verified_on` (YYYY-MM-DD). `frontend/scripts/draft-lint.mjs` refuses a draft
   without them, and `content-voice.test.ts` refuses a note dated on or after the
   schema's cutoff without them, from the same module. Measured 2026-09-11: a note
   whose only first-hand source was a label cleared three judges with a mechanism that
   was true on the judges' host and false on the incident's.
4. **Two paragraphs — unless it is an essay.** The note lane is exactly two, with no
   headers, bullets, or code blocks. The essay lane (`format: 'essay'`) is the only
   exception and carries its own contract — see [Long-form essays](#long-form-essays).
5. **Close on a rule, once.** The last sentence is a compressed, quotable rule — usually
   wrapped in `<strong>`. It must not restate the title, and it must be the *only*
   aphorism in the piece. A punchline at the end of every paragraph is the single
   strongest agent tell there is; see the cadence rule in
   [references/voice.md](references/voice.md).
6. **No em dashes. None.** Readers now take the glyph itself as the signature of
   machine-written prose, whatever the density, so it graduated from rationed to banned
   (2026-08-31; en dashes and double hyphens count too). Restructure the sentence
   instead of swapping punctuation: usually two sentences, sometimes a comma, rarely a
   colon. The shipped corpus was scrubbed on 2026-08-31 and the gate enforces zero across
   every note; the replacement moves and the one trap are in
   [references/voice.md](references/voice.md).

## The measured shape of a note

Parsed from the 13 shipped notes in the note lane (the essay is measured separately below).
The gate column is `SHAPE` in `frontend/src/lib/constants/voice-rules.ts`, the one source
both `content-voice.test.ts` and `scripts/draft-lint.mjs` import; never restate its numbers
anywhere as a rule of their own.

| | Range | Gate (`SHAPE`) | Target for a new note |
|---|---|---|---|
| Paragraphs | 2 (all 13) | exactly 2 | 2 |
| Words / paragraph | 103-173 | 105-172 | 110-160 |
| Words / note | 226-308 | 220-312 | 220-300 |
| Title words | 6-15 | 6-14 | 6-12 |
| Tags | 3 | exactly 3 | 3 |
| `<strong>` spans | | 1-4, one in the last paragraph | |

The word, title and `<strong>` gates apply to notes dated on or after `VOICE_RULES_FROM`
(2026-08-24); older notes are grandfathered by date, which is why the measured range runs
past the gate. Those recent notes are the current voice; the older ones run shorter and
thinner. Match the recent ones.

**Paragraph 1** — situation, complication, claim, mechanism. Name the failure mode
concretely enough that a reader recognizes it from their own week, then say *why* it
happens. Mechanism is the paragraph's job; a paragraph that only asserts is unfinished.

**Paragraph 2** — the corrective, its evidence, and the closing rule. This is where the
first-person experience lands ("I took one production prompt from ~4,000 words to ~1,300"),
where an outside source gets cited if there is one, and where the note earns its last line.

## Long-form essays

`format: 'essay'` is the lane for a piece that carries a taxonomy — several instances of
one failure class, a field guide, an argument that needs sections. Reach for it only when
two paragraphs genuinely cannot hold the material; the note is still the default, and a
thin essay is worse than a dense note.

The shape, measured from the corpus:

| | Target |
|---|---|
| Blocks | 18–25 |
| Words | 1,200–1,600 (hard range 900–2,500) |
| `<h2>` sections | 3–5 |
| Lists | at most one `<ul>` and one `<ol>` |
| Em dashes | 0 (banned; non-negotiable 6) |
| Paragraph-final aphorisms | 1, at the end |

`content-voice.test.ts` enforces a floor of 8 blocks and 2 `<h2>` sections, the 900 to 2,500
word range, whole-block markup, the closing `<strong>` rule, and the zero-dash ban across the
whole corpus (the shipped notes were scrubbed on 2026-08-31, so there is no grandfathered
set); the targets above are the editorial bar on top of that floor. **When a draft trips one of those,
fix the prose — never widen the gate.** A gate change ships only as a recorded owner
policy change, never in the same breath as the draft it would let through. The first essay shipped with the cap set to 3
because 3 was what the draft happened to need, and with list blocks skipped entirely, so
the densest block in the piece went unmeasured. That is the same defect the essay itself
warns about, committed by its own checker.

Structure is carried by the headings, not by sentences that announce it. Delete
"That is the failure class this post is about," "Two lessons:," "Two objections worth
pre-empting," "More of the same shape" — an essay that narrates its own outline reads
machine-made even when every individual sentence is good.

## Procedure

1. **Find the claim.** One sentence, falsifiable, that you actually believe. If you can't
   write it, there's no note yet — say so rather than padding. Prefer starting from an
   incident already written down and stating the rule it taught, over picking a thesis and
   hunting for a receipt that fits it; a receipt recruited to fit a thesis looks like it
   fits until someone checks the history. See
   [references/receipts.md](references/receipts.md).
1b. **Verify the receipts before drafting prose.** Every mechanism, sequence and figure,
   against the artifact at the right revision. This is cheap here and expensive after the
   prose exists, because a wrong mechanism usually takes the paragraph's structure with it.
2. **Structure before prose** — Larson's own drafting practice: plot the two paragraphs'
   load (claim + mechanism / corrective + rule) and the hook, iterate on *that* until it
   holds, then write. Restructuring an outline is cheap; restructuring finished prose isn't.
3. **Draft the title from the claim, not the topic.** "Thoughts on Agents" is a failure.
   "Agent Failures Are Loop Failures, Not Intelligence Failures" is the bar.
4. **Write both paragraphs**, then run the line-level checks in
   [references/voice.md](references/voice.md) and the calibration checks in
   [references/calibration.md](references/calibration.md). Lint the draft before it
   touches `content.ts`: save it as a JSON note (`slug`, `title`, `dateISO`, `tags`,
   `sources`, `content`, and `format` for an essay) and run
   `node scripts/draft-lint.mjs <draft.json>` from `frontend/` (exit 0 clean, 1 findings,
   2 could not run). Give it the real `dateISO`: the word, title and `<strong>` rules only
   apply from `VOICE_RULES_FROM` and the receipt schema only from `RECEIPT_SCHEMA_FROM`. A
   draft with no date, or a partial one, is reported as a `date` finding and linted as if
   dated today (`lintDraft` in `voice-rules.ts`), so it can no longer come back clean
   unchecked.
5. **Get judged.** Run the `writer-judge` skill in a context that did not author the
   draft (the authoring session spawns a fresh subagent per draft; see the judge's own
   SKILL.md for the independence rules, the draft-file contents, and the verdict
   contract). Blocking findings get fixed and re-judged; the verdict goes in the PR
   body. Self-review is self-attestation — the deterministic gates are the floor, the
   judge is the review.
6. **Ship it** using [references/publish.md](references/publish.md) — content.ts, llms.txt,
   OG regeneration, tests. Skipping the OG step breaks `og.test.ts`.

## Titles and tags

Title patterns already in the corpus, in descending frequency:

- `<Claim>, Not <The Thing People Assume>` — *Agent Failures Are Loop Failures, Not Intelligence Failures*
- `<Claim>: <Specific Case>` — *Reinforcement Anchors Beat Emphasis: Compressing a Production System Prompt*
- `Why I <Did The Unusual Thing>` — *Why I Made This Site Readable by Machines, Not Just Humans*

Title Case. Exactly 3 tags, reusing the existing vocabulary where one fits (see
[references/surfaces.md](references/surfaces.md)); invent a tag only for a genuinely new
subject.

## Everything that isn't a note

Hero, bio, projects, persona, footer manifesto, meta/OG descriptions, llms.txt, case
studies, the mental models and the AI manifesto each have their own constraints: length
caps, the single `roleTitle` spelling of the role, the OG card that tracks the hero,
agent-facing vs human-facing register. Read
[references/surfaces.md](references/surfaces.md) before touching any of them.

## When the answer is "don't publish this"

Say it. A note with no receipt, no mechanism, or no claim you'd defend in a review is worse
than no note — this site's entire argument is that it doesn't ship unverified work. Offer
the missing piece as a question instead of writing around the gap.
