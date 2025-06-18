import { json } from '@sveltejs/kit';
import { getPosts } from '$lib/data/storage.js';

export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
