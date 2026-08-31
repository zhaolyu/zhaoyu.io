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

## The six non-negotiables

1. **Claim first.** Sentence one states the claim or the observed failure. No windup, no
   "recently I've been thinking about," no definition of the topic.
2. **Every note carries a receipt.** A number, a named system, a cited study, or a specific
   incident you can point at. The site's own standard — *done without an attached artifact
   is self-attestation* — applies to its prose too.
3. **Never invent a receipt.** Do not fabricate a metric, headcount, dollar figure, date,
   or outcome. If a claim needs a number you don't have, ask, or write the sentence so it
   doesn't need one. Verified figures are listed in [references/surfaces.md](references/surfaces.md).
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
   colon. The gate enforces zero for anything dated from the cutoff on; the replacement
   moves and the one trap are in [references/voice.md](references/voice.md).

## The measured shape of a note

Parsed from all 12 existing notes:

| | Range | Target for a new note |
|---|---|---|
| Paragraphs | 2 (all 12) | 2 |
| Words / paragraph | 41–172 | 110–160 |
| Words / note | 103–310 | 220–300 |
| Title words | 4–14 | 6–12 |
| Tags | 3 | 3 |

The 2026 notes are the current voice; the 2025 ones are shorter and thinner. Match the
recent ones.

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

`content-voice.test.ts` enforces the block count, heading count, word range, whole-block
markup, the closing `<strong>` rule, and the zero-dash ban for anything dated 2026-08-31
or later. The old two-per-paragraph em-dash cap and density ceiling stay in the suite as
ratchets over the grandfathered corpus. **When a draft trips one of those,
fix the prose — never widen the gate.** The first essay shipped with the cap set to 3
because 3 was what the draft happened to need, and with list blocks skipped entirely, so
the densest block in the piece went unmeasured. That is the same defect the essay itself
warns about, committed by its own checker.

Structure is carried by the headings, not by sentences that announce it. Delete
"That is the failure class this post is about," "Two lessons:," "Two objections worth
pre-empting," "More of the same shape" — an essay that narrates its own outline reads
machine-made even when every individual sentence is good.

## Procedure

1. **Find the claim.** One sentence, falsifiable, that you actually believe. If you can't
   write it, there's no note yet — say so rather than padding.
2. **Structure before prose** — Larson's own drafting practice: plot the two paragraphs'
   load (claim + mechanism / corrective + rule) and the hook, iterate on *that* until it
   holds, then write. Restructuring an outline is cheap; restructuring finished prose isn't.
3. **Draft the title from the claim, not the topic.** "Thoughts on Agents" is a failure.
   "Agent Failures Are Loop Failures, Not Intelligence Failures" is the bar.
4. **Write both paragraphs**, then run the line-level checks in
   [references/voice.md](references/voice.md) and the calibration checks in
   [references/calibration.md](references/calibration.md).
5. **Ship it** using [references/publish.md](references/publish.md) — content.ts, llms.txt,
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

Hero, bio, projects, persona, footer manifesto, meta/OG descriptions, llms.txt and the AI
manifesto each have their own constraints — length caps, the `goLoudPositioning` flag,
agent-facing vs human-facing register. Read
[references/surfaces.md](references/surfaces.md) before touching any of them.

## When the answer is "don't publish this"

Say it. A note with no receipt, no mechanism, or no claim you'd defend in a review is worse
than no note — this site's entire argument is that it doesn't ship unverified work. Offer
the missing piece as a question instead of writing around the gap.
