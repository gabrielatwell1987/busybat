import { json } from '@sveltejs/kit';
import { updatePost } from '$lib/data/storage.js';
import { verifyToken } from '$lib/data/auth.js';

export async function POST({ request, cookies, params }) {
	if (!verifyToken(cookies.get('token'))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { title, content } = await request.json();
	await updatePost(params.id, { title, content });
	return json({ success: true });
}
