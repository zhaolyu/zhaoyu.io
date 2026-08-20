# Line-level craft

Run these after drafting, in order. Each one is checkable — either the sentence passes or
it doesn't.

## Register

**First person singular.** Present tense for standing practice ("I now require four
responsibilities"), past for incidents ("the fallback was winning the write").

**Assertive about what you did; hedged about what you predict.** This is the split Larson
runs across his own posts — short prescriptive pieces are flatly assertive ("this is just
the way it works now"), while speculative pieces hedge openly ("I'm worried about,"
"it's possible"). Both are honest; mixing them up is not. jvns' corollary: writing
"my understanding is" costs you nothing and saves an hour of over-verification. Fake
certainty is the only unacceptable option.

**No credentialing.** The résumé is elsewhere on the page. Scope appears only when it is
the evidence — "I manage 20 engineers across 3 web teams, and the skills that job demands
are now IC skills too" works because the headcount is the argument.

**Write for one reader**: a senior engineer or EM who has hit this exact problem and is
skeptical. Not a recruiter, not a beginner. That reader doesn't need the concept defined;
they need the mechanism and the receipt.

## Sentence rules

- **Concrete before abstract.** One real incident beats three hypotheticals. If a
  paragraph has no proper noun, no number, and no artifact in it, it isn't grounded yet.
- **Name the mechanism.** "RoPE decays in a way that puts mid-sequence tokens into a
  lower-attention zone" — not "models struggle with long context."
- **Cut the throat-clearing.** Delete "It's worth noting," "The reality is," "At the end
  of the day," "Simply put," and any sentence that announces what the next sentence will do.
- **Verbs over nominalizations.** "Reviewing it is management," not "the review process
  constitutes a management function."
- **One idea per sentence.** The corpus runs long sentences, but each is one clause chain
  building a single point, not two points spliced.

## Inline markup

Note content is rendered as `{@html}` inside a `<p>`, so inline HTML is available and is
part of the voice:

- `<strong>` — the load-bearing claim, typically once per paragraph and always on the
  closing rule. More than twice per paragraph and emphasis stops meaning anything.
- `<em>` — a single contrastive word (*more* reliable, *finished* work), not whole clauses.
- `<code>` — literal identifiers, states, filenames, API surface: `CLAIMED`, `index.html`,
  `setState(prev => prev + chunk)`, `llms.txt`.

Escape apostrophes correctly for the TypeScript string, and prefer double-quoted strings
when the paragraph contains apostrophes (matches the existing file).

## Banned and rationed

**Banned outright:** "In today's fast-paced world," "let's dive in," "delve," "landscape"
(figurative), "unlock," "game-changer," "seamless," "robust" as filler, "leverage" as a
verb where "use" works, "supercharge," "at scale" without a number attached, exclamation
points, rhetorical questions used as transitions.

**Rationed — these are house signatures that turn into tics when overused:**

| Device | Cap per note | Why |
|---|---|---|
| `X is not Y, it's Z` | 1 | Already the dominant move in the corpus |
| Em dash | ~2 per paragraph | Beyond that the prose reads machine-made |
| Tricolon ("faster, cheaper, more reliable") | 1, only if all three are load-bearing | Padding otherwise |
| Aphorism / closing-rule cadence | 1, at the end | Two competing aphorisms cancel out |
| Colon-subtitle title | — | Vary against the `X, Not Y` pattern across consecutive notes |

## The last line

The closing sentence is the one that gets quoted. Test it three ways:

1. Does it stand alone, out of context, and still mean something?
2. Does it say something the title doesn't already say?
3. Is it a *rule* — something the reader could apply on Monday — rather than a summary?

Corpus examples that pass: *"Reliability is engineered into the loop, not summoned from the
model."* · *"An agent is not a feature you ship. It is a service you operate."* ·
*"Deciding the work is trustworthy is the job."*

## Editing an existing note

Preserve the note's claim unless explicitly asked to change it — a note that has shipped is
linked from `llms.txt`, RSS, and its OG card. Changing the *title* changes the OG image and
requires regeneration; changing the *slug* breaks canonical URLs and inbound links, so treat
slug edits as a deliberate migration, not a tidy-up.
