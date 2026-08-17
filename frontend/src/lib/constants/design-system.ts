/**
 * The card index for the Claude Design hand-off.
 *
 * Each entry is prerendered at /design-system/{slug}; `pnpm design-system`
 * copies those pages into design-system/ as self-contained HTML with the
 * `@dsCard` marker Claude Design's Design System pane reads. Previews render
 * the real components, so a card cannot advertise a component the site no
 * longer ships — the same anti-drift rule the OG cards follow.
 */

export interface DesignSystemCard {
  /** URL segment and output filename. */
  slug: string;
  /** Human label on the card. */
  name: string;
  /** Section the Design System pane groups it under. */
  group: 'Foundations' | 'Components';
  /** Variants shown, for the card subtitle. */
  subtitle: string;
  /** Card dimensions in the pane. */
  viewport: { width: number; height: number };
}

export const DESIGN_SYSTEM_CARDS: DesignSystemCard[] = [
  {
    slug: 'color',
    name: 'Color roles',
    group: 'Foundations',
    subtitle: 'Ground, ink, accent, category and status — light and dark',
    viewport: { width: 1200, height: 900 },
  },
  {
    slug: 'surface',
    name: 'Surfaces & scrims',
    group: 'Foundations',
    subtitle: 'Ink-on-surface alphas that invert per theme',
    viewport: { width: 1200, height: 700 },
  },
  {
    slug: 'type',
    name: 'Type scale',
    group: 'Foundations',
    subtitle: '10 steps, 0.625rem to 4.5rem',
    viewport: { width: 1200, height: 1100 },
  },
  {
    slug: 'type-rhythm',
    name: 'Leading, tracking & weight',
    group: 'Foundations',
    subtitle: '4 leadings, 5 trackings, 5 weights',
    viewport: { width: 1200, height: 900 },
  },
  {
    slug: 'spacing',
    name: 'Spacing scale',
    group: 'Foundations',
    subtitle: '10 steps, 2xs to 5xl',
    viewport: { width: 1200, height: 800 },
  },
  {
    slug: 'radius',
    name: 'Radius',
    group: 'Foundations',
    subtitle: '5 steps plus a pill',
    viewport: { width: 1200, height: 500 },
  },
  {
    slug: 'elevation',
    name: 'Elevation',
    group: 'Foundations',
    subtitle: '3 shadows, redefined per theme',
    viewport: { width: 1200, height: 500 },
  },
  {
    slug: 'motion',
    name: 'Motion',
    group: 'Foundations',
    subtitle: '3 durations, 2 easings',
    viewport: { width: 1200, height: 500 },
  },
  {
    slug: 'system-card',
    name: 'System card',
    group: 'Components',
    subtitle: '3 categories x 6 statuses, with and without metrics',
    viewport: { width: 1200, height: 1000 },
  },
  {
    slug: 'note-card',
    name: 'Note excerpt card',
    group: 'Components',
    subtitle: 'Grid item linking to a canonical note',
    viewport: { width: 1200, height: 600 },
  },
  {
    slug: 'section-header',
    name: 'Section header',
    group: 'Components',
    subtitle: 'Eyebrow, headline, accent line',
    viewport: { width: 1200, height: 500 },
  },
];

export const designSystemCard = (slug: string): DesignSystemCard | undefined =>
  DESIGN_SYSTEM_CARDS.find((card) => card.slug === slug);
