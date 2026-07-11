/**
 * Content constants for landing page
 */

export interface HeroContent {
  badge: string;
  headline: {
    primary: string;
    accent: string;
  };
  bio: string;
  cta: {
    primary: string;
    secondary: string;
  };
  motto: string[];
}

export const heroContent: HeroContent = {
  badge: 'PRINCIPAL ENGINEER · CNBC',
  headline: {
    primary: 'Full Stack Engineer at CNBC.',
    accent: 'UI Focus & AI Integration Lead.',
  },
  bio: 'Principal Engineer at CNBC. Leading the migration to Isomorphic Akamai Edge Architecture for 50M+ monthly users. Architecting high-scale systems that achieve 1.1s LCP through performance-first engineering and governed AI integration — and shipping independent systems with the same production discipline outside of assigned work.',
  cta: {
    primary: 'View Selected Work',
    secondary: 'Read My AI Thesis',
  },
  motto: ['Low Latency', 'High Leverage', 'Deep Focus'],
};

export interface PerformanceMetric {
  label: string;
  value: string;
  sublabel: string;
}

export const performanceMetrics: PerformanceMetric[] = [
  { label: 'LCP', value: '1.1s', sublabel: 'CNBC.com · Top 1%' },
  { label: 'Monthly Users', value: '50M+', sublabel: 'CNBC Reach' },
  { label: 'Akamai TTFB', value: '<300ms', sublabel: 'EdgeWorkers · Global' },
  { label: 'Cache Hit Rate', value: '98.4%', sublabel: 'Akamai Edge Layer' },
  { label: 'Production Years', value: '9+', sublabel: 'Shipped at Scale' },
  { label: 'Core Web Vitals', value: 'Top 1%', sublabel: 'Lighthouse Score' },
];

export interface Project {
  title: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
  tags: string[];
  image: string;
  diagram?: string;
}

export interface ProjectsData {
  projects: Project[];
}

export const projectsData: ProjectsData = {
  projects: [
    {
      title: 'CNBC.com Next-Gen Migration',
      description:
        'Architected the migration of CNBC.com from a legacy client-side monolith to a high-performance Isomorphic Akamai Edge architecture. Business and rendering logic moved to Akamai EdgeWorkers — executing at the network edge, not origin. The result: <300ms global TTFB and a 1.1s LCP during market-moving events with 50M+ concurrent users and zero downtime.',
      tags: ['Isomorphic React', 'Akamai EdgeWorkers', 'High Scale', 'Performance'],
      metrics: [
        { label: 'LCP (TOP 1%)', value: '1.1s' },
        { label: 'AKAMAI TTFB', value: '<300ms' },
      ],
      image: 'migration-ui',
      diagram: 'migration-arch',
    },
    {
      title: 'CNBC AI Insight Engine',
      description:
        "Non-deterministic output requires deterministic UI. Engineered the frontend architecture for CNBC's first consumer-facing AI tool — solving the HCI paradox of maintaining user trust when data is streaming and non-deterministic. Built a latency masking layer for token rendering at 60fps and a real-time citation engine that maps AI-generated tokens to verified CNBC sources.",
      tags: ['React', 'Akamai Edge', 'Generative AI', 'HCI'],
      metrics: [
        { label: 'LATENCY MASKING', value: '60 FPS' },
        { label: 'CITATION ENGINE', value: 'Real-time' },
      ],
      image: 'ai-ui',
      diagram: 'ai-state-machine',
    },
  ],
};

export interface ExperienceItem {
  name: string;
  type: 'org' | 'tech';
}

export interface ExperienceData {
  items: ExperienceItem[];
}

export const experienceData: ExperienceData = {
  items: [
    // ORGANIZATIONS (The Authority)
    { name: 'NBCUNIVERSAL', type: 'org' },
    { name: 'NBC NEWS', type: 'org' },
    { name: 'VERSANT', type: 'org' },
    { name: 'CNBC', type: 'org' },

    // --- THE UI FOUNDATION ---
    { name: 'REACT', type: 'tech' },
    { name: 'NEXT.JS', type: 'tech' },
    { name: 'TYPESCRIPT', type: 'tech' },
    { name: 'TAILWIND', type: 'tech' },

    // --- THE PERFORMANCE & DATA LAYER (The "Principal" Edge) ---
    { name: 'AKAMAI', type: 'tech' },
    { name: 'SVELTE', type: 'tech' },
    { name: 'NODE.JS', type: 'tech' },
    { name: 'GRAPHQL', type: 'tech' },
    { name: 'MONGODB', type: 'tech' },

    // --- AI & BUILDER SIGNALS ---
    { name: 'CURSOR', type: 'tech' },
    { name: 'CLAUDE CODE', type: 'tech' },
    { name: 'PGLITE', type: 'tech' },
    { name: 'PYTHON', type: 'tech' },
  ],
};

