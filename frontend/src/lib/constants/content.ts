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
}

export interface SkillsData {
	skills: Skill[];
	stats: {
		yearsExp: string;
		lighthouse: string;
	};
}

export const heroContent: HeroContent = {
	badge: 'SYSTEMS ARCHITECT & ATHLETE',
	headline: {
		primary: 'Built for Speed.',
		accent: 'Engineered for Scale.'
	},
	bio: "I am Zhao Yu, a Principal Engineer in big media. Whether I'm optimizing a rendering engine or training for a sub-1:25 half-marathon, I believe in discipline, metrics, and continuous improvement.",
	cta: {
		primary: 'View Architecture',
		secondary: 'Read My Philosophy'
	},
	motto: ['Fast Load Times', 'Clean Code', 'Clear Mind']
};

export const skillsData: SkillsData = {
	skills: [
		{ name: 'UI Architecture', value: 95 },
		{ name: 'System Design', value: 85 },
		{ name: 'Team Leadership', value: 80 },
		{ name: 'DevOps / Cloud', value: 70 },
		{ name: 'Backend / API', value: 85 },
		{ name: 'Strategy', value: 75 }
	],
	stats: {
		yearsExp: '9+',
		lighthouse: 'Top 1%'
	}
};
