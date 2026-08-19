/**
 * The design system's own index of itself.
 *
 * `app.css` is the source of truth — these entries mirror it so previews and
 * the Claude Design hand-off bundle can enumerate tokens, which CSS custom
 * properties cannot do at build time. `design-tokens.test.ts` parses app.css
 * and fails when the two disagree, which is the only thing stopping this file
 * from quietly going stale. Same guard idiom as og.test.ts.
 */

export interface DesignToken {
  /** Custom property name without the leading `--`. */
  name: string;
  /** Light-theme value exactly as declared in app.css. */
  value: string;
  /** What it's for — becomes the caption in the design-system preview. */
  usage: string;
  /** Present when `.dark` redefines the token. */
  dark?: string;
}

export interface TokenGroup {
  id: string;
  title: string;
  /** Rendered above the swatches; explains the rule the group encodes. */
  description: string;
  tokens: DesignToken[];
}

export const colorTokens: TokenGroup = {
  id: 'color',
  title: 'Color roles',
  description:
    'Roles, not hues. Every component styles through these, so a theme switch is a token swap rather than a per-component override.',
  tokens: [
    { name: 'bg-primary', value: '#ffffff', dark: '#111827', usage: 'Page and section ground' },
    { name: 'bg-secondary', value: '#f9fafb', dark: '#1f2937', usage: 'Raised card surface' },
    { name: 'text-primary', value: '#111827', dark: '#f9fafb', usage: 'Headings, emphasis' },
    { name: 'text-secondary', value: '#4b5563', dark: '#d1d5db', usage: 'Body prose' },
    { name: 'text-muted', value: '#6b7280', dark: '#9ca3af', usage: 'Labels, captions' },
    {
      name: 'border-color',
      value: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.1)',
      usage: 'Default hairline',
    },
    { name: 'accent-primary', value: '#3b82f6', usage: 'Primary accent, focus ring' },
    { name: 'accent-primary-hover', value: '#2563eb', usage: 'Accent hover state' },
    { name: 'accent-primary-light', value: '#60a5fa', usage: 'Accent on dark grounds, links' },
    { name: 'accent-primary-dark', value: '#1d4ed8', usage: 'Accent pressed state' },
    { name: 'accent-infra', value: '#06b6d4', usage: 'Infra dashboard accent' },
    {
      name: 'accent-professional',
      value: '#1d4ed8',
      dark: '#60a5fa',
      usage: 'Professional category badge',
    },
    {
      name: 'accent-independent',
      value: '#b45309',
      dark: '#fbbf24',
      usage: 'Independent category badge',
    },
    {
      name: 'accent-experiment',
      value: '#0e7490',
      dark: '#22d3ee',
      usage: 'Experiment category badge',
    },
  ],
};

export const statusTokens: TokenGroup = {
  id: 'status',
  title: 'Status & state',
  description:
    'Semantic state, separate from the category accents: a shipped badge and a profitable P&L are the same idea, a professional project and an independent one are not. The bare token is the fill; -text is the readable end and flips per theme; -10/-20 are the tints components used to hand-roll as one-off rgba().',
  tokens: [
    { name: 'status-success', value: '#10b981', usage: 'Fill: healthy dot, positive bar' },
    { name: 'status-warning', value: '#fbbf24', usage: 'Fill: degraded, caution' },
    { name: 'status-error', value: '#ef4444', usage: 'Fill: failed, loss' },
    { name: 'status-info', value: '#3b82f6', usage: 'Fill: neutral signal, baseline' },
    {
      name: 'status-success-text',
      value: 'oklch(52% 0.15 150)',
      dark: 'oklch(74% 0.17 150)',
      usage: 'Positive delta, gain as text',
    },
    {
      name: 'status-warning-text',
      value: 'oklch(52% 0.13 75)',
      dark: 'oklch(80% 0.15 85)',
      usage: 'Marginal value as text',
    },
    {
      name: 'status-error-text',
      value: 'oklch(52% 0.19 25)',
      dark: 'oklch(70% 0.19 25)',
      usage: 'Negative delta, loss as text',
    },
    {
      name: 'status-info-text',
      value: 'oklch(48% 0.18 255)',
      dark: 'oklch(72% 0.14 250)',
      usage: 'Neutral emphasis as text',
    },
    {
      name: 'status-success-10',
      value: 'rgba(16, 185, 129, 0.1)',
      dark: 'rgba(62, 207, 127, 0.1)',
      usage: 'Pill and row tint',
    },
    {
      name: 'status-success-20',
      value: 'rgba(16, 185, 129, 0.2)',
      dark: 'rgba(62, 207, 127, 0.2)',
      usage: 'Pill border, hover tint',
    },
    {
      name: 'status-warning-10',
      value: 'rgba(251, 191, 36, 0.1)',
      dark: 'rgba(224, 168, 0, 0.1)',
      usage: 'Pill and row tint',
    },
    {
      name: 'status-warning-20',
      value: 'rgba(251, 191, 36, 0.2)',
      dark: 'rgba(224, 168, 0, 0.2)',
      usage: 'Pill border, hover tint',
    },
    {
      name: 'status-error-10',
      value: 'rgba(239, 68, 68, 0.1)',
      dark: 'rgba(255, 107, 98, 0.1)',
      usage: 'Pill and row tint',
    },
    {
      name: 'status-error-20',
      value: 'rgba(239, 68, 68, 0.2)',
      dark: 'rgba(255, 107, 98, 0.2)',
      usage: 'Pill border, hover tint',
    },
    {
      name: 'status-info-10',
      value: 'rgba(59, 130, 246, 0.1)',
      dark: 'rgba(99, 168, 245, 0.1)',
      usage: 'Pill and row tint',
    },
    {
      name: 'status-info-20',
      value: 'rgba(59, 130, 246, 0.2)',
      dark: 'rgba(99, 168, 245, 0.2)',
      usage: 'Pill border, hover tint',
    },
  ],
};

