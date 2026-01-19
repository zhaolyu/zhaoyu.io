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
	badge: 'SYSTEMS ARCHITECT & ATHLETE',
	headline: {
		primary: 'Built for Speed.',
		accent: 'Engineered for Scale.'
	},
	bio: "I am Zhao Yu, a Principal Engineer architecting high-scale media platforms. Whether I'm shaving milliseconds off a render or chasing a sub-1:25 half-marathon, I am driven by precision, metrics, and the relentless pursuit of speed.",
	cta: {
		primary: 'View Architecture',
		secondary: 'Read My Philosophy'
	},
	motto: ['Low Latency', 'Type Safe', 'Deep Focus']
};

export const skillsData: SkillsData = {
	skills: [
		{ name: 'UI Architecture', value: 98, goal: 98 },
		{ name: 'Tech Strategy', value: 85, goal: 90 },
		{ name: 'System Design', value: 75, goal: 85 },
		{ name: 'Backend / API', value: 45, goal: 75 },
		{ name: 'DevOps / Infra', value: 40, goal: 70 },
		{ name: 'Team Leadership', value: 85, goal: 90 }
	],
	stats: {
		yearsExp: '9+',
		lighthouse: 'Top 1%',
		halfMarathon: '<1:25'
	}
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
				{ label: 'Core Web Vitals', value: '100' },
				{ label: 'Latency', value: '-40%' }
			],
			image: 'migration-ui',
			diagram: 'migration-arch'
		},
		{
			title: 'Generative AI Interface',
			description:
				"Engineered the frontend architecture for CNBC's first consumer-facing AI tool. Solved complex HCI challenges including latency masking for token streaming, real-time citation rendering, and accessible state management for non-deterministic outputs.",
			tags: ['React', 'Streaming UI', 'Accessibility', 'HCI'],
			metrics: [
				{ label: 'Interaction', value: 'Real-time' },
				{ label: 'User Trust', value: 'Verified Sources' }
			],
			image: 'ai-ui',
			diagram: 'ai-state-machine'
		}
	]
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
		{ name: 'NBCUNIVERSAL', type: 'org' },
		{ name: 'CNBC', type: 'org' },
		{ name: 'VERCEL', type: 'tech' },
		{ name: 'NEXT.JS', type: 'tech' },
		{ name: 'TYPESCRIPT', type: 'tech' },
		{ name: 'VERSANT', type: 'org' }
	]
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
			title: 'Decoupling State from Render in LLM Streaming',
			date: 'Oct 2025',
			tags: ['React Performance', 'HCI', '60fps'],
			content: [
				'The naive approach to building an AI chat interface is to connect a Server-Sent Events (SSE) stream directly to a React state setter. Every time a new token chunk arrives (often at sub-50ms intervals), you call <code>setState(prev => prev + chunk)</code>.',
				'<strong>This is a performance trap.</strong> Triggering a reconciliation cycle on every single token blows through the browser\'s 16ms frame budget. The solution is to decouple ingestion from rendering. We utilized a mutable <code>useRef</code> buffer to capture high-velocity incoming chunks synchronously, then used a throttled flush mechanism (synced with <code>requestAnimationFrame</code>) to commit to the DOM only when the browser was ready to paint.'
			]
		},
		{
			title: 'The URL is the Source of Truth',
			date: 'Dec 2025',
			tags: ['Architecture', 'State Management', 'UX'],
			content: [
				'In modern SPAs, we often over-engineer state management stores (Redux, Zustand) for data that belongs in the URL. If a user filters a dashboard by "Status: Active" and refreshes the page, that filter should persist. If they send the link to a colleague, the colleague should see the same filtered view.',
				'If the state is not in the URL, it is ephemeral. My rule of thumb: <strong>If it changes the data payload, it belongs in the query string.</strong> Client-side stores should be reserved for truly transient UI states (like whether a modal is open or a menu is expanded), not for data definition.'
			]
		},
		{
			title: 'Idempotency in Distributed Systems',
			date: 'Jan 2026',
			tags: ['Backend', 'API Design', 'Reliability'],
			content: [
				'As I expand into backend architecture, the most critical concept I\'ve embraced is <strong>Idempotency</strong>. In a distributed system (like the microservices powering CNBC), network failures are inevitable. A client might send a "Purchase" request, the server processes it, but the acknowledgement fails.',
				'Without idempotency keys, the client retries, and the user gets charged twice. Designing APIs that can safely handle the exact same request <code>N</code> times without changing the result is not a feature—it\'s a requirement for resilience at scale.'
			]
		}
	]
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
		{ year: 2013, impact: 10, role: 'Associate', company: 'LaGuardia CC' },
		{ year: 2017, impact: 30, role: 'Software Engineer', company: 'CNBC' },
		{ year: 2019, impact: 50, role: 'Senior Engineer', company: 'NBC News' },
		{ year: 2021, impact: 70, role: 'Senior Manager', company: 'NBCUniversal' },
		{ year: 2025, impact: 90, role: 'Principal Engineer', company: 'Versant / CNBC' },
		{ year: 2026, impact: 100, role: 'Full Stack Architect', company: 'Projected' }
	]
};

export interface CodeStandard {
	key: string;
	title: string;
	bad: string;
	good: string;
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
const data = useQuery(['items', filter]);`
		},
		dry: {
			key: 'dry',
			title: 'WET > DRY', // Write Everything Twice > Don't Repeat Yourself
			bad: `// ❌ The Wrong Abstraction
// This component does too much
<Button 
  variant="primary" 
  hasIcon={true} 
  isLoading={loading} 
  isLink={false} 
  onClick={submit} 
/>`,
			good: `// ✅ Composition > Configuration
// Decoupled, explicit, and easy to delete
<button class="btn-primary">
  {#if loading}<Spinner />{/if}
  <Icon name="save" />
  <span>Submit</span>
</button>`
		}
	}
};
