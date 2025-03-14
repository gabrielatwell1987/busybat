/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');

// This script helps fix svelte/compiler resolution issues
try {
	// Create a symlink to help with compiler resolution
	const sveltePath = path.resolve('./node_modules/svelte');
	const compilerDestPath = path.resolve('./node_modules/svelte/compiler');

	if (!fs.existsSync(compilerDestPath)) {
		console.log('Creating svelte/compiler symlink for Vercel compatibility');
		if (!fs.existsSync(path.dirname(compilerDestPath))) {
			fs.mkdirSync(path.dirname(compilerDestPath), { recursive: true });
		}

		fs.writeFileSync(compilerDestPath + '.js', 'module.exports = require("svelte/compiler.js");');

		console.log('Created compiler symlink');
	}
} catch (err) {
	console.error('Error creating symlinks:', err);
}
