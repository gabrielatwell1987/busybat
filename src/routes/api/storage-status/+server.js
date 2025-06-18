import fs from 'fs/promises';
import path from 'path';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	let isFileSystemWritable = false;
	let statusMessage = '';

	try {
		// Test if we can write to the file system
		const testFile = path.resolve('test-write.tmp');
		await fs.writeFile(testFile, 'test');
		await fs.unlink(testFile);
		isFileSystemWritable = true;
		statusMessage = 'File system storage (changes persist)';
	} catch {
		isFileSystemWritable = false;
		statusMessage = 'In-memory storage (changes reset on restart)';
	}

	return new Response(
		JSON.stringify({
			isFileSystemWritable,
			statusMessage
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
