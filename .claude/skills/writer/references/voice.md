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
the evidence — "I manage a direct team of ten and co-lead a rebuild across three web teams,
and the skills that job demands are now IC skills too" works because the headcount is the
argument. State it the way the résumé does; see the scope-claim rule in
[surfaces.md](surfaces.md), which `positioning.test.ts` enforces.

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

**Banned outright:** the em dash (see below), "In today's fast-paced world," "let's dive
in," "delve," "landscape" (figurative), "unlock," "game-changer," "seamless," "robust" as
filler, "leverage" as a verb where "use" works, "supercharge," "at scale" without a number
attached, exclamation points, rhetorical questions used as transitions.

## No em dashes

Banned in anything written or edited from 2026-08-31 on, at any density, in titles and
prose alike. En dashes and double hyphens used as dashes count; `--` inside `<code>` is
the one exemption. The dash was a house ration for a while, and the ration lost the
argument: readers now take the glyph itself as the signature of machine-written prose,
and a tell is a tell whatever the count. `content-voice.test.ts` enforces zero for every
note dated on or after the cutoff.

Replacing a dash is restructuring, not punctuation-swapping:

- **Two sentences.** The strongest fix and the usual one. Most dashes splice a coda onto
  a sentence that was already finished; let it end, start the next.
- **A comma**, when the aside is genuinely subordinate.
- **Parentheses**, when it is a true parenthetical. Rare: more than one pair per piece is
  its own tic.
- **A colon**, only where the second half delivers what the first half promises, and only
  within the hinge budget below.

The trap: swapping every dash for a colon or semicolon keeps the exact rhythm that made
the prose read machine-made, because the tell was never only the glyph. It was the
interruption-before-reframe move underneath it. A paragraph that needed five dashes
needs shorter sentences, not five colons.

Grandfathered notes keep their dashes, but the grandfathering is provenance, not
preference: when you edit a shipped paragraph for any other reason, take its dashes out
on the way through.

**Rationed — these are house signatures that turn into tics when overused:**

| Device | Cap per note | Why |
|---|---|---|
| `X is not Y, it's Z` | 1 | Already the dominant move in the corpus |
| Tricolon ("faster, cheaper, more reliable") | 1, only if all three are load-bearing | Padding otherwise |
| Aphorism / paragraph-final punchline | 1 per piece, at the end | Two competing aphorisms cancel out; a punchline every paragraph is the top agent tell |
| Structural signposting | 0 | "Two lessons:," "The general shape:," "Two objections worth pre-empting" |
| Mid-sentence colon as drumroll | ~1 per paragraph | Stacks with semicolons into a hinge-every-sentence rhythm; not a landing slot for evicted dashes |
| Colon-subtitle title | 1 | Vary against the `X, Not Y` pattern across consecutive notes |

## Cadence — the tell that outranks vocabulary

Banned-word lists catch the obvious drafts. What actually makes prose read machine-made is
rhythm, and it is measurable.

**One aphorism per piece, at the end.** The first essay drafted here ended 14 of its 17
paragraphs on an epigram. Every line was defensible alone; together they read as generated,
because human long-form lets most paragraphs do their work and stop. The reader needs flat
stretches for the closing rule to land against. When a paragraph's last sentence is
quotable, ask whether it is *the* quotable sentence — if not, cut it or demote it into a
subordinate clause.

**Count the hinges.** Mid-sentence colons and semicolons do the work the em dash used to
do: an interruption before a reframe. The ban does not transfer the dash's budget to
them. Individually rationed, collectively they stack; more than one hinge per 30 words
and the prose reads breathless. The first essay ran one per 28 before editing, one per
38 after. The pre-ban history is why the substitution trap is real: a draft once ran
below the old density cap and still read machine-made, because 9 of its 11 dashes made
the identical late-sentence coda move. The rhythm was the tell, and rhythm survives a
change of glyph.

**Vary paragraph length (essay lane).** A wall of same-sized paragraphs reads like
documentation even when every sentence is good. A one-sentence paragraph after a dense
one is a beat, not thinness — use it where the argument turns. The two-paragraph note
lane is exempt; its density is the form.

**Don't narrate the outline.** Headings carry structure. A sentence whose job is to
announce the next sentence is throat-clearing even when it sounds confident.

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

## Measuring a draft

These are checks you run, not impressions you form. From `frontend/`:

```bash
pnpm vitest run src/lib/constants/content-voice.test.ts
```

That gate covers the dash ban and the per-paragraph caps. It cannot see cadence, so read the draft's
paragraph-final sentences as a list — pull them out, stack them, and count how many are
epigrams. More than one and the piece needs cutting, whatever the suite says.
