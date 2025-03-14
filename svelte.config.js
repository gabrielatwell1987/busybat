/* eslint-disable no-unused-vars */
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			external: [],
			deps: ['svelte']
		})
	},

	compilerOptions: {
		runes: true
	}
};

try {
	// Try to require svelte/compiler to check if it's available
	require('svelte/compiler');
} catch (e) {
	console.warn('Warning: svelte/compiler not found in config, continuing anyway');
}

export default config;
