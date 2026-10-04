# Interface design system — zhaoyu.io

How the site is built to look, and where each rule lives. Rewritten 2026-10-04: the previous
version (Feb 2026) predated the craft-first rethink and described a hero badge, motto chips,
staggered entrances, numeric spacing names and a "no shadows" rule that no longer exist.

| Question | Answer lives in |
|---|---|
| What the site should feel like, and why | [`brief.md`](brief.md): intent, measured references, principles P1–P9 with checks |
| Token values | `frontend/src/app.css` (the only source of truth) |
| Token index for previews | `frontend/src/lib/constants/design-tokens.ts`, kept honest by `design-tokens.test.ts` |
| Component previews | `/design-system/{card}`, registered in `frontend/src/lib/constants/design-system.ts` |
| Copy | `frontend/src/lib/constants/content.ts`, through the `writer` skill |

Never hardcode a colour, size, radius, shadow, duration, width or spacing value in a
component. Reach for a token; if none fits, add it to `app.css` and register it.

---

## Intent

**Feel:** considered, evidential, calm. The visual model is an annotated record: a document
you would trust, with its sources attached. The full argument, the eight measured reference
sites and the moves adopted and rejected from each are in [`brief.md`](brief.md).

**Readers:** first, a senior engineer or EM who arrives on a note and decides whether to read
a second; second, a hiring manager who arrives on the home page and needs the argument, the
evidence and the author's identity within ten seconds.

---

## Token families

| Family | Tokens | Rule |
|---|---|---|
| Colour roles | `--bg-*`, `--text-*`, `--border-color`, `--accent-*`, `--status-*` | Roles, not hues. `.dark` swaps values only. |
| Accent as text | `--accent-primary-text`, `--accent-{professional,independent,experiment}` | Theme-flipped for AA. `--accent-primary-light` is for fills, dots and borders only. |
| Surfaces | `--surface-raised`, `--scrim-*`, `--border-subtle\|soft`, `--ink-*` | Ink-on-surface alphas that invert under `.dark`. |
| Type | `--type-2xs…4xl`, `--leading-*`, `--tracking-*`, `--weight-*` | Size, leading and tracking are separate; they do not pair one-to-one. |
| Spacing | `--space-2xs…5xl` | Step names; the scale is non-linear. |
| Rhythm | `--section-y`, `--section-y-lg`, `--section-y-mobile`, `--section-x` | `-lg` only for sections that deliberately breathe more. |
| **Layout** | `--content-max`, `--measure-prose` | One section width, one reading measure (see below). |
| Radius, elevation, motion | `--radius-*`, `--shadow-*`, `--duration-*`, `--ease-*` | Shadows are redefined under `.dark`. |

The palette is still the stock Tailwind values; replacing them with the site's own ground,
ink and accent is a planned, separate change (brief §6).

---

## Typography roles

| Role | Face | Where |
|---|---|---|
| Interface and headings | Geist Sans (`--font-sans`) | Nav, buttons, section and note titles, cards |
| Reading | Source Serif 4 (`--font-serif`) | Note bodies and case-study paragraphs only |
| Measured values and identifiers | Geist Mono (`--font-mono`) | Figures, code, commit shas, dates |

Reading text is `--type-md` (18px) at `--weight-regular`, in `--text-primary`, with
`--leading-relaxed`, inside `--measure-prose`. Hierarchy on cards stays
classification > measurement > description.

Both text faces have metric-matched fallbacks (`Geist Sans Fallback` on Arial / Liberation
Sans, `Source Serif 4 Fallback` on Times New Roman / Liberation Serif) so the font swap does
not move the page. The overrides are derived from each font's own metrics and a measured
width ratio over the site's real copy; `font-metrics.test.ts` guards both. Re-measure, do not
nudge, if a font or its subset changes.

---

## Layout

- **One outer width.** Every landing section caps at `--content-max`. Sections that pad
  themselves (`max-width` box includes `--section-x`) use `var(--content-max)`; sections whose
  full-bleed wrapper pads and whose inner container caps use
  `calc(var(--content-max) - 2 * var(--section-x))`. Either way every section starts at the
  same left edge.
- **One reading measure.** Long-form prose sits inside `--measure-prose` (65ch, about 60–75
  characters a line in the reading face).
- **Section rhythm.** `--section-y` vertical padding by default, `--section-y-lg` for the
  sections that deliberately breathe more, `--section-x` gutters.

---

## Rules enforced by tests

- `design-tokens.test.ts`: the registry matches `app.css`; any token in a covered family must
  be registered (`COVERED_PREFIXES`).
- `font-metrics.test.ts`: both fallback faces exist, are reachable from their stacks and carry
  overrides derived from the real metrics.
- Sections render their content always; reveals are animation-only, gated on
  `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`. Never hide
  content behind `{#if visible}`: it will not prerender.
- `csp.test.ts`: fonts are self-hosted through `@fontsource`, so no new origin is needed. Any
  new external origin goes into `svelte.config.js`.

---

## Components

- `SectionHeader` (`$lib/components/ui`) is the one section-header component; previewed at
  `/design-system/section-header`.
- The hero, note card, model card, system card, stat card, data table, annotated chart and
  segmented control each have a preview card rendered from the real component and real
  content. Add a card to `design-system.ts` when you add a component people will reuse.
- Barrel exports: `$lib/components` re-exports `ui` and `layout`; feature components are
  imported from their own folder (`$lib/components/features/<name>`).

### Adding a section

1. `src/lib/components/features/<name>/<Name>.svelte` plus `index.ts`.
2. Cap it at `--content-max` per the Layout rule; pad with the rhythm tokens.
3. Use `observeSection` from `$lib/utils/section-observer` for an animation-only reveal.
4. Place it in `src/routes/(main)/+page.svelte` and, if it is a destination, in the nav.

---

## Accessibility

- Focus: `:focus-visible` draws `2px solid var(--accent-primary)` at a 3px offset (2px on
  inline links); mouse focus shows no outline.
- Anchored sections carry a scroll margin so the sticky nav does not cover their headings.
- Accent text uses the theme-flipped `--accent-primary-text` and the category accents, which
  are checked for AA in both themes.

---

## `/infra` (Cost-Guard dashboard)

A hybrid surface: it shares every structural token with the site but uses `--accent-infra`
(cyan) instead of the primary accent, so it reads as an operations tool. Mono and dashboard
chrome are legitimate there because it is literally a tool. Composition rules: a tight chrome
zone (header and telemetry strip), a clear break before the working area, standard density
between working cards; only the one value that matters at a glance (live status) takes the
accent colour.
