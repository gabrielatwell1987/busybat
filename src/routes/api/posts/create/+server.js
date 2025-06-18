import { json } from '@sveltejs/kit';
import { createPost } from '$lib/data/storage.js';
import { verifyToken } from '$lib/data/auth.js';

export async function POST({ request, cookies }) {
	if (!verifyToken(cookies.get('token'))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { title, content } = await request.json();
	const newPost = await createPost({ title, content });
	return json({ success: true, post: newPost });
}