export const vizTokens: TokenGroup = {
  id: 'data-viz',
  title: 'Data-viz series',
  description:
    'Fixed lightness and chroma, hue-only variance, so no series in a multi-line chart reads as more important than another. Chart chrome is deliberately not a series: grid, axis and reference are muted and the reference line is always dashed. Two ramps, because mark density changes optimal lightness: the base set for a few strokes, the -dense set for canvases with more marks than a legend can name. Eight categorical slots, then fold to --viz-quiet — a repeated hue claims a kinship that isn’t there. A class distinction always has a second channel besides hue: dash for “this link does not exist yet”, width and luminance for emphasis. Colour assists; it never carries the class alone. A categorical palette is validated all-pairs against its ground, not swatch-by-swatch: two hues that each pass against the background can still be indistinguishable from each other.',
  tokens: [
    {
      name: 'viz-series-1',
      value: 'oklch(52% 0.15 250)',
      dark: 'oklch(72% 0.15 250)',
      usage: 'Default single series, ensemble',
    },
    {
      name: 'viz-series-2',
      value: 'oklch(52% 0.15 190)',
      dark: 'oklch(72% 0.15 190)',
      usage: 'Second series',
    },
    {
      name: 'viz-series-3',
      value: 'oklch(52% 0.15 85)',
      dark: 'oklch(72% 0.15 85)',
      usage: 'Third series',
    },
    {
      name: 'viz-series-4',
      value: 'oklch(52% 0.15 320)',
      dark: 'oklch(72% 0.15 320)',
      usage: 'Fourth series',
    },
    {
      name: 'viz-series-5',
      value: 'oklch(52% 0.15 150)',
      dark: 'oklch(72% 0.15 150)',
      usage: 'Fifth series',
    },
    {
      name: 'viz-grid',
      value: 'rgba(0, 0, 0, 0.06)',
      dark: 'rgba(255, 255, 255, 0.06)',
      usage: 'Gridline',
    },
    {
      name: 'viz-axis',
      value: 'rgba(0, 0, 0, 0.15)',
      dark: 'rgba(255, 255, 255, 0.15)',
      usage: 'Axis rule',
    },
    { name: 'viz-reference', value: '#6b7280', dark: '#9ca3af', usage: 'Dashed reference line' },
    { name: 'viz-series-1-dense', value: 'oklch(55% 0.15 250)', usage: 'Dense canvas series 1' },
    { name: 'viz-series-2-dense', value: 'oklch(55% 0.15 190)', usage: 'Dense canvas series 2' },
    { name: 'viz-series-3-dense', value: 'oklch(55% 0.15 85)', usage: 'Dense canvas series 3' },
    { name: 'viz-series-4-dense', value: 'oklch(55% 0.15 320)', usage: 'Dense canvas series 4' },
    { name: 'viz-series-5-dense', value: 'oklch(55% 0.15 150)', usage: 'Dense canvas series 5' },
    { name: 'viz-series-6-dense', value: 'oklch(55% 0.15 45)', usage: 'Dense canvas series 6' },
    { name: 'viz-series-7-dense', value: 'oklch(55% 0.15 300)', usage: 'Cluster lens slot 7' },
    { name: 'viz-series-8-dense', value: 'oklch(55% 0.15 20)', usage: 'Cluster lens slot 8' },
    {
      name: 'viz-structure',
      value: '#6b7280',
      dark: '#9ca3af',
      usage: 'Structure marks, nav nodes',
    },
    {
      name: 'viz-quiet',
      value: '#9ca3af',
      dark: '#6b7280',
      usage: 'Quiet marks, categorical overflow',
    },
    { name: 'viz-conflict', value: '#e66767', usage: 'Contradiction — signal, not error' },
  ],
};