export interface EngineeringNote {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string[];
}

export interface NotesData {
  notes: EngineeringNote[];
}

export const notesData: NotesData = {
  notes: [
    {
      slug: 'why-i-made-this-site-readable-by-machines-not-just-humans',
      title: 'Why I Made This Site Readable by Machines, Not Just Humans',
      date: 'Jul 2026',
      tags: ['AI Engineering', 'SEO', 'Structured Data'],
      content: [
        'Recruiters and hiring pipelines increasingly route through an AI agent before a human ever opens a tab. A portfolio site built only for a person scrolling and reading is now serving half its actual audience. So I added the other half: an <code>llms.txt</code> at the site root — a plain-text summary of who I am and what I\'ve built, structured for a language model\'s context window rather than a browser\'s rendering engine — JSON-LD <code>Person</code> schema on every page, and real canonical URLs for these notes at <code>/blog/{slug}</code> instead of leaving them buried as anchors inside one long scrolling page. Same content, now individually addressable, cacheable, and citable.',
        'The more interesting find while doing this wasn\'t a feature, it was a bug. My static-site adapter\'s SPA fallback page and the prerendered root route both wanted the filename <code>index.html</code>, and the fallback was winning the write — silently replacing the real homepage (title, description, Open Graph tags, all of it) with an empty shell at build time. Every crawler and every link preview had been getting nothing. The fix was a one-line rename, but the lesson generalizes: <strong>a static site\'s build output is not implied by its source — verify what actually ships</strong>, especially at the config layer nobody re-reads after initial setup.',
      ],
    },
    {
      slug: 'the-three-tiers-of-using-ai-and-why-only-two-matter-now',
      title: 'The Three Tiers of Using AI, and Why Only Two of Them Still Differentiate You',
      date: 'Jul 2026',
      tags: ['AI Engineering', 'Agent Architecture', 'Career'],
      content: [
        'There\'s a real difference between using AI as a faster typist — autocomplete, chat-assisted edits, "fix this bug for me" — and delegating a bounded unit of work to an agent that plans, executes across multiple files, and hands you a diff to review. The first tier is now table stakes; every engineer I work with has a model open in a side pane, and it stopped being a differentiator the moment it became the default. The tiers above it — an agent working a scoped task end-to-end, or several agents running in parallel with their own permission boundaries — are where the actual leverage still lives, because almost nobody has restructured how they delegate work to get there.',
        'As the person who sets AI-adoption standards for my org, I spend almost none of my time on prompting technique. I spend it on the guardrails: what an agent can touch unsupervised, what requires a human review gate before it ships, and what "done" has to prove before I believe it. This site\'s agent-readable rewrite — the notes, the structured data, the build-output bug above — was built the same way: scoped to specific files, verified against the existing type-check, lint, test, and build gates before anything shipped, with the plan surfaced for review rather than pushed silently. <strong>"I use AI" stopped being the differentiator. Whether you can hand an agent a boundary and a review bar — instead of still typing every line yourself — is the one that\'s left.</strong>',
      ],
    },
    {
      slug: 'building-with-ai-the-compound-advantage',
      title: 'Building with AI: The Compound Advantage',
      date: 'Feb 2026',
      tags: ['AI Engineering', 'Productivity', 'Meta'],
      content: [
        'I built most of this site using Claude Code. Not as a novelty — as a deliberate workflow. The components you\'re reading, the type errors that blocked deployment, the engineering notes you\'re reading: almost all of it happened through a tight loop of prompting, reviewing, and committing. My job was taste and judgment, not keystrokes.',
        'The thing I didn\'t expect was the <em>qualitative</em> shift, not just the speed. When implementation cost drops low enough, you stop filtering ideas at the "is this worth building?" stage. You just build. The compounding isn\'t in the individual tasks — it\'s in the number of experiments you run. An engineer who ships 10 experiments a week learns differently than one who ships 2. AI doesn\'t change what you can build; it changes how many times you can try.',
      ],
    },
    {
      slug: 'sovereign-resilience-why-i-over-index-on-edge-architecture',
      title: 'Sovereign Resilience: Why I Over-Index on Edge Architecture',
      date: 'Jan 2026',
      tags: ['Architecture', 'Edge Computing', 'Independence'],
      content: [
        'The CNBC architecture I maintain runs at the edge: request handling, personalization logic, and cache invalidation all execute as close to the user as possible. No single region, no single cloud dependency, no single point of failure. When us-east-1 degrades during a market-moving event, traffic routes around it. The system doesn\'t panic — it degrades gracefully.',
        'I\'ve started applying the same pattern to my own work. A skill portfolio concentrated in one employer, one domain, one team is a <strong>single point of failure</strong>. Redundancy at the edge means building capabilities that can execute independently — full-stack range, local-first tooling, systems you own outright. Not as a hedge against any specific outcome, but because optionality compounds quietly until the moment it matters all at once.',
      ],
    },
    {
      slug: 'idempotency-in-distributed-systems',
      title: 'Idempotency in Distributed Systems',
      date: 'Jan 2026',
      tags: ['Backend', 'API Design', 'Reliability'],
      content: [
        'Working on live news infrastructure taught me that <strong>failures are not exceptional — they are scheduled</strong>. When a Fed rate decision drops at 2pm, every monitoring system, every analytics pipeline, every content update fires simultaneously. Network partitions happen. Acknowledgements get dropped. The question is never "will this request fail?" — it\'s "what happens when it does?"',
        'Idempotency keys are the answer. The design rule I now apply to every API: <strong>the client should always be able to safely retry.</strong> If handing you the same request twice produces different side effects, the design isn\'t finished. This matters even more in event-driven systems where the cost of double-processing — a duplicate trade entry, a duplicate webhook delivery, a duplicate analytics event — compounds faster than the failure that triggered the retry.',
      ],
    },
    {
      slug: 'the-url-is-the-source-of-truth',
      title: 'The URL is the Source of Truth',
      date: 'Dec 2025',
      tags: ['Architecture', 'State Management', 'UX'],
      content: [
        'In modern SPAs, we often over-engineer state management stores (Redux, Zustand) for data that belongs in the URL. If a user filters a dashboard by "Status: Active" and refreshes the page, that filter should persist. If they send the link to a colleague, the colleague should see the same filtered view.',
        'If the state is not in the URL, it is ephemeral. My rule of thumb: <strong>If it changes the data payload, it belongs in the query string.</strong> Client-side stores should be reserved for truly transient UI states (like whether a modal is open or a menu is expanded), not for data definition.',
      ],
    },
    {
      slug: 'decoupling-state-from-render-in-llm-streaming',
      title: 'Decoupling State from Render in LLM Streaming',
      date: 'Oct 2025',
      tags: ['React Performance', 'HCI', '60fps'],
      content: [
        'The naive approach to building an AI chat interface is to connect a Server-Sent Events (SSE) stream directly to a React state setter. Every time a new token chunk arrives (often at sub-50ms intervals), you call <code>setState(prev => prev + chunk)</code>.',
        "<strong>This is a performance trap.</strong> Triggering a reconciliation cycle on every single token blows through the browser's 16ms frame budget. The solution is to decouple ingestion from rendering. We utilized a mutable <code>useRef</code> buffer to capture high-velocity incoming chunks synchronously, then used a throttled flush mechanism (synced with <code>requestAnimationFrame</code>) to commit to the DOM only when the browser was ready to paint.",
      ],
    },
  ],
};

