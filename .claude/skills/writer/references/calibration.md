# Calibration writers

The house voice is calibrated against named writers, not against an abstract "good."
When a draft is in doubt, the question is not "is this well written?" — it is "which of
these writers would ship this sentence?" If the answer is none of them, cut it.

Two writers anchor the calibration, and they pull in different directions on purpose.
[Will Larson](https://lethain.com) (Irrational Exuberance) sets the **register**: calm,
useful, grounded in named experience, written for a working peer. [Dan Koe](https://thedankoe.com)
sets the **readability bar**: a hook that earns the read, white space as pacing, one idea
at a time. The target is prose with Larson's substance that a Koe reader would actually
finish. Neither is imitated wholesale — the rejected moves are listed at the bottom, and
they stay rejected.

## Larson — the register

Each of these is checkable against a draft:

1. **Useful beats quotable.** The reader leaves with something they can run on Monday — a
   decision rule, a checklist shape, a test they can apply to their own system. Larson's
   posts read almost flat sentence-to-sentence; the value is the transferable structure.
   A paragraph whose only contribution is sounding right gets cut.
2. **Named experience is the evidence.** Larson writes "at Uber," "at Stripe," "at Calm."
   The equivalent here is the named system and the measured month: "one production prompt,
   ~4,000 to ~1,300 words," "my own site's CI config," "a 24-instance ledger kept over one
   month." A claim with no named substrate under it is a take, and takes don't ship.
3. **The prompting situation is an admissible opening — when it is itself evidence.** A
   question someone actually asked, a failure from a real week, a pattern across several
   real conversations. The claim still lands by sentence two (non-negotiable #1 stands);
   this is not license for windup, it is license for "someone asked me X and my answer
   surprised me" as the incident that grounds the piece.
4. **Assert the settled, hedge the speculative.** Already in [voice.md](voice.md) — the
   split is Larson's own practice. "My current thinking, as of this month" is admissible
   register; fake settledness is not. He publishes thinking-in-progress and labels it.
5. **Emphasis is rare.** Larson ships whole essays without a bolded sentence. The corpus
   sits well above that baseline, so treat the existing `<strong>` caps as ceilings, not
   quotas — the Larson default for any given paragraph is no emphasis at all.
6. **Structure before prose.** Procedure step 2 is his drafting practice: iterate on the
   outline until it holds, because restructuring finished prose is expensive.

## Koe — the readability bar

1. **The hook is a reframe the reader already feels.** Koe's openings name the reader's
   situation more sharply than the reader would name it, then invert the assumed cause.
   The corpus's claim-first rule is compatible: the first two sentences must earn the
   read, not merely begin the argument. If sentence one could open ten other posts on
   the same topic, it is not a hook.
2. **White space is pacing.** In the essay lane, vary paragraph length the way you vary
   sentence length. A one-sentence paragraph after a dense one is a beat, not thinness.
   A wall of same-sized paragraphs reads like documentation even when the sentences are
   good. (The two-paragraph note lane is exempt — its density is the form.)
3. **Name your models plainly and reuse the names.** Koe compounds by giving frameworks
   sticky names and returning to them across pieces. This site's equivalents — "fail-open
   checks," the receipts rule, "done is self-attestation" — are the site's best assets.
   A named model that recurs across notes builds a body of thought a reader can follow;
   an unnamed one evaporates after the piece that coined it. When a new note touches an
   existing model, use the existing name and link the note that owns it.
4. **Skimmability is a contract.** A reader who reads only the headings and the first
   sentence of each block should still get the argument's spine. Headings carry
   structure (voice.md already bans narrating the outline); first sentences carry claims.

## Rejected moves — and why

These are real features of the calibration writers' styles that this site deliberately
does not adopt. They stay rejected even when a draft would be easier to write with them.

| Move | Whose | Why not here |
|---|---|---|
| Aphorism density — most paragraphs end quotable | Koe | The measured top agent tell (see voice.md, Cadence). One aphorism per piece, at the end; the gate enforces it. |
| Second-person prescriptive register ("you need to…") | Koe | The reader is a skeptical senior peer, not an audience to motivate. First person, experience-grounded. |
| Motivational abstraction — purpose, energy, vision vocabulary | Koe | Off-domain. Claims here stay mechanical: a system, a failure mode, a measurement. |
| Big claims without receipts | Koe | Non-negotiables 2 and 3 govern. A reframe still needs an artifact under it. |
| Topic-definition openings ("What is an agent, really?") | neither — but a common drift | Both writers open from a live situation. Definitions are windup. |

## The calibration check

Run after the line-level checks in [voice.md](voice.md), before publishing:

1. **Larson test.** Strip the last sentence of every paragraph. Does the piece still
   hand the reader something usable? If the value was all in the punchlines, the piece
   is performing, not informing.
2. **Koe test.** Read only the first sentence of every block, in order. Does the
   argument's spine survive? If not, the claims are buried mid-paragraph.
3. **Register test.** Pick the three most polished sentences. Would each survive on
   lethain.com unedited? A sentence that reads like site copy, a LinkedIn post, or a
   pitch — anything whose job is positioning rather than explaining — fails, whatever
   its craft.

The register test applies beyond the notes: hero, bio, and project copy follow the same
calibration. Describe the work; never sell the worker. A surface sentence that would
embarrass you on lethain.com is marketing, and marketing is the one register this site
does not ship.
