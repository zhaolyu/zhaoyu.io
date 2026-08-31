# Case study draft: The CNBC.com Edge Migration

Status: **complete draft, not wired in.** Every section below is written and the entry
passes the shape gates on word count, sources, and structure. It is not in
`case-studies.ts` because four facts only Zhao holds are marked `[CONFIRM]`, and this
site does not ship invented receipts. Answer the questions at the bottom, and wiring it
in is a ten-minute pass: paste the entry, set `dateISO`, run `pnpm build && pnpm og`
(the study gets an OG card), and add the `/work/cnbc-com-edge-migration` link to
`static/llms.txt`.

Everything unmarked is sourced from the site's existing shipped copy, the verified
figures table, or public disclosures. The `migration-arch` diagram already exists
(`MigrationArchDiagram.svelte`) and matches the architecture section.

## The entry

```ts
{
  slug: 'cnbc-com-edge-migration',
  title: 'The CNBC.com Edge Migration',
  oneLiner:
    'Moving rendering and business logic from a client-side monolith to the network edge, without dropping a session.',
  role: 'Migration architect',
  period: '[CONFIRM: display years, e.g. "2022 to 2024" — no public source pins this and I will not invent it]',
  dateISO: '[set at publish, YYYY-MM-DD]',
  sections: {
    context: [
      'Market-moving days are a financial news business at its most valuable and its most fragile. When a Fed decision drops at 2pm, the audience arrives all at once, and the sessions in that spike are the most monetizable traffic of the quarter. The platform that holds them wins twice: the reader gets the number they came for, and the business keeps the ad impressions and the trust. CNBC digital serves ~47M average monthly unique visitors (ComScore, as reported at Versant\'s December 2025 Investor Day), and the days that matter most are exactly the days the load is worst.',
      'The platform this study replaced was a legacy client-side monolith. The browser downloaded the application, executed it, and only then fetched the data the reader came for. On a fast connection that ordering is invisible. On a phone during a market event it is seconds of blank page, and every one of those seconds is a reader deciding whether to wait. For a financial audience, latency is not a technical problem; it is a trust problem, and the trust is the product.',
      'Optimization campaigns inside that architecture kept buying back milliseconds while the application kept growing, because the constraint was structural: nothing paints before the client has downloaded and executed the application. The architecture set the floor, and the floor was too high. The question stopped being "how do we make this faster" and became "where should rendering happen at all."',
    ],
    constraints: [
      'The cutover had zero tolerance for downtime or revenue interruption. A news platform cannot take a maintenance window, because the news does not schedule itself around one, and the business behind the page (ad serving, analytics, subscriptions, the compliance obligations of a financial-media publisher) had to keep working through every phase of the migration. A cutover that broke measurement or ad delivery would have failed the business even with every page rendering faster.',
      'The traffic shape is spiky twice over: by schedule (Fed decisions, earnings, market open and close) and by surprise (breaking news). Any architecture had to be sized for the worst minute of the quarter, not the average hour, and either pay for that sizing around the clock or scale where the audience actually is.',
      'The audience is national and latency-sensitive at the tail, not the median. A reader far from the origin still pays the full round trip under an origin-rendered design, and the readers who arrive during a spike are disproportionately the ones the business cannot afford to lose.',
    ],
    options: [
      'Option one: keep optimizing the monolith in place. Code-splitting, deferral, aggressive caching. Rejected because the ceiling belonged to the architecture, not the code quality: client-side rendering means the critical path runs through JavaScript delivery and execution on the reader\'s device, and no amount of splitting changes whose hardware the render happens on.',
      'Option two: classic server-side rendering at origin. It fixes first paint, but it concentrates render load at the origin at the exact moment of the spike, which converts a delivery problem into an origin scaling problem sized by the worst minute of the quarter. It also leaves geography on the table: the round trip to origin is unchanged for the readers farthest from it.',
      'Option three: isomorphic rendering at the edge. The same React componentry renders at the CDN\'s points of presence, business and rendering logic deploy to Akamai EdgeWorkers, and the origin is reduced to data APIs. Compute moves to where the cache already is and where the audience already is; spike absorption becomes the CDN\'s native competence rather than an origin capacity plan. This won because it was the only option that addressed both halves of the problem, the render path and the spike, with one move.',
    ],
    decision: [
      'The call: isomorphic React running on Akamai EdgeWorkers, moving business and rendering logic to the network edge, with the origin serving data. I architected the migration [CONFIRM: one clause on how the decision was ratified, e.g. "and defended it through the platform architecture review" — who signed off?].',
      '[CONFIRM: the cutover mechanics. The shipped claim is zero downtime through the cutover; the study should say one honest sentence about how, e.g. progressive traffic shifting by route or percentage with rollback at the edge. Do not publish this paragraph until the mechanism is stated from memory, not inferred.]',
    ],
    architecture: {
      diagram: 'migration-arch',
      caption:
        'Before, every request traveled to the origin monolith, which rendered, reasoned, and served from one place, while the CDN passed traffic through and cached only static assets. After, Akamai EdgeWorkers render and serve at the points of presence closest to the reader, and the origin is contacted only for data. The spike lands on infrastructure that is already distributed to where the audience is.',
    },
    outcome: [
      {
        metric: 'p75 LCP',
        value: '1.7s',
        basis:
          'Chrome UX Report field data for www.cnbc.com, all devices, July 2026, with 85% of page loads inside the 2.5s "good" threshold',
        source: SOURCES.cruxCnbc,
      },
      {
        metric: 'Audience held',
        value: '~47M',
        basis:
          'U.S. average monthly unique visitors, Sept 2024 to Aug 2025 (ComScore), as reported at Versant Investor Day',
        source: SOURCES.versantInvestorDay2025,
      },
      {
        metric: 'Downtime through cutover',
        value: 'Zero',
        basis:
          'First-hand: no user-visible outage, lost sessions, or ad-impression interruption through the migration window',
      },
    ],
    regrets: [
      '[CONFIRM: this section is required by the gate and is the one that makes the study credible. Two candidate prompts, answer either from memory: (1) What did the edge runtime make harder than expected: local development parity, debugging at the PoP, observability into worker execution? (2) What would you sequence differently: which surface migrated first, and was it the right first surface? Write what actually went wrong; the site\'s standard is that a decision record without regrets is a brochure.]',
    ],
    myRoleVsTeam: [
      'The architecture was mine: the case for edge rendering, the shape of the isomorphic layer, and the contract between the edge and the origin. [CONFIRM: the team boundary, e.g. which teams built the worker runtime integration, the origin API changes, and the cutover tooling, stated the way the résumé would state it. The site\'s scope rules apply: describe what was yours precisely and credit the rest explicitly.]',
    ],
  },
  sources: [
    SOURCES.cruxCnbc,
    SOURCES.versantInvestorDay2025,
  ],
  relatedNotes: [
    'sovereign-resilience-why-i-over-index-on-edge-architecture',
    'the-url-is-the-source-of-truth',
    'idempotency-in-distributed-systems',
  ],
  stack: ['Isomorphic React', 'Akamai EdgeWorkers', 'Edge Rendering', 'High Scale'],
},
```

## The four questions blocking publication

1. **Period**: what display years does the migration cover? No public source states this,
   and the site never invents a date.
2. **Ratification**: who made or signed off the call, in one clause? "I architected" is
   shipped copy; the decision section should say how the decision was carried.
3. **Cutover mechanics**: one to two honest sentences on how zero-downtime was actually
   achieved (traffic shifting? route-by-route? rollback story?).
4. **Regrets and the team boundary**: the two `[CONFIRM]` blocks above, from memory.
   These are the sections a skeptical senior reader checks first, and the ones nobody
   but you can write.

Answer these in a message and the wiring pass (paste, dateISO, OG regen, llms.txt line,
writer-judge verdict, tests) is mechanical.
