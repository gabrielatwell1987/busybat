// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';

// export default defineConfig({
// 	plugins: [sveltekit()]
// });

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Add this for better CSS support
	css: {
		postcss: true
	},
	// Add this to help with Svelte dependency resolution
	resolve: {
		dedupe: ['svelte', '@sveltejs/kit']
	},
	// Add this to help with bundling
	ssr: {
		noExternal: ['svelte']
	}
});
