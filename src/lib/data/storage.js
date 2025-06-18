import fs from 'fs/promises';
import path from 'path';

const POSTS_FILE = path.resolve('src/lib/data/posts.json');

// Ensure posts.json exists
async function ensureFileExists() {
	try {
		await fs.access(POSTS_FILE);
	} catch {
		await fs.writeFile(POSTS_FILE, JSON.stringify([]));
	}
}

// Get all posts
export async function getPosts() {
	await ensureFileExists();
	const data = await fs.readFile(POSTS_FILE, 'utf-8');
	return JSON.parse(data);
}

// Create a new post
export async function createPost(post) {
	const posts = await getPosts();
	// Generate a proper ID based on the highest existing ID + 1
	const maxId = posts.length > 0 ? Math.max(...posts.map((p) => p.id || 0)) : 0;
	const newPost = {
		id: maxId + 1,
		...post,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	posts.push(newPost);
	await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
	return newPost;
}

// Update an existing post
export async function updatePost(id, postData) {
	const posts = await getPosts();
	const index = posts.findIndex((p) => p.id === Number(id));
	if (index === -1) throw new Error('Post not found');
	posts[index] = {
		...posts[index],
		...postData,
		updatedAt: new Date().toISOString()
	};
	await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
	return posts[index];
}

// Delete a post
export async function deletePost(id) {
	const posts = await getPosts();
	const filteredPosts = posts.filter((p) => p.id !== Number(id));
	await fs.writeFile(POSTS_FILE, JSON.stringify(filteredPosts, null, 2));
}
