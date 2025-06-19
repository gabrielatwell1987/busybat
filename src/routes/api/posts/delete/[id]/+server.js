import { json } from '@sveltejs/kit';
import { deletePost } from '$lib/data/storage.js';
import { verifyToken } from '$lib/data/auth.js';

export async function POST({ cookies, params }) {
	if (!verifyToken(cookies.get('token'))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	await deletePost(params.id);

	return json({ success: true });
}