export interface CareerPoint {
  year: number;
  impact: number; // 0-100
  role: string;
  company: string;
}

export interface CareerHistory {
  points: CareerPoint[];
}

export const careerHistory: CareerHistory = {
  points: [
    { year: 2016, impact: 10, role: 'Intern', company: 'CNBC' },
    { year: 2017, impact: 30, role: 'Software Engineer', company: 'CNBC' },
    { year: 2019, impact: 50, role: 'Senior Engineer', company: 'NBC News' },
    { year: 2021, impact: 70, role: 'Senior Manager', company: 'NBCUniversal' },
    { year: 2025, impact: 90, role: 'Principal Engineer', company: 'Versant / CNBC' },
    { year: 2027, impact: 100, role: 'Architect + Builder', company: 'Dual Track' },
  ],
};

export interface BuilderProject {
  title: string;
  category: 'professional' | 'independent' | 'experiment';
  description: string;
  stack: string[];
  status: 'shipped' | 'in-progress' | 'exploring';
  metrics?: Array<{ label: string; value: string }>;
}

export const builderProjects: BuilderProject[] = [
  {
    title: 'CNBC UI Factory Initiative',
    category: 'professional',
    description:
      'Architecting CNBC\'s next-generation component system. Establishing UI standards, performance budgets, and design token systems that scale across 200+ page templates serving a global newsroom.',
    stack: ['React', 'Akamai EdgeWorkers', 'GraphQL', 'Node.js'],
    status: 'in-progress',
    metrics: [
      { label: 'Templates', value: '200+' },
      { label: 'LCP', value: 'Top 1%' },
    ],
  },
  {
    title: 'CNBC AI Integration',
    category: 'professional',
    description:
      'Driving AI feature adoption at CNBC: streaming UI patterns, token rendering at 60fps, citation management, and the HCI principles that make non-deterministic outputs trustworthy for financial news consumers.',
    stack: ['React', 'SSE', 'Streaming UI', 'HCI'],
    status: 'in-progress',
    metrics: [
      { label: 'Interaction', value: 'Real-time' },
      { label: 'Frame Rate', value: '60 FPS' },
    ],
  },
  {
    title: 'Cost-Guard: Infra Dashboard',
    category: 'experiment',
    description:
      'Local-first cloud cost monitoring using PGlite + ElectricSQL. Zero-latency reads, real-time sync, and what-if simulations for infrastructure spend. Personal observability tooling built with AI-assisted development.',
    stack: ['SvelteKit', 'PGlite', 'ElectricSQL', 'TypeScript'],
    status: 'in-progress',
    metrics: [
      { label: 'Sync', value: 'Real-time' },
      { label: 'Storage', value: 'Local-first' },
    ],
  },
];

