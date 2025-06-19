import { json } from '@sveltejs/kit';
import { createPost } from '$lib/data/storage.js';
import { verifyToken } from '$lib/data/auth.js';
import fs from 'fs/promises';
import path from 'path';

export async function POST({ request, cookies }) {
	if (!verifyToken(cookies.get('token'))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const title = formData.get('title');
		const content = formData.get('content');
		const imageFile = formData.get('image');

		if (!title || !content) {
			return json({ error: 'Title and content are required' }, { status: 400 });
		}

		let imagePath = null;

		// Handle image upload if present
		if (imageFile && imageFile.size > 0) {
			// Validate file type
			if (!imageFile.type.startsWith('image/')) {
				return json({ error: 'Only image files are allowed' }, { status: 400 });
			}

			// Validate file size (e.g., max 5MB)
			if (imageFile.size > 5 * 1024 * 1024) {
				return json({ error: 'Image file too large (max 5MB)' }, { status: 400 });
			}

			// Create unique filename
			const fileExtension = path.extname(imageFile.name);
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
			const uploadDir = path.join(process.cwd(), 'static', 'uploads');
			const filePath = path.join(uploadDir, fileName); // Ensure upload directory exists

			try {
				await fs.mkdir(uploadDir, { recursive: true });
			} catch {
				console.warn('Upload directory already exists or could not be created');
			}

			// Save file
			try {
				const arrayBuffer = await imageFile.arrayBuffer();
				const buffer = new Uint8Array(arrayBuffer);
				await fs.writeFile(filePath, buffer);
				imagePath = `/uploads/${fileName}`;
			} catch (error) {
				console.error('Failed to save image:', error);
				return json({ error: 'Failed to save image' }, { status: 500 });
			}
		}

		const postData = { title, content };
		if (imagePath) {
			postData.image = imagePath;
		}

		const newPost = await createPost(postData);

		return json({ success: true, post: newPost });
	} catch (error) {
		console.error('Error creating post:', error);

		return json({ error: 'Failed to create post' }, { status: 500 });
	}
}
