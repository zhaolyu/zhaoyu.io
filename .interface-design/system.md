# Interface Design System — zhaoyu.io

## Intent

**Who:** Technical peers, hiring managers, and collaborators arriving with intent — to evaluate craft and understand how this engineer thinks.
**What they do:** Form a coherent picture of a technical identity. Quickly, without friction.
**Feel:** Precise. Like a well-commented codebase. Cold-clean but not sterile — the kind of terminal you've customized over years.

---

## Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes: `$state`, `$derived`, `$effect`)
- **Styling:** Tailwind CSS v4 + CSS custom properties (tokens in `app.css`)
- **Fonts:** Geist Sans (UI/body) + Geist Mono (labels, badges, code)
- **Deploy:** Static adapter (SPA mode with `index.html` fallback)

---

## Color Tokens

All tokens defined in `:root` / `.dark` in `src/app.css`.

### Surface
| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg-primary` | `#ffffff` | `#111827` | Page background, hero, section bg |
| `--bg-secondary` | `#f9fafb` | `#1f2937` | Cards, panels, inset surfaces |

### Text
| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--text-primary` | `#111827` | `#f9fafb` | Headlines, body |
| `--text-secondary` | `#4b5563` | `#d1d5db` | Descriptions, supporting copy |
| `--text-muted` | `#6b7280` | `#9ca3af` | Labels, metadata, section headline accents |

### Border
| Token | Light | Dark |
|-------|-------|------|
| `--border-color` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` |

### Accent — Primary (Blue)
```
--accent-primary:       #3b82f6   (Blue-500)
--accent-primary-hover: #2563eb   (Blue-600)
--accent-primary-light: #60a5fa   (Blue-400) ← badges, badge text, links
--accent-primary-dark:  #1d4ed8   (Blue-700)
--accent-gradient-start:#3b82f6
--accent-gradient-end:  #6366f1   (Indigo-500)
--accent-primary-10/20/30: rgba opacity variants
```

### Accent — Secondary (Purple)
Used exclusively for "goal/target" states in the skills chart and related legend.
```
--accent-secondary:       #a855f7  (Purple-500)
--accent-secondary-light: #c084fc  (Purple-400)
```

### Accent — Infra (Cyan)
Used exclusively for the `/infra` ops dashboard. Distinguishes the infra surface from the portfolio's blue accent while sharing all structural tokens.
```
--accent-infra:       #06b6d4   (Cyan-500)
--accent-infra-light: #22d3ee   (Cyan-400)
--accent-infra-dark:  #0891b2   (Cyan-600)
--accent-infra-10:    rgba(6, 182, 212, 0.1)  — badge bg, projection bg
--accent-infra-20:    rgba(6, 182, 212, 0.2)  — pulse glow
```

### Status
```
--status-success: #10b981  (Green-500)
--status-warning: #fbbf24  (Amber-400)
--status-error:   #ef4444  (Red-500)
```

### Chart Tokens
SVG elements can't inherit CSS vars directly via class — use these explicitly.
```
--chart-grid:      #d1d5db (light) / #404040 (dark)  — polygon grid lines
--chart-dot-fill:  #ffffff (light) / #111827 (dark)  — radar dot centers
--chart-label:     #9ca3af (light) / #737373 (dark)  — axis labels
```

### Scrollbar Tokens
```
--scrollbar-track-light / --scrollbar-thumb-light / --scrollbar-thumb-light-hover
--scrollbar-track-dark  / --scrollbar-thumb-dark  / --scrollbar-thumb-dark-hover
```

---

## Typography

| Role | Font | Size | Weight | Notes |
|------|------|------|--------|-------|
| Hero headline | Geist Sans | `clamp(3rem, 7vw, 4.5rem)` | 700 | tracking `-0.02em` |
| Section headline | Geist Sans | `clamp(2rem, 5vw, 3rem)` | 700 | tracking `-0.02em`, max-width 48rem |
| Body / bio | Geist Sans | `1.125–1.5rem` | 300 | line-height 1.6–1.75 |
| Badge / label | Geist Mono | `0.75rem` | 500 | uppercase, tracking `0.2em` |
| Ticker / motto | Geist Mono | `0.75–1rem` | 700 | uppercase, tracking `0.2em` |
| Stat value | Geist Mono | `1.25–1.5rem` | 700 | monospace numerals |
| Stat label | Geist Mono | `0.65rem` | 400 | uppercase, tracking `0.05em` |

---

## Spacing Scale

Defined as CSS tokens in `:root`. Use these — don't invent new values.

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | `0.25rem` | Icon nudges, fine-grained alignment |
| `--space-2` | `0.5rem` | Tight padding (badge, tag) |
| `--space-3` | `0.75rem` | Compact gaps (ticker items) |
| `--space-4` | `1rem` | Base unit — inline padding, small gaps |
| `--space-5` | `1.5rem` | Component internal spacing |
| `--space-6` | `2rem` | Card/panel padding |
| `--space-8` | `3rem` | Section header bottom margin (mobile) |
| `--space-10` | `4rem` | Navbar scroll-margin, mid section padding |
| `--space-12` | `6rem` | Standard section vertical padding |
| `--space-16` | `8rem` | Generous section padding |

---

## Elevation / Depth

No shadows. Depth is created through:
1. **Border opacity** — `1px solid var(--border-color)` (rgba, not solid)
2. **Surface tier** — `bg-secondary` cards on `bg-primary` backgrounds
3. **Backdrop blur** — navbar at `backdrop-blur-md` when scrolled
4. **Glow** — `drop-shadow(0 0 20px rgba(59,130,246,0.1))` on charts only

---

## Motion

| Pattern | Spec | Use |
|---------|------|-----|
| Theme transition | `0.2s ease` | All `background-color`, `color`, `border-color` |
| Entrance — hero badge | `fly y:-20 800ms delay:0` | |
| Entrance — hero headline | `fly y:20 800ms delay:200 backOut` | |
| Entrance — hero bio | `fly y:20 800ms delay:400` | |
| Entrance — hero CTAs | `fly y:10 800ms delay:600` | |
| Entrance — hero motto | `fade 1000ms delay:1000` | |
| Section reveal | `fade 600ms` | Triggered by IntersectionObserver |
| Hover — interactive | `0.2s` color/transform | Links, buttons, cards |
| Radar chart | `tweened 3000ms cubicOut` | Skills section |

---

## Component Patterns

### Section Structure
Every section follows this pattern:
```svelte
<section id="[id]" class="[section-name]-section">
  <!-- bg-primary + border-bottom + transition -->
  <!-- max-width container centered -->
  <!-- SectionHeader with badge -->
  <!-- Content revealed by IntersectionObserver + fade transition -->