export interface NarrativeBio {
  title: string;
  paragraphs: string[];
}

export const narrativeBio: NarrativeBio = {
  title: 'The Modernizer',
  paragraphs: [
    'My career began as a web developer intern at CNBC, and over the last nine years I have evolved into a Principal Software Engineer overseeing the architecture of one of the world\'s most prominent financial news platforms.',
    'Beyond UI architecture, I serve as the AI Integration Lead, where I formalize the standards for AI-assisted development across the organization. My leadership philosophy is built on "Plan-first" execution — ensuring that tools like Cursor and Claude are utilized as disciplined velocity multipliers that adhere to strict security and compliance guardrails.',
    'Outside of architecting enterprise systems or building developer tools like Cost-Guard, I am a competitive long-distance runner. I believe the endurance and discipline required to complete a 50k ultramarathon are the same traits needed to lead complex, multi-year technical transformations.',
  ],
};

export interface PersonaItem {
  title: string;
  body: string[];
}

export const personaData: PersonaItem[] = [
  {
    title: 'The Engineering Philosophy',
    body: [
      'Latency is the enemy of trust. Whether it\'s a financial ticker during a market spike or a UI transition on a slow network, delay creates doubt. Every millisecond removed is a unit of confidence restored.',
      'The UI Factory model is the operational expression of this: treat UI production like manufacturing, not craftsmanship. Standards, budgets, and repeatability over one-off heroics.',
    ],
  },
  {
    title: 'The Bridge',
    body: [
      'I operate at the intersection of Product and Engineering. I don\'t build to spec — I partner with product leaders to define what is technically possible at scale.',
      'I translate Akamai EdgeWorker configurations into business value, connect latency improvements to revenue impact, and push back when the roadmap is wrong.',
    ],
  },
  {
    title: 'Endurance Engineering',
    body: [
      'Off the clock, I trade latency metrics for endurance miles. I apply the same optimization mindset to running as I do to code: instrument everything, reduce friction, compound marginal gains.',
      'Sub-1:25 half-marathon. 50K ultra finish. The discipline carries.',
    ],
  },
  {
    title: 'The Search for the Gold Standard',
    body: [
      'I\'m drawn to systems that prioritize precision and craft. In NYC, that means chasing the best Japanese food — Omakase, Kaiseki, the obsession with quality over volume.',
      'In markets, it means studying equity structures and the secondary dynamics of Pokémon TCG as a lens for value, scarcity, and liquidity. I enjoy the game theory of high-value systems wherever I find them.',
    ],
  },
];