export const surfaceTokens: TokenGroup = {
  id: 'surface',
  title: 'Surfaces & scrims',
  description:
    'Ink-on-surface alphas, promoted out of one component’s private token set. They invert under .dark, where light-mode alphas read as mud.',
  tokens: [
    {
      name: 'scrim-subtle',
      value: 'rgba(0, 0, 0, 0.02)',
      dark: 'rgba(255, 255, 255, 0.03)',
      usage: 'Faintest inset fill',
    },
    {
      name: 'scrim-soft',
      value: 'rgba(0, 0, 0, 0.03)',
      dark: 'rgba(255, 255, 255, 0.05)',
      usage: 'Inset panel, code block',
    },
    {
      name: 'border-subtle',
      value: 'rgba(0, 0, 0, 0.06)',
      dark: 'rgba(255, 255, 255, 0.08)',
      usage: 'Internal divider',
    },
    {
      name: 'border-soft',
      value: 'rgba(0, 0, 0, 0.07)',
      dark: 'rgba(255, 255, 255, 0.1)',
      usage: 'Chrome border',
    },
    {
      name: 'ink-faint',
      value: 'rgba(0, 0, 0, 0.18)',
      dark: 'rgba(255, 255, 255, 0.22)',
      usage: 'Decorative placeholder text',
    },
    {
      name: 'ink-dim',
      value: 'rgba(0, 0, 0, 0.38)',
      dark: 'rgba(255, 255, 255, 0.42)',
      usage: 'Chrome label',
    },
    {
      name: 'ink-quiet',
      value: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(255, 255, 255, 0.55)',
      usage: 'Secondary chrome text',
    },
  ],
};

export const spacingTokens: TokenGroup = {
  id: 'spacing',
  title: 'Spacing scale',
  description:
    'Step names, not multipliers. The scale opens up as it grows, so numeric names would promise arithmetic these values do not keep.',
  tokens: [
    { name: 'space-2xs', value: '0.25rem', usage: 'Icon nudges, fine alignment' },
    { name: 'space-xs', value: '0.5rem', usage: 'Badge and tag padding' },
    { name: 'space-sm', value: '0.75rem', usage: 'Compact gaps' },
    { name: 'space-md', value: '1rem', usage: 'Inline padding, small gaps' },
    { name: 'space-lg', value: '1.5rem', usage: 'Component internal spacing' },
    { name: 'space-xl', value: '2rem', usage: 'Card and panel padding' },
    { name: 'space-2xl', value: '3rem', usage: 'Section header margin' },
    { name: 'space-3xl', value: '4rem', usage: 'Mobile section padding' },
    { name: 'space-4xl', value: '6rem', usage: 'Standard section padding' },
    { name: 'space-5xl', value: '8rem', usage: 'Generous section padding' },
  ],
};

export const typeTokens: TokenGroup = {
  id: 'type',
  title: 'Type scale',
  description:
    'Size, leading and tracking are separate groups because they do not pair one-to-one: display sizes want tight leading and negative tracking, body sizes want the opposite.',
  tokens: [
    { name: 'type-2xs', value: '0.625rem', usage: 'Badge, stack tag' },
    { name: 'type-xs', value: '0.75rem', usage: 'Eyebrow, metric label' },
    { name: 'type-sm', value: '0.875rem', usage: 'Card body, dense UI' },
    { name: 'type-base', value: '1rem', usage: 'Default body' },
    { name: 'type-md', value: '1.125rem', usage: 'Lead paragraph' },
    { name: 'type-lg', value: '1.25rem', usage: 'Note title, card heading' },
    { name: 'type-xl', value: '1.5rem', usage: 'Hero bio, sub-headline' },
    { name: 'type-2xl', value: '2rem', usage: 'Section title (mobile)' },
    { name: 'type-3xl', value: '3rem', usage: 'Section title' },
    { name: 'type-4xl', value: '4.5rem', usage: 'Hero headline' },
  ],
};

