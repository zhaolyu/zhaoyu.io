import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
	if (!browser) return 'light';
	
	// Check localStorage first
	const stored = localStorage.getItem('theme') as Theme | null;
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	
	// Fall back to system preference
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	
	return 'light';
}

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		toggle: () => {
			update((theme) => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', newTheme);
					document.documentElement.classList.toggle('dark', newTheme === 'dark');
				}
				return newTheme;
			});
		},
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.classList.toggle('dark', theme === 'dark');
			}
			set(theme);
		},
		init: () => {
			if (browser) {
				const theme = getInitialTheme();
				document.documentElement.classList.toggle('dark', theme === 'dark');
			}
		}
	};
}

export const theme = createThemeStore();
