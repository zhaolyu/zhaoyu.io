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
| Note page | title 20px; body 16px, weight 300, `#4b5563`; ~95 characters per line | The page the thesis sends readers to is the least designed page on the site. |
| Section edges | content starts at 168px, 208px and 120px depending on section | No single grid. |
| Section headers | two eyebrow patterns, weights 700 and 800, grey and blue accent lines | No single header component in practice. |
| Flagship work card | default visual is an empty browser mockup; the real diagram is hover-only | The largest image slot shows nothing. |

---

## 3. References

*(Pending: measured from the live sites — body face, size, measure, palette, mono use, how
identity and the writing list are presented. Each reference will list the moves this site
adopts and the moves it rejects, with the reason, the way `calibration.md` does for prose.)*

---

## 4. Principles — each one is a check a page can fail

**P1. The article is the product.** A note page is designed first; the home page borrows
from it, not the reverse.
*Check:* note body ≥ 18px at weight ≥ 400, contrast ≥ 7:1 against its ground, 60–75
characters per line; note title at least `--type-2xl`.

**P2. Mono means measured.** Mono is for figures, identifiers, code, commit shas and dates.
Never for nav, eyebrows, buttons, tags or prose labels.
*Check:* every `var(--font-mono)` in a component sits on one of those roles (a lint-style
test can enumerate them).

**P3. One accent, and it means "follow this".** The accent is for links and for source
citations. Tags, eyebrows and decorative lines are not accent-coloured.
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
   add a text face for prose (self-hosted via `@fontsource`, so no CSP change). The
   reference measurements will show what comparable sites do.
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