</section>
```

### SectionHeader
```svelte
<!-- Simple case: plain text + accent span -->
<SectionHeader badge="Badge Text" headline="Plain headline" accentText="Muted accent." />

<!-- Complex case: use children snippet for <br> or styled spans -->
<SectionHeader badge="Badge Text">
  First line of headline<br />
  <span class="headline-accent">Second line in muted color.</span>
</SectionHeader>
```
**Never use `{@html}` — use the snippet slot for any markup.**

### Tags / Chips
```css
font-size: 0.625rem;
font-family: var(--font-mono);
text-transform: uppercase;
letter-spacing: 0.1em;
color: var(--accent-primary-light);
background: var(--accent-primary-10);
padding: 0.25rem 0.5rem;
border-radius: 0.25rem;
```

### Section Badge (inline, not SectionHeader)
```css
font-family: var(--font-mono);
font-size: 0.8rem;
font-weight: 500;
letter-spacing: 0.1em;
text-transform: uppercase;
color: var(--accent-primary-light);
/* + optional pulse dot using --accent-primary */
```

### Cards
- Border: `1px solid var(--border-color)`
- Background: `var(--bg-secondary)`
- Hover: border shifts to `var(--text-muted)`, bg to `var(--bg-primary)`
- Radius: `0.75rem`
- Transition: `all 0.5s` (slower than standard — cards are deliberate)

### Buttons
```
Primary CTA:   bg-neutral-900/white (dark inverted) + rounded-full + font-bold
Secondary CTA: border + rounded-full + hover:bg-secondary fill
```

---

## Shared Global Utilities (app.css)

```css
.section-surface   /* bg-primary + border-bottom + theme transitions */
.section-padding   /* 6rem vertical, 2rem horizontal (responsive) */
.section-container /* max-width: 75rem, centered */
.headline-accent   /* color: var(--text-muted) — for snippet slot headlines */
```

---

## Focus / Accessibility

- **Focus ring:** `outline: 2px solid var(--accent-primary)`, `offset: 3px`, `radius: 4px`
- **Inline links:** `outline-offset: 2px`
- **Mouse clicks:** No outline (`:focus:not(:focus-visible)`)
- **Touch targets:** Minimum 44px (enforced in Navbar hamburger, mobile menu links)
- **Scroll margin:** `4rem` mobile / `5rem` desktop on all `[id]` elements

---

## Barrel Export Convention

```
$lib/components/ui          → SectionHeader (and future shared UI)
$lib/components/layout      → Navbar, ThemeToggle, TelemetryFooter, StandaloneNavbar
$lib/components/features/*  → Import directly from feature folder
                              e.g. import { Hero } from '$lib/components/features/hero'
$lib/components             → Re-exports ui + layout only
```

---

## Adding New Sections

1. Create `src/lib/components/features/[name]/[Name].svelte` + `index.ts`
2. Use `createSectionObserver` / `observeSection` from `$lib/utils/section-observer` for reveal
3. Apply `section-surface` + `section-padding` global classes (or equivalent token-based styles)
4. Add nav link to `Navbar.svelte` navLinks array using `/path` mono format
5. Import and place in `src/routes/(main)/+page.svelte`

---

## Infra Dashboard Patterns (`/infra`)

The infra route is a **hybrid surface** — it shares all structural tokens (surfaces, spacing, typography, depth) with the portfolio but uses `--accent-infra` (cyan) instead of `--accent-primary` (blue) to create a distinct ops-dashboard feel.

### Composition & Rhythm
The page uses **variable spacing** to create visual hierarchy — not uniform gaps:
- **Chrome zone** (header + HUD): tight `space-3` gap — they're metadata, not content
- **Chrome → content break**: `space-8` margin — breathing room before the working area
- **Content cards**: `space-5` gap — standard working density

### Infra Page Layout
```
.infra-page       — min-height: 100vh, bg-primary, theme transitions
.infra-container  — max-width: 64rem, no uniform gap (rhythm via chrome/main structure)
.infra-chrome     — flex column, space-3 gap, space-8 margin-bottom (tight header+HUD group)
.infra-header     — flex row: badge + title + theme toggle (pushed right)
.infra-main       — flex column, space-5 gap for working cards
```

### Infra Badge
Same pattern as Tags/Chips but using infra accent:
```css
font-family: var(--font-mono);
font-size: 0.625rem;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.1em;
color: var(--accent-infra);
background: var(--accent-infra-10);
padding: 0.25rem 0.625rem;
border-radius: 0.25rem;
```

### Telemetry Strip (ArchitectHUD)
Horizontal row of labeled metric cells on a `bg-secondary` surface:
- Labels: `0.6rem / 400 / uppercase / muted`
- Values: `0.75rem / 500 / text-primary` (restrained — not all cyan)
- **Status cell only** gets `accent-infra` color — it's the one value that means something at a glance
- Pulse dot: `6px`, `accent-infra` with `accent-infra-20` glow when live
- Wraps on mobile, trailing cell pushes right with `margin-left: auto`
- All gaps on 4px grid: cell gap `space-1` (4px), value icon gap `space-2` (8px)

### Hero Metric Card
The focal point of the dashboard — distinguished from other cards:
```css
background: var(--bg-secondary);
border: 1px solid var(--border-color);
border-top: 2px solid var(--accent-infra);  /* accent top border draws the eye */
border-radius: 0.75rem;
padding: var(--space-6);
gap: var(--space-1);  /* tight label-to-value spacing */
```
- Label: stat label pattern (`0.65rem / uppercase / muted`) — "Monthly Spend" not "Est. Monthly Spend"
- Value: `clamp(2rem, 5vw, 3rem) / 700 / text-primary / mono / line-height: 1`
- Context line: `0.7rem / text-muted / mono` — e.g. "3 snapshots tracked"

### Table Card
```css
background: var(--bg-secondary);
border: 1px solid var(--border-color);
border-radius: 0.75rem;
overflow: hidden;
```
- Header row: title (sans 0.875rem/600) + record count (mono 0.65rem/muted)
- `thead`: `bg-primary` background, `0.65rem / uppercase / muted` headers
- `tbody`: `text-secondary` cells, `border-color` row dividers, hover to `bg-primary`
- Commit hashes: `accent-infra` color
- Cost values: `text-primary / 600` weight, right-aligned

### Cost Simulator
Card with `bg-secondary` surface, `0.75rem` radius. Contains:
- Header: sans title + cyan `WHAT-IF` tag chip
- Baseline grid: 3-column stat cells, `space-1` (4px) label-to-value gap
- Sliders: 16px `accent-infra` thumbs on `border-color` track, `space-2` top margin
  - Hover: `accent-infra-light` + `accent-infra-10` ring (4px spread)
  - Active: `accent-infra-dark` + `accent-infra-20` ring
- Projection callout: `accent-infra-10` bg + `3px` cyan left border
- Delta: `text-muted` when neutral, `status-error` on increase, `status-success` on decrease
- Reset: ghost button, right-aligned in footer, hover/active to `accent-infra`/`accent-infra-dark`
