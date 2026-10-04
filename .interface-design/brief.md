# Visual brief — zhaoyu.io

Status: **draft for Zhao's review**, 2026-10-04. Supersedes the one-line "Feel" in
`system.md` (Feb 2026), which predates the craft-first rethink (2026-08-31) and still
describes the removed hero badge, motto chips and staggered entrances. Tokens stay in
`frontend/src/app.css`; this file decides what they are for.

The writing side of this site is calibrated against named writers with checks a draft can
fail (`.claude/skills/writer/references/calibration.md`). This brief gives the visual side
the same shape: an intent, measured references, and principles a page can fail.

---

## 1. What the page has to do

**Message (owner decision, 2026-10-04):** trusting machine work. Producing output got
cheap; deciding whether it can be trusted is the work, and every claim here carries its
receipt. The design has to make that argument before a word is read: a page that looks
like evidence, not like a pitch.

**Readers, in order:**

1. **A senior engineer or EM who has hit the problem** (the reader `voice.md` writes for).
   Arrives on a note from a link, reads one, decides whether to read a second. Needs: a
   comfortable article, the receipt visibly attached to the claim, a clear next note.
2. **A hiring manager or exec.** Arrives on the home page from LinkedIn or a search.
   Needs, in ten seconds: what this person argues, that the work is real, who they are
   (the quiet identity line, PR #90), how to reach them.

**Feel, in three words:** *considered, evidential, calm.*

| Word | Means | Its failure mode on this site today |
|---|---|---|
| Considered | Typographic care is visible: measure, size, hierarchy, rhythm. Nothing is default. | Every colour is a stock Tailwind value; the article page is 16px light grey at ~95 characters a line. |
| Evidential | Figures, sources and incidents look like evidence: attached, cited, checkable. | Receipts are a word repeated six times on the home page rather than a visual form. |
| Calm | Restraint. One accent. Few labels. Nothing performs. | 100 mono usages across 38 components, 73 uppercase labels, fake terminal and browser chrome. |

The old "Feel" ("the kind of terminal you've customized over years") is retired. A
terminal is where you produce work; this site is about judging it. The visual model is
**an annotated record**: a document you would trust, with its sources in the margin.

---

## 2. Where the site is now (measured 2026-10-04, live, 1440×900)

| Fact | Measured | Why it matters |
|---|---|---|
| Palette | 11 of 11 colour roles are Tailwind defaults (`#111827` gray-900, `#f9fafb` gray-50, `#3b82f6` blue-500, …) | Nothing in the palette is ownable; it reads as a template. |
| Mono | 100 uses in 38 component files | The type rule says mono is for measured values and identifiers. It is the default label voice instead. |
| Uppercase | 73 uses | Shouting is the norm, so nothing stands out. |
| Note page | title 20px; body 16px, weight 300, `#4b5563`; ~95 characters per line | The page the thesis sends readers to is the least designed page on the site. None of the 8 references sets body text below weight 400. |
| Section edges | content starts at 168px, 208px and 120px depending on section | No single grid. |
| Section headers | two eyebrow patterns, weights 700 and 800, grey and blue accent lines | No single header component in practice. |
| Flagship work card | default visual is an empty browser mockup; the real diagram is hover-only | The largest image slot shows nothing. |

---

## 3. References (measured 2026-10-04, live, 1440×900)

Eight sites by writers and publishers whose pages are read for their reasoning. Values are
computed styles, not impressions; raw data and screenshots were captured with a Playwright
script. Caveat: three sites name fonts the measuring machine did not have (Georgia, PT Serif,
ui-serif), so their characters-per-line counts are approximate and probably high.

| Site | Article body | Measure | Accent | Mono outside code | Writing list | Identity on home |
|---|---|---|---|---|---|---|
| lethain.com | Georgia (serif) 16px / 1.50, `#555` | ~95 ch | 1 hue (blue) | none | plain list, title + full date, every post | name in a 16px first-person intro, no title |
| jvns.ca | PT Serif 16px / 1.25, black | ~86 ch | 1 family (orange) | none | 10 recent with dates, then everything by category | 64px orange name, one-line intro |
| simonwillison.net | Helvetica Neue (sans) 16px / 1.45, black | 75 ch | 4+ hues | none | dated stream of entries with tags | site name only |
| danluu.com | browser-default Times 16px | 221 ch (unbounded) | 1 (browser blue) | none | plain list, MM/YY + title | none |
| gwern.net | Source Serif 4, 20px / 1.60, black, justified | 95 ch | 0 (monochrome) | tag row only | Newest / Popular title lists | first-person sentence: name + what he writes |
| brandur.org | ui-serif 18px / 1.78, `#374151` on `#f6f5e9` | ~85 ch | 0 | none | 3 items: title, date, one-line excerpt | first-person intro, no title |
| press.stripe.com | Ivar Text 17px / 1.50, `#222` | 64 ch | per-book palettes | none | book spines | publisher name |
| practicaltypography.com | Valkyrie 21.8px / 1.45, black | 68 ch | 0 | none | table of contents | book title; author only in a link |

**What most of them share:**

- **Serif for reading:** 7 of 8 set article body in a serif. lethain and brandur keep a sans
  for the home page and chrome and switch to serif for the article itself.
- **Deliberate text faces are set large:** every site that loads a chosen text face (gwern,
  brandur, Stripe Press, practicaltypography) sets body at 17px or more. The 16px sites are
  the ones relying on system or default fonts.
- **No mono outside code:** 7 of 8. The one exception is gwern's tag row.
- **Colour is restrained:** 6 of 8 use no accent at all or a single hue. Only simonwillison
  (4+) and Stripe Press (one palette per book) use several.
- **Writing as a list:** 7 of 8 show writing as a plain list (title, usually a date), never
  as boxed cards.
- **No job title on the home page:** 0 of 8. Identity is a name plus what the person writes,
  often one first-person sentence at body size (4 of 8).
- **Body weight is regular or heavier:** none of the 8 sets body text below 400. This site's
  note body is 300.
- **Ink is dark:** 5 of 8 use pure black body text; the lightest is lethain's `#555`. This
  site's note body is `#4b5563` at weight 300.

**Where they differ:** measure (64 to 95 characters, only Stripe Press and
practicaltypography inside the 45–90 band practicaltypography itself recommends); line
height (1.25 to 1.78, median about 1.5); whether headings share the body family (4 of 8
do); dark mode (3 of 8 have a designed one with a toggle: simonwillison, gwern, brandur).

### Moves adopted and rejected

| Reference | Adopt | Reject, and why |
|---|---|---|
| practicaltypography.com | 68-character measure; sources and asides in a margin column, which is the "annotated record" model; no accent colour | hiding the author behind a link: our second reader needs to know who wrote this |
| gwern.net | a chosen serif at 20px / 1.6; monochrome palette; first-person identity sentence that says what he writes | 95-character justified measure; feature density that competes with the text |
| brandur.org | warm off-white ground; near-black links marked by a grey rule rather than colour; 18px / 1.78 serif article; a large, light display headline | the writing list sitting below a full-width photo, ~1,380px down |
| lethain.com | plain dated list of writing; a first-person intro instead of a badge; serif for the article | ~95-character measure and `#555` body text |
| press.stripe.com | one type superfamily for text and display; 64-character measure | the WebGL spectacle: it performs, and this site's feel is calm |
| jvns.ca | one warm hue family as the site's only personality | textured page and striped borders; 1.25 line height |
| simonwillison.net | links that are unmistakably links (coloured with a rule) | four-plus accent hues and a dense stream: busy, not calm |
| danluu.com | the principle that content outranks chrome | an unbounded 221-character measure; no identity at all |

The identity line (PR #90) is the one deliberate departure from the references: none of
them states a job title on the home page. It stays, quiet and under the CTAs, because this
site has a second reader the references do not write for.

## 4. Principles — each one is a check a page can fail

**P1. The article is the product.** A note page is designed first; the home page borrows
from it, not the reverse.
*Check:* note body ≥ 18px at weight ≥ 400, contrast ≥ 7:1 against its ground, 60–75
characters per line; note title at least `--type-2xl`. (Grounding: every reference that
loads a chosen text face sets it at 17px or more; none sets body below 400; the two
references inside a typographer's recommended measure run 64 and 68 characters.)

**P2. Mono means measured.** Mono is for figures, identifiers, code, commit shas and dates.
Never for nav, eyebrows, buttons, tags or prose labels. (7 of 8 references use no mono
outside code.)
*Check:* every `var(--font-mono)` in a component sits on one of those roles (a lint-style
test can enumerate them).

**P3. One accent, and it means "follow this".** The accent is for links and for source
citations. Tags, eyebrows and decorative lines are not accent-coloured. (6 of 8 references use no
accent or a single hue.)
*Check:* accent appears only on `a`, citation and focus styles.

**P4. Uppercase is an exception.** At most one uppercase run per section (the eyebrow, if
there is one).

**P5. Evidence looks like evidence.** A figure is visually attached to its source in one
consistent form (number, basis, linked source), the same on a note, a work card and the
Receipts section. The word "receipts" appears where it names that form, not as a slogan.
*Check:* one component renders every sourced figure; `content.test.ts` already guarantees
the data.

**P6. One grid.** One outer content width and one reading width; every section shares one
left edge; one section-header component with one pattern.
*Check:* a layout test measures each section's content edge at 1440px; all equal.

**P7. Show the artifact, never a placeholder.** No empty mockups, fake terminal windows or
traffic-light chrome unless the thing shown is literally a terminal. Diagrams are visible
by default.

**P8. Identity is quiet and findable.** Name, role and location once, at secondary weight,
in the first viewport (shipped in PR #90).

**P9. Motion never delays reading.** Reveals stay animation-only and gated (already a
tested rule); nothing hides content or competes with it.

---

## 5. Surface by surface

| Surface | Direction |
|---|---|
| Note page | Rebuild first, per P1: reading face and size, measure, a real title, sources rendered as a footnote block under the text. |
| Notes on the home page | A list, not a grid of identical cards: date, title, one-line claim. Lead with the essay. Tags move to the note page. |
| Hero | Thesis at display size, the receipt standard as the subhead, identity line quiet (PR #90). Drop the grid backdrop. |
| Models | One section, not two: merge "Models" and "In Code". Each model states the rule, then its receipts. |
| Work | Decision records. The migration diagram visible by default; delete `BrowserMock`. Merge the duplicate migration and rebuild cards. |
| About | Unchanged in content; on the shared grid and header. |
| Receipts | The canonical form of P5; the same component the notes and work cards use. |
| Connect | Plain contact block; retire the fake `zsh` window. |
| Nav | Plain words, not `/path` mono. |
| `/infra` | Stays a hybrid dashboard surface; mono and chrome are legitimate there because it is literally a tool. |

---

## 6. Decisions only Zhao can make

1. **Reading face.** Keep Geist Sans for everything and fix size, weight and measure; or
   add a serif text face for prose and keep Geist for UI (the lethain/brandur split),
   self-hosted via `@fontsource` so the CSP does not change. **Recommendation: add the
   serif.** 7 of 8 references read in a serif, and it is the clearest single signal that
   the page is for reading. Candidate: Source Serif 4 (gwern's face, open licence,
   available on `@fontsource`); the font-metric fallback work in `app.css` must be redone
   for it.
2. **Palette.** Stay on blue but leave the Tailwind defaults (own ground, ink and accent
   values, re-verified for AA in both themes); or change the accent hue.
3. **How far to go.** Principles P1, P2, P6 and P7 fix most of the gap. P3–P5 change the
   site's look more visibly.

---

## 7. Rollout (PR-sized)

1. Note page reading experience (P1) and the shared grid/header (P6).
2. Mono and uppercase pass (P2, P4); nav in plain words.
3. Home notes as a list; models merged; flagship diagram visible, mockups removed (P7).
4. Palette and, if chosen, the reading face; tokens in `app.css`, `design-tokens.ts`
   registry updated (the drift test enforces it).
5. Hero card added to the `/design-system` registry so the most-seen module has a preview.

Each PR ships with before/after screenshots at 1440 and 390, light and dark, and the
measured values for the checks it touches.
