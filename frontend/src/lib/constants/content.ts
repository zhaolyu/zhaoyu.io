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
  badge: 'PRINCIPAL ENGINEER · VERSANT / CNBC',
  headline: {
    primary: "Building CNBC's Next Platform.",
    accent: 'AI Product Architect & Team Lead.',
  },
  bio: "Principal Engineer co-leading 20 engineers on the ground-up 2026 rebuild of CNBC.com. Sole frontend engineer for CNBC's first AI product — a multi-agent financial assistant shipped in four months. Governing AI-assisted development across 3 teams with 25% faster velocity.",
  cta: {
    primary: 'View Selected Work',
    secondary: 'Read My AI Thesis',
  },
  motto: ['Think in Systems', 'Ship in Weeks', 'AI as Infrastructure'],
};

export interface PerformanceMetric {
  label: string;
  value: string;
  sublabel: string;
}

export const performanceMetrics: PerformanceMetric[] = [
  { label: 'Engineers Led', value: '20+', sublabel: 'CNBC Platform Rebuild' },
  { label: 'Premium Subscribers', value: '170K+', sublabel: 'CNBC PRO Platform' },
  { label: 'Platform Revenue', value: '$50–55M', sublabel: 'ARR · CNBC PRO' },
  { label: 'Velocity Gain', value: '+25%', sublabel: 'AI-Governed Teams' },
  { label: 'Time to Ship', value: '4 months', sublabel: 'CNBC AI Product' },
  { label: 'Production Years', value: '9+', sublabel: 'Shipped at Scale' },
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
      title: 'CNBC.com 2026 Platform Rebuild',
      description:
        "Co-leading 20 engineers to architect CNBC.com's next-generation Micro-Frontend framework from scratch — the technical foundation for 170K+ premium subscribers generating $50–55M ARR. This is a ground-up rebuild replacing a legacy architecture with a composable, independently-deployable component system designed to unlock CNBC's subscriber growth targets through 2027.",
      tags: ['Micro-Frontend', 'TypeScript', 'Composable UI', 'Platform Architecture'],
      metrics: [
        { label: 'PREMIUM SUBSCRIBERS', value: '170K+' },
        { label: 'PLATFORM REVENUE', value: '$50–55M' },
      ],
      image: 'migration-ui',
      diagram: 'migration-arch',
    },
    {
      title: 'CNBC Financial Assistant',
      description:
        "Sole frontend engineer and product bridge for CNBC's first user-facing AI product — a financial assistant for premium subscribers. Architected the full UI and spec'd the agentic pipeline with the backend team, translating product requirements into architectural decisions across both surfaces.",
      tags: ['Multi-Agent AI', 'MCP', 'React', 'HCI'],
      metrics: [
        { label: 'TIME TO SHIP', value: '4 months' },
        { label: 'BETA USERS', value: '200+' },
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
    { name: 'MCP', type: 'tech' },
    { name: 'SVELTE', type: 'tech' },
    { name: 'NODE.JS', type: 'tech' },
    { name: 'GRAPHQL', type: 'tech' },
    { name: 'MONGODB', type: 'tech' },

    // --- AI & BUILDER SIGNALS ---
    { name: 'CURSOR', type: 'tech' },
    { name: 'CLAUDE CODE', type: 'tech' },
    { name: 'PULUMI', type: 'tech' },
    { name: 'PYTHON', type: 'tech' },
  ],
};

