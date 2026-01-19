import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: process.env.VITEST ? [] : [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib'),
			'$app/environment': path.resolve(__dirname, './src/app.d.ts')
		}
	}
});
