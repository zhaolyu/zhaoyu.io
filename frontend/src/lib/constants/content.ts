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

export interface Skill {
  name: string;
  value: number;
  goal?: number;
}

export interface SkillsData {
  skills: Skill[];
  stats: {
    yearsExp: string;
    lighthouse: string;
    halfMarathon: string;
  };
}

export const heroContent: HeroContent = {
  badge: 'PRINCIPAL ENGINEER & INDEPENDENT BUILDER',
  headline: {
    primary: 'Systems Architect by Day.',
    accent: 'Building the Next Thing by Night.',
  },
  bio: 'I am Zhao Yu — a Principal Engineer who designs high-scale media platforms serving millions, and an independent builder obsessed with leverage, optionality, and AI-augmented engineering. The same discipline that drives a sub-1:25 half-marathon drives every system I ship.',
  cta: {
    primary: 'View Architecture',
    secondary: 'Read My AI Thesis',
  },
  motto: ['Low Latency', 'High Leverage', 'Deep Focus'],
};

export const skillsData: SkillsData = {
  skills: [
    { name: 'UI Architecture', value: 98, goal: 98 },
    { name: 'Tech Strategy', value: 85, goal: 90 },
    { name: 'System Design', value: 75, goal: 85 },
    { name: 'Backend / API', value: 45, goal: 75 },
    { name: 'DevOps / Infra', value: 40, goal: 70 },
    { name: 'Team Leadership', value: 85, goal: 90 },
  ],
  stats: {
    yearsExp: '9+',
    lighthouse: '[redacted]',
    halfMarathon: '<1:25',
  },
};

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
        'Architected the complete migration of CNBC.com from a legacy monolith to a distributed custom isomorphic React app. The goal: handle millions of concurrent users during market-moving events with zero downtime.',
      tags: ['Custom Isomorphic React', 'Edge Computing', 'High Scale', 'Performance'],
      metrics: [
        { label: 'LCP (TOP 1%)', value: '1.1s' },
        { label: 'EDGE TTFB', value: '300ms' },
      ],
      image: 'migration-ui',
      diagram: 'migration-arch',
    },
    {
      title: 'Generative AI Interface',
      description:
        "Engineered the frontend architecture for CNBC's first consumer-facing AI tool. Solved complex HCI challenges including latency masking for token streaming, real-time citation rendering, and accessible state management for non-deterministic outputs.",
      tags: ['React', 'Streaming UI', 'Accessibility', 'HCI'],
      metrics: [
        { label: 'Interaction', value: 'Real-time' },
        { label: 'User Trust', value: 'Verified Sources' },
      ],
      image: 'ai-ui',
      diagram: 'ai-state-machine',
    },
  ],
};

/**
 * Get projects to display on the landing page
 * Filters out projects that should not be shown (e.g., work in progress)
 */
export function getDisplayProjects(): Project[] {
  return projectsData.projects.filter((p) => p.title !== 'Generative AI Interface');
}

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
    title: 'Large-Scale Architecture Redesign',
    category: 'professional',
    description:
      'Leading a comprehensive platform migration for a major media property. Coordinating across teams to modernize distributed rendering, caching layers, and API contracts.',
    stack: ['React', 'Edge Computing', 'GraphQL', 'Node.js'],
    status: 'in-progress',
    metrics: [
      { label: 'Scale', value: 'Millions DAU' },
      { label: 'LCP', value: '[redacted]' },
    ],
  },
  {
    title: 'AI-Augmented Chat Interface',
    category: 'independent',
    description:
      'Full-stack conversational UI with streaming token rendering, citation management, and latency masking. Built entirely with AI-assisted tooling on personal hardware.',
    stack: ['SvelteKit', 'Cursor', 'SSE', 'Edge Functions'],
    status: 'in-progress',
  },
  {
    title: 'Quantitative Decision Engine',
    category: 'independent',
    description:
      'Data ingestion pipeline with NLP sentiment analysis, probabilistic position sizing, and calibration tracking. Exploring the intersection of macro thesis and automated decision-making.',
    stack: ['Python', 'NLP', 'Time Series', 'Kelly Criterion'],
    status: 'exploring',
  },
  {
    title: 'Local-First Infrastructure Dashboard',
    category: 'experiment',
    description:
      'Cost monitoring tool using PGlite + ElectricSQL for local-first sync, zero-latency reads, and what-if simulations. Built as a personal infra observability layer.',
    stack: ['SvelteKit', 'PGlite', 'ElectricSQL', 'TypeScript'],
    status: 'in-progress',
    metrics: [
      { label: 'Sync', value: 'Real-time' },
      { label: 'Storage', value: 'Local-first' },
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
  },
};
