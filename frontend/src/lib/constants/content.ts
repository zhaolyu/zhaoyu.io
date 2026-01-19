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
				'Architected the complete migration of CNBC.com from a legacy monolith to a distributed Next.js edge architecture. The goal: handle millions of concurrent users during market-moving events with zero downtime.',
			tags: ['Next.js', 'Edge Computing', 'High Scale', 'Performance'],
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

export interface ExperienceData {
	companies: string[];
}

export const experienceData: ExperienceData = {
	companies: ['NBCUNIVERSAL', 'CNBC', 'VERCEL', 'NEXT.JS', 'TYPESCRIPT', 'VERSANT']
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
			date: 'Feb 2026',
			tags: ['React Performance', 'SSE', '60fps'],
			content: [
				'The naive approach to building an AI chat interface is to connect a Server-Sent Events (SSE) stream directly to a React state setter. Every time a new token chunk arrives (often at sub-50ms intervals), you call <code>setState(prev => prev + chunk)</code>.',
				'<strong>This is a performance trap.</strong> Triggering a React reconciliation cycle on every single token blows through the browser\'s 16ms frame budget, causing noticeable jank and layout thrashing as the response grows long. The UI cannot keep up with the socket.',
				'The solution is to decouple ingestion from rendering. We utilized a mutable <code>useRef</code> buffer to capture high-velocity incoming chunks synchronously without triggering a re-render. We then used a throttled flush mechanism (synced with <code>requestAnimationFrame</code>) to commit that buffer to real React state only when the browser was ready to paint the next frame.',
				'This ensured a smooth "typewriter" effect, regardless of the throughput of the backend inference engine.'
			]
		}
	]
};