export interface EngineeringNote {
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
      title: 'Building with AI: The Compound Advantage',
      date: 'Feb 2026',
      tags: ['AI Engineering', 'Productivity', 'Meta'],
      content: [
        'I built most of this site using Claude Code. Not as a novelty — as a deliberate workflow. The components you\'re reading, the type errors that blocked deployment, the engineering notes you\'re reading: almost all of it happened through a tight loop of prompting, reviewing, and committing. My job was taste and judgment, not keystrokes.',
        'The thing I didn\'t expect was the <em>qualitative</em> shift, not just the speed. When implementation cost drops low enough, you stop filtering ideas at the "is this worth building?" stage. You just build. The compounding isn\'t in the individual tasks — it\'s in the number of experiments you run. An engineer who ships 10 experiments a week learns differently than one who ships 2. AI doesn\'t change what you can build; it changes how many times you can try.',
      ],
    },
    {
      title: 'Sovereign Resilience: Why I Over-Index on Edge Architecture',
      date: 'Jan 2026',
      tags: ['Architecture', 'Edge Computing', 'Independence'],
      content: [
        'The CNBC architecture I maintain runs at the edge: request handling, personalization logic, and cache invalidation all execute as close to the user as possible. No single region, no single cloud dependency, no single point of failure. When us-east-1 degrades during a market-moving event, traffic routes around it. The system doesn\'t panic — it degrades gracefully.',
        'I\'ve started applying the same pattern to my own work. A skill portfolio concentrated in one employer, one domain, one team is a <strong>single point of failure</strong>. Redundancy at the edge means building capabilities that can execute independently — full-stack range, local-first tooling, systems you own outright. Not as a hedge against any specific outcome, but because optionality compounds quietly until the moment it matters all at once.',
      ],
    },
    {
      title: 'Idempotency in Distributed Systems',
      date: 'Jan 2026',
      tags: ['Backend', 'API Design', 'Reliability'],
      content: [
        'Working on live news infrastructure taught me that <strong>failures are not exceptional — they are scheduled</strong>. When a Fed rate decision drops at 2pm, every monitoring system, every analytics pipeline, every content update fires simultaneously. Network partitions happen. Acknowledgements get dropped. The question is never "will this request fail?" — it\'s "what happens when it does?"',
        'Idempotency keys are the answer. The design rule I now apply to every API: <strong>the client should always be able to safely retry.</strong> If handing you the same request twice produces different side effects, the design isn\'t finished. This matters even more in event-driven systems where the cost of double-processing — a duplicate trade entry, a duplicate webhook delivery, a duplicate analytics event — compounds faster than the failure that triggered the retry.',
      ],
    },
    {
      title: 'The URL is the Source of Truth',
      date: 'Dec 2025',
      tags: ['Architecture', 'State Management', 'UX'],
      content: [
        'In modern SPAs, we often over-engineer state management stores (Redux, Zustand) for data that belongs in the URL. If a user filters a dashboard by "Status: Active" and refreshes the page, that filter should persist. If they send the link to a colleague, the colleague should see the same filtered view.',
        'If the state is not in the URL, it is ephemeral. My rule of thumb: <strong>If it changes the data payload, it belongs in the query string.</strong> Client-side stores should be reserved for truly transient UI states (like whether a modal is open or a menu is expanded), not for data definition.',
      ],
    },
    {
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
    title: 'CNBC.com 2026 Rebuild',
    category: 'professional',
    description:
      "Co-leading 20 engineers to architect CNBC.com's next-generation Micro-Frontend platform from scratch — the technical foundation for 170K+ premium subscribers generating $50–55M ARR. Architecting for composability, independent deployability, and subscriber growth through 2027.",
    stack: ['Micro-Frontend', 'TypeScript', 'React', 'Node.js'],
    status: 'in-progress',
    metrics: [
      { label: 'Engineers', value: '20+' },
      { label: 'ARR', value: '$50–55M' },
    ],
  },
  {
    title: 'CNBC Financial Assistant',
    category: 'professional',
    description:
      "Sole frontend engineer and product bridge for CNBC's first user-facing AI product. Built the entire UI and spec'd the multi-step agentic pipeline (MCP) with the backend team. Shipped in four months — currently in beta with 200 subscribers, scaling to 170K.",
    stack: ['React', 'MCP', 'Multi-Agent AI', 'HCI'],
    status: 'in-progress',
    metrics: [
      { label: 'Time to Ship', value: '4 months' },
      { label: 'Beta Users', value: '200+' },
    ],
  },
  {
    title: 'Cost-Guard: Infra Dashboard',
    category: 'experiment',
    description:
      'Cloud cost governance platform on GCP that shifts spend accountability into the development workflow. Correlates estimated IaC costs from GitHub Actions with actual BigQuery spend data, using ElectricSQL for real-time local-first sync. Built with Cloud Run, Pub/Sub, and Pulumi.',
    stack: ['GCP', 'Cloud Run', 'Pulumi', 'ElectricSQL'],
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
    'My career began as a web developer intern at CNBC in 2016, and over the last nine years I have evolved into a Principal Software Engineer — currently co-leading a 20-engineer team on the ground-up 2026 rebuild of CNBC.com. The platform we are building is the technical foundation for 170K+ premium subscribers generating $50–55M ARR, designed to unlock subscriber growth targets through 2027.',
    'Beyond the platform rebuild, I created the AI Integration Lead role and served as the sole frontend engineer and product bridge for CNBC\'s first user-facing AI product — a multi-agent financial assistant for premium subscribers, shipped in four months. I govern AI-assisted development across 20+ engineers on three teams, enforcing a plan-first approach that treats tools like Cursor and Claude as disciplined velocity multipliers with strict security and compliance guardrails.',
    'Outside of architecting enterprise systems or building developer tools like Cost-Guard, I am a competitive long-distance runner. I believe the endurance and discipline required to complete a 50K ultramarathon are the same traits needed to lead complex, multi-year technical transformations.',
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
      'The platform rebuild is the operational expression of this: a composable, standards-driven Micro-Frontend architecture where every component has a performance budget, not just a design spec.',
    ],
  },
  {
    title: 'The Bridge',
    body: [
      'I operate at the intersection of Product and Engineering. I don\'t build to spec — I partner with product leaders to define what is technically possible at scale.',
      'I translate multi-agent pipeline architectures into product decisions, connect subscriber growth targets to technical tradeoffs, and push back when the roadmap is wrong.',
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
