---
name: writer-judge
description: Independent verdict on a zhaoyu.io draft before it ships — notes, essays, hero and surface copy, llms.txt, the AI manifesto. Runs the judgment-layer checks the deterministic gates cannot see (cadence, register, receipts integrity, transformation) in a context that did not author the draft. Use after the writer skill produces a draft and before the publish checklist. Triggers: "judge this draft", "run the writer judge", "is this ready to ship", "review this note before publishing".
---

# writer-judge

The deterministic gates (`content-voice.test.ts`, `positioning.test.ts`,
`disclosure-guard.test.ts`) are the floor: shape, dashes, banned phrases, scope claims,
unsourced figures by pattern. They cannot see whether a claim is worth publishing,
whether the cited source actually supports it, whether the cadence reads machine-made,
or whether a sentence is marketing. That is judgment, and judgment gets the same
treatment the vault gives it: a maker-checker pass in a context that did not author the
work. A draft ships only after both layers.

Scope: mandatory for a new note or essay, and for any rewrite of hero, bio, manifesto,
or llms.txt copy. Skip it for mechanical edits (a date bump, a link fix, a schema
field); judging those is process for its own sake.

## The structural rule: the judge is never the author

Self-review is self-attestation by the party most motivated to claim success. The
site's own line, applied to the site.

- **If this session wrote or edited the draft, do not judge inline.** Spawn a fresh
  subagent whose prompt contains only: the path to this SKILL.md, where the draft
  lives, and which surface it is. No session history, no drafting rationale, no "the
  author intended." The subagent reads the skill and the draft cold, exactly the way a
  reader will.
- **Tier**: the judge runs at or above the tier that authored the draft, never below.
- **The judge never edits.** It returns findings; the author fixes and resubmits. A
  judge that rewrites is a second author, and the second author's prose is unjudged.
- A session that did not author the draft (a cold review session) may judge inline.
  The independence criterion is the context, not the tool.

## Verdict contract: three outcomes

**PASS** / **FAIL** / **COULD-NOT-RUN**. Could-not-run is loud, never folded into
pass: the draft was not locatable, the rubric or references were missing, the surface
type was ambiguous, or the deterministic gates visibly had not run (a dash or banned
phrase in the text means the floor is missing, and judging on top of a missing floor
certifies nothing).

Findings are anchored, not vibes:

| # | Quoted sentence or count | Rule violated (file and rule) | Blocking or advisory |

The verdict and findings table go into the PR body, verbatim. That is the verdict's
named consumer; a judgment recorded nowhere is coverage that only looks like coverage.

## Rubric: counts before impressions

Run in order. Every finding must quote its evidence or show its arithmetic.

1. **Claim test.** State the draft's claim in one sentence after one read. If you
   cannot, or the claim is a topic rather than an assertion someone could dispute,
   FAIL. A note with no falsifiable claim has no reason to ship.
2. **Receipts integrity.** List every figure, named outcome, and factual assertion.
   Each must trace to a listed source or the verified-figures table in
   `../writer/references/surfaces.md`. Two distinct failures, both blocking: a figure
   with no source (invented receipt), and a source that does not actually support the
   sentence citing it (decorative citation). Employer-related figures not in the
   verified table are a disclosure risk on top.
3. **Cadence arithmetic** (from `../writer/references/voice.md`):
   - Extract every paragraph-final sentence as a list. Count the epigrams. More than
     one per piece blocks.
   - Count mid-sentence hinges (colons, semicolons). More than one per 30 words
     blocks.
   - Count `<strong>` spans against the lane's cap; flag emphasis doing the work an
     argument should.
   - Any em dash, en dash, or `--` outside `<code>`: the gates have not run.
     COULD-NOT-RUN, not a finding.
4. **Register** (from `../writer/references/calibration.md`):
   - Larson test: strip every paragraph-final sentence. Does the piece still hand the
     reader something usable?
   - Koe test: read only first sentences. Does the argument's spine survive?
   - Pick the three most polished sentences. Would each survive on lethain.com
     unedited? A sentence whose job is positioning rather than explaining blocks:
     credentialing, audience-flattering superlatives, scope-flexing outside About.
5. **Transformation.** Does any sentence read like the cited author's own phrasing?
   For quotable sources especially (Dalio, Munger, Kleppmann, Larson), a sentence you
   could google back to the original is quotation wearing the author's voice. Blocking.
6. **Shape** (advisory; the tests own it): lane conformance, title from the claim not
   the topic, exactly three tags.

## The overrule path

Advisory findings the author disagrees with are overruled in the PR body with a
reason, next to the verdict. Blocking findings are fixed, or the piece does not ship.
"Don't publish this" is a successful outcome of judging; the site's argument is that
it does not ship unverified work, and the judge is allowed to reach that conclusion.

## Calibrating the judge before trusting it

A judge that always passes is not a control; it is theater occupying the slot where
review would report. Before trusting a judge context for the first time (new session,
new model), run it against the known-dirty fixture below as draft #0. It must FAIL the
fixture with findings covering at least: invented figures, stacked epigrams, marketing
register, and a floor violation. The expected findings live in
[references/expected-findings.md](references/expected-findings.md); the judge must not
read that file, and the invoking author compares the judge's findings against it. A
judge that passes the fixture is broken: do not trust its PASS on the real draft.

### Known-dirty fixture (calibration only; never publish any part of it)

> **Faster Ships Mean Better Teams**
>
> In today's fast-paced engineering landscape, shipping velocity is the metric that
> separates the great teams from the merely good — and after leading a 34-engineer
> platform group through a 40% latency reduction across 12 services, I can say the
> difference is cultural, not technical. Speed is culture made visible.
>
> The fix is to delve into your deploy pipeline and remove every manual gate; my team
> went from weekly to daily releases in one quarter, and morale followed. Velocity
> compounds. What you ship today builds the team that ships tomorrow.

## Why the judge is not in CI

Deliberate, and worth restating so nobody "fixes" it: the vitest gates stay
deterministic. A model-based check in CI is a flaky gate, and a flaky gate trains
everyone to rerun until green, which is how a gate stops rejecting anything. The judge
lives in the publish workflow (`../writer/references/publish.md`), runs before the PR,
and leaves its verdict in the PR body where a reviewer can see both the draft and the
judgment of it.
