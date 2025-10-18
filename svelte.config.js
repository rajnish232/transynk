import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: true,
			strict: true
		}),
		paths: {
			relative: false,
		},
		env: {
			publicPrefix: "VITE_",
			privatePrefix: "PRI_",
		},
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: [
				'/',
				'/about',
				'/pricing',
				'/contact',
				'/convert',
				'/compress-images',
				'/compress-files',
				'/resize-images',
				'/pdf-to-word',
				'/jpg-to-png',
				'/mp4-to-mp3'
			]
		}
	},
};

export default config;
