# Conventions

How to build with this system. Every token named here is declared in
`styles.css`, which is the only stylesheet a rendered design receives — if a
name is not in this file, check `styles.css` before assuming it exists.

## The one rule

**Never hardcode a colour, size, radius, shadow, duration, or spacing value.**
Reach for a token. If none fits, the system is missing one — say so rather than
inventing a local literal, because a literal cannot follow a theme switch.

## Theming

Light is the default; add `class="dark"` to the root element for dark. Every
colour token is redefined under `.dark`, so a correct design needs no
per-element dark styling — it needs tokens instead of literals. Shadows are
redefined too: a 5% black shadow is invisible on a dark ground.

## Token families

| Family            | Tokens                                                                                                                                                                            | How to use them                                                                                                                                                                                                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ground & ink      | `--bg-primary`, `--bg-secondary`, `--bg-inverse`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color`                                                          | Roles, not hues. `--bg-secondary` is the raised card surface, `--bg-primary` the page ground.                                                                                                                                                                                                                               |
| On inverse        | `--text-on-inverse`, `--text-on-inverse-muted`, `--surface-on-inverse`, `--border-on-inverse`, `--accent-on-inverse`                                                              | For content sitting on `--bg-inverse`, which does **not** flip with the theme.                                                                                                                                                                                                                                              |
| Accent            | `--accent-primary`, `--accent-primary-hover`, `--accent-primary-dark`, `--accent-primary-text`, `--accent-primary-{10,20,30}`, `--accent-gradient-start`, `--accent-gradient-end` | `--accent-primary-text` is the theme-flipped one to use for accent-coloured **text**. `--accent-primary-light` is for fills, dots and borders only — it fails AA as text on light.                                                                                                                                          |
| Category accents  | `--accent-professional`, `--accent-independent`, `--accent-experiment`, `--accent-infra`, `--accent-independent-{10,20}`, `--accent-infra-{10,20}`, `--accent-infra-{light,dark}` | Identity of a _kind of work_, not state. Don't reach for these to mean "good" or "bad".                                                                                                                                                                                                                                     |
| Status            | `--status-{success,warning,error,info}`, `--status-{success,warning,error,info}-text`, `--status-{success,warning,error,info}-{10,20}`                                            | Semantic state. The bare token is the fill; `-text` is the readable end and flips per theme; `-10`/`-20` are the tints for pill and banner grounds.                                                                                                                                                                         |
| Data-viz          | `--viz-series-{1,2,3,4,5}`, `--viz-series-{1,2,3,4,5,6,7,8}-dense`, `--viz-grid`, `--viz-axis`, `--viz-reference`, `--viz-structure`, `--viz-quiet`, `--viz-conflict`             | Fixed lightness and chroma, hue-only variance, so no series outranks another. Ramp choice is **mark count**, not chart type: base set for a few strokes, `-dense` for canvases with more marks than a legend can name. Chrome is not a series — grid, axis and reference stay muted, and a reference line is always dashed. |
| Surfaces & scrims | `--surface-raised`, `--scrim-subtle`, `--scrim-soft`, `--border-subtle`, `--border-soft`, `--ink-dim`, `--ink-quiet`, `--ink-faint`                                               | Ink-on-surface alphas. They invert under `.dark`, where light-mode alphas read as mud.                                                                                                                                                                                                                                      |
| Type size         | `--type-2xs` … `--type-4xl` (`2xs, xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl`)                                                                                                      | Size only.                                                                                                                                                                                                                                                                                                                  |
| Type rhythm       | `--leading-{tight,snug,normal,relaxed}`, `--tracking-{tight,normal,wide,wider,widest}`, `--weight-{light,regular,medium,semibold,bold}`                                           | Separate from size because they don't pair 1:1 — display sizes want tight leading and negative tracking, body sizes want the opposite.                                                                                                                                                                                      |
| Font              | `--font-sans`, `--font-mono`                                                                                                                                                      | Mono is reserved for measured values and identifiers. Descriptive labels are sans, even in a data-dense card.                                                                                                                                                                                                               |
| Spacing           | `--space-2xs` … `--space-5xl` (`2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl`)                                                                                                     | Step names, not multipliers — the scale opens up as it grows, so the names promise no arithmetic.                                                                                                                                                                                                                           |
| Rhythm            | `--section-y`, `--section-y-lg`, `--section-y-mobile`, `--section-x`                                                                                                              | Section rhythm. `-lg` only where a section should deliberately breathe more.                                                                                                                                                                                                                                                |
| Radius            | `--radius-{xs,sm,md,lg,xl,full}`                                                                                                                                                  | Cards sit at `--radius-lg`; anything rounder is a badge or a dot.                                                                                                                                                                                                                                                           |
| Elevation         | `--shadow-{sm,md,lg}`                                                                                                                                                             | Redefined under `.dark`.                                                                                                                                                                                                                                                                                                    |
| Motion            | `--duration-{fast,base,slow}`, `--ease-out`, `--ease-in-out`                                                                                                                      | Short by policy — this is a site about latency. Assume every one is disabled under `prefers-reduced-motion`.                                                                                                                                                                                                                |
| Scrollbar         | `--scrollbar-*`                                                                                                                                                                   | Thumb/track pairs for custom scrollbar styling, light and dark.                                                                                                                                                                                                                                                             |

## Type hierarchy on cards

Classification, then measurement, then description — in that order of visual
weight. Mono-uppercase is for the classification and for measured values; a
descriptive label set in mono-uppercase reads as data and flattens the
hierarchy.

## Content and motion

Content renders unconditionally; motion is decoration on top of it. Never gate
a section's content on a visibility or scroll state — a reveal that hides
content until an observer fires ships an empty page to anything that doesn't
run scripts.

## Accessibility

Text must clear AA against its own ground in **both** themes. The `-text`
variants exist because the fill colours don't: reach for `--accent-primary-text`
and `--status-success-text` rather than the bare token when the colour is
carrying words.
