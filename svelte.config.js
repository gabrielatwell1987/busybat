import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		files: {
			assets: 'static',
			lib: 'src/lib',
			routes: 'src/routes',
			appTemplate: 'src/app.html'
		}
	}
};

export default config;
