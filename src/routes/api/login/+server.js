import { json } from '@sveltejs/kit';
import { authenticate } from '$lib/data/auth.js';

export async function POST({ request }) {
	const { username, password } = await request.json();
	const token = await authenticate(username, password);
	if (token) {
		return json({ token });
	}
	return json({ error: 'Invalid credentials' }, { status: 401 });
}
