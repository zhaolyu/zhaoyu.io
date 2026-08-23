---
name: distribute
description: Turn a note that is already live on zhaoyu.io into a channel draft — LinkedIn first — that earns the click instead of duplicating the note. Use after a note ships, or when asked to "post this", "share the note on LinkedIn", "write the LinkedIn version", "distribute the latest note". Drafts only; it never posts.
---

# distribute

The site is Positioning. The 2×/week note lane is Repetition. This skill is the third
factor, and without it the other two do not compound: *Authority = Positioning +
Distribution + Repetition, and all three have to operate simultaneously.* A note nobody
is routed to is a note that only the already-convinced will read.

**This skill drafts. It never posts.** Publishing to an external account is the user's
action, in their own client, every time. Do not offer to post, and do not ask for
credentials.

## Preconditions — check both before drafting

1. **The note must already be live.** Confirm the slug exists in
   `frontend/src/lib/constants/content.ts` and has shipped. Distributing an unpublished
   draft leaks a draft; if the note is not live yet, say so and stop.
2. **Ask about stealth before drafting for a public channel.** The vault holds an
   unresolved tension: visibility compounding argues for posting now, while employment
   stealth argues for deferring external positioning, *because discoverability is
   symmetric*. LinkedIn is the highest-discoverability surface there is. If the user has
   not already settled this in the current session, ask once — do not assume either way.

## The core rule

**Do not paste the note.** A post that reproduces the note gives the reader no reason to
click, reads as syndication, and spends the claim where it cannot be linked to. The post
is an argument for reading the note, made with one piece of the note's evidence — not the
note in a smaller box.

Concretely: pick **one** of the note's two paragraphs' loads. Either the failure mode
(paragraph 1) or the corrective (paragraph 2). Never both. The half you leave out is the
reason to click.

## LinkedIn shape

| Constraint | Value |
|---|---|
| Hard character cap | 3,000 |
| Target length | 900–1,400 characters |
| Above the fold | ~140 chars mobile, ~200 desktop, before "…see more" |
| Formatting | Line breaks only — LinkedIn renders no markdown, no bold, no italics |
| Paragraphs | 1–2 sentences each, blank line between; dense blocks do not get read |

**Structure that holds:**

1. **Hook — the claim, in one line, above the fold.** Same discipline as the note's first
   sentence: no windup, no "I've been thinking about." If the first 140 characters do not
   make someone want line two, nothing else matters.
2. **The mechanism, in two or three short lines.** Why it happens, not just that it does.
3. **The receipt.** The number, the named system, the study. One is enough, and it must be
   the same receipt the note carries — never a new one invented for the post.
4. **The link**, with the canonical `https://zhaoyu.io/blog/{slug}` URL.
5. **A close that is a rule or a genuine question.** Not "thoughts?" — a real question you
   would want answered, or the note's rule restated in the post's own words.

**On link placement:** my understanding is that LinkedIn has historically deprioritised
posts carrying an outbound link in the body, which is why "link in the first comment" became
a convention — but this is algorithm behaviour that changes and that I cannot verify. Draft
the in-body version, and offer the first-comment variant as an alternative rather than
asserting one is correct.

## Voice on this surface

Same person, different room. The note is written for a skeptical senior engineer who has
hit the problem. The LinkedIn post is written for that person *scrolling*, plus the
director who will not read 300 words on a feed.

- First person, assertive about what you did, hedged about what you predict.
- No hashtag stacks. Two or three at most, or none.
- No emoji bullets. No "🚀". No "Here's the thing:".
- The banned list from [`../writer/references/voice.md`](../writer/references/voice.md)
  applies unchanged, and so does the em-dash rationing — the tells that make prose read
  machine-made are *more* visible in a short post, not less.
- Never open with "I'm excited to share."

## Disclosure — identical boundaries, higher stakes

Everything in [`../../../PUBLISHING.md`](../../../PUBLISHING.md) applies. A LinkedIn post
is a public surface with the user's name and employer attached, so:

- Every employer-related number traces to `SOURCES` in `content.ts` and carries its basis.
- Nothing Versant or CNBC has not publicly disclosed appears in the post.
- No third-party private information — colleagues, partners, vendors.
- Never invent a receipt, a metric, a date, or an outcome. If the post wants a number the
  note does not have, write the sentence so it does not need one.

## Repetition is allowed, duplication is not

A note can be distributed more than once — the mere-exposure mechanism is the whole point,
and one post is not a distribution strategy. But a second post on the same note takes a
**different angle**: the other paragraph's load, a reader's objection, or a new incident
that tests the same claim. Reposting the same angle trains the feed to skip you.

## Output

Publish the draft as an Artifact — never write it into either repository. Include:

- The post text, in a copy-ready block with the line breaks as they should appear.
- A character count against the 3,000 cap, and what falls above the fold.
- The first-comment link variant.
- Which paragraph's load was used, and therefore what is being held back as the reason to
  click.
- Any receipt gap, flagged and unfilled.