export interface CodeStandard {
  key: string;
  title: string;
  bad: string;
  good: string;
  note: string;
}

export interface CodeStandards {
  standards: Record<string, CodeStandard>;
}

export const codeStandards: CodeStandards = {
  standards: {
    state: {
      key: 'state',
      title: 'URL > Store',
      bad: `// ❌ The "Sync" Trap
const [filter, setFilter] = useState('all');

// Bug: Not shareable, resets on reload
useEffect(() => {
  fetchData(filter);
}, [filter]);`,
      good: `// ✅ The URL is Truth
const searchParams = useSearchParams();
const filter = searchParams.get('filter') ?? 'all';

// The UI is just a reflection of the URL
const data = useQuery(['items', filter]);`,
      note: "If the user can't share the state via a URL, the state shouldn't exist.",
    },
    dry: {
      key: 'dry',
      title: 'WET > DRY', // Write Everything Twice > Don't Repeat Yourself
      bad: `// ❌ The "Universal" Button
// Starts simple, eventually handles 50 edge cases
const Button = ({ 
  isPrimary, isSecondary, isLink, isLoading, 
  hasIcon, iconPos, ...props 
}) => {
  if (isLink) return <a ... />;
  return (
    <button className={isPrimary ? 'red' : 'blue'}>
       {isLoading ? <Spinner /> : props.children}
    </button>
  );
}`,
      good: `// ✅ Decoupled & Composable
// Duplication is cheaper than the wrong abstraction.

const PrimaryButton = ({ children, ...props }) => (
  <button className="bg-blue-500 text-white" {...props}>
    {children}
  </button>
);

const LinkButton = ({ href, children }) => (
  <a href={href} className="text-blue-500 underline">
    {children}
  </a>
);`,
      note: 'The wrong abstraction is far more expensive to fix than a little duplication.',
    },
    server: {
      key: 'server',
      title: 'SERVER > CLIENT',
      bad: `// ❌ The Network Waterfall
// The user stares at a spinner while JS loads, 
// then executes, then fetches.
function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user').then(setUser);
  }, []);

  if (!user) return <Spinner />;
  return <Profile user={user} />;
}`,
      good: `// ✅ Zero-Bundle Data Access
// Data is ready before the HTML even hits the browser.

export default async function Dashboard() {
  const user = await db.user.findFirst();

  return <Profile user={user} />;
}
// No useEffect. No spinners. No client JS.`,
      note: 'Shift the heavy lifting to the server. Send HTML, not JSON.',
    },
    latency: {
      key: 'latency',
      title: 'LATENCY > TRUST',
      bad: `// ❌ The Performance Afterthought
// "We'll optimize it later." Nobody ships "later."

const Page = async () => {
  const hero   = await fetchHeroImage();    // 800ms
  const ticker = await fetchMarketData();   // 600ms
  const news   = await fetchTopStories();   // 400ms
  // Total: 1800ms. On a slow network: 3s+.
  return <Layout hero={hero} ticker={ticker} news={news} />;
};`,
      good: `// ✅ Parallel at the Edge
// Every blocking ms costs user trust. Eliminate it.

const Page = async () => {
  const [hero, ticker, news] = await Promise.all([
    fetchHeroImage(),    // All three
    fetchMarketData(),   // fire at
    fetchTopStories(),   // the same time.
  ]);
  // Total: 800ms (the slowest one). Not 1800ms.
  return <Layout hero={hero} ticker={ticker} news={news} />;
};`,
      note: 'If the UI stutters, the user disengages. Latency is not a technical problem — it is a trust problem.',
    },
    ai: {
      key: 'ai',
      title: 'PLAN-FIRST AI',
      bad: `// ❌ The Vibe Coder
// 1. Code doesn't work.
// 2. Paste error into Claude.
// 3. Accept whatever it generates.
// 4. Hope it doesn't break prod.
// 5. Repeat.

// This is not AI-augmented engineering.
// This is technical debt generation at scale.`,
      good: `// ✅ The Orchestrator
// 1. Define the spec (types, contracts, edge cases).
// 2. Prompt with full context, not just the error.
// 3. Review every line. Understand every diff.
// 4. Run tests. Check coverage. Verify intent.

// Rule: If you can't explain what it wrote,
// you don't own the code — it does.`,
      note: "AI is a force multiplier, not a replacement for taste. Every AI-assisted commit must pass the same review bar as a human-written one.",
    },
  },
};
