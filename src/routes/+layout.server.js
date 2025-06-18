import { verifyToken } from '$lib/data/auth.js';

export function load({ cookies }) {
	const token = cookies.get('token');
	const user = token ? verifyToken(token) : null;
	return { user };
}
