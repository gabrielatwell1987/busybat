import { kv } from '@vercel/kv';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	let isDatabaseConnected = false;
	let statusMessage = '';

	try {
		// Test if we can connect to Vercel KV
		await kv.ping();
		isDatabaseConnected = true;
		statusMessage = 'Database storage (Vercel KV - changes persist across devices)';
	} catch {
		isDatabaseConnected = false;
		statusMessage = 'Database unavailable (using fallback data - posts may not persist)';
	}

	return new Response(
		JSON.stringify({
			isDatabaseConnected,
			statusMessage
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