export const typeRhythmTokens: TokenGroup = {
  id: 'type-rhythm',
  title: 'Leading, tracking & weight',
  description:
    'The other half of the type system. Kept as separate groups so a display size can take tight leading and negative tracking while a body size takes neither.',
  tokens: [
    { name: 'leading-tight', value: '1.1', usage: 'Display headlines' },
    { name: 'leading-snug', value: '1.3', usage: 'Card and note titles' },
    { name: 'leading-normal', value: '1.6', usage: 'Default body' },
    { name: 'leading-relaxed', value: '1.75', usage: 'Long-form prose' },
    { name: 'tracking-tight', value: '-0.025em', usage: 'Display sizes only' },
    { name: 'tracking-normal', value: '0', usage: 'Body, sentence-case labels' },
    { name: 'tracking-wide', value: '0.05em', usage: 'Permalinks, small caps' },
    { name: 'tracking-wider', value: '0.1em', usage: 'Mono labels' },
    { name: 'tracking-widest', value: '0.15em', usage: 'Category badges' },
    { name: 'weight-light', value: '300', usage: 'Hero bio, long prose' },
    { name: 'weight-regular', value: '400', usage: 'Default' },
    { name: 'weight-medium', value: '500', usage: 'Mono emphasis' },
    { name: 'weight-semibold', value: '600', usage: 'Inline strong' },
    { name: 'weight-bold', value: '700', usage: 'Headings, metric values' },
  ],
};

export const radiusTokens: TokenGroup = {
  id: 'radius',
  title: 'Radius',
  description: 'Four steps plus a pill. Cards sit at lg; anything rounder is a badge or a dot.',
  tokens: [
    { name: 'radius-xs', value: '0.25rem', usage: 'Stack tag, inline code' },
    { name: 'radius-sm', value: '0.375rem', usage: 'Inputs, small controls' },
    { name: 'radius-md', value: '0.5rem', usage: 'Panels' },
    { name: 'radius-lg', value: '0.75rem', usage: 'Cards' },
    { name: 'radius-xl', value: '1rem', usage: 'Feature surfaces' },
    { name: 'radius-full', value: '9999px', usage: 'Pills, badges, status dots' },
  ],
};

export const elevationTokens: TokenGroup = {
  id: 'elevation',
  title: 'Elevation',
  description:
    'Redefined under .dark rather than reused: a 5% black shadow is invisible against a #111827 ground.',
  tokens: [
    {
      name: 'shadow-sm',
      value: '0 1px 2px rgba(0, 0, 0, 0.05)',
      dark: '0 1px 2px rgba(0, 0, 0, 0.3)',
      usage: 'Resting card',
    },
    {
      name: 'shadow-md',
      value: '0 4px 20px rgba(0, 0, 0, 0.06)',
      dark: '0 4px 20px rgba(0, 0, 0, 0.35)',
      usage: 'Raised chrome',
    },
    {
      name: 'shadow-lg',
      value: '0 8px 24px rgba(0, 0, 0, 0.08)',
      dark: '0 8px 24px rgba(0, 0, 0, 0.4)',
      usage: 'Hover lift',
    },
  ],
};

export const motionTokens: TokenGroup = {
  id: 'motion',
  title: 'Motion',
  description:
    'Durations are short by policy: this is a site about latency. Every one of these is disabled wholesale under prefers-reduced-motion.',
  tokens: [
    { name: 'duration-fast', value: '0.15s', usage: 'Hover, focus' },
    { name: 'duration-base', value: '0.2s', usage: 'Theme transition' },
    { name: 'duration-slow', value: '0.4s', usage: 'Section reveal' },
    { name: 'ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', usage: 'Entrances' },
    { name: 'ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', usage: 'State changes' },
  ],
};

/** Every foundation group, in the order the design system presents them. */
export const tokenGroups: TokenGroup[] = [
  colorTokens,
  statusTokens,
  vizTokens,
  surfaceTokens,
  typeTokens,
  typeRhythmTokens,
  spacingTokens,
  radiusTokens,
  elevationTokens,
  motionTokens,
];

/**
 * Prefixes this registry claims to cover completely. A token in app.css that
 * starts with one of these but is missing here fails the coverage test — that
 * is how a newly added token gets pulled into the design system instead of
 * living only in CSS. Families deliberately excluded: `accent-*-10/20/30`
 * (derived alphas), `scrollbar-*` (browser chrome), `section-*` (aliases of
 * spacing steps), and the Tailwind `@theme` font families.
 *
 * The asymmetry with `status-*-10/20`, which ARE covered, is deliberate: the
 * accent alphas are derived from a hue that is already listed, while the status
 * tints are the contract that stops the next dashboard from inventing
 * `rgba(63, 185, 80, 0.15)` by hand. So they get enumerated.
 */
export const COVERED_PREFIXES = [
  'space-',
  'type-',
  'leading-',
  'tracking-',
  'weight-',
  'radius-',
  'shadow-',
  'duration-',
  'ease-',
  'scrim-',
  'ink-',
  'status-',
  'viz-',
  'border-subtle',
  'border-soft',
] as const;
