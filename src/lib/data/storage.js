import fs from 'fs/promises';
import path from 'path';

const POSTS_FILE = path.resolve('src/lib/data/posts.json');

// Global state for posts storage
let postsCache = null;
let isFileSystemWritable = null;

// Test if file system is writable (for production vs development detection)
async function testFileSystemWritable() {
	if (isFileSystemWritable !== null) return isFileSystemWritable;

	try {
		const testFile = path.resolve('test-write.tmp');
		await fs.writeFile(testFile, 'test');
		await fs.unlink(testFile);
		isFileSystemWritable = true;
	} catch {
		isFileSystemWritable = false;
	}

	return isFileSystemWritable;
}

// Load initial posts data
async function loadInitialPosts() {
	if (postsCache !== null) return postsCache;

	try {
		// Try to read from posts.json file first
		const data = await fs.readFile(POSTS_FILE, 'utf-8');
		postsCache = JSON.parse(data);
	} catch {
		// If file doesn't exist or can't be read, use default posts
		postsCache = [
			{
				id: 1,
				title: 'Welcome to Our Blog!',
				content:
					"We're excited to launch our new blog where we'll share updates, insights, and stories. Stay tuned for more exciting content coming your way!",
				createdAt: '2025-06-18T10:00:00.000Z'
			},
			{
				id: 2,
				title: 'Behind the Scenes',
				content:
					"Ever wondered what goes on behind the scenes? In this post, we'll take you through our creative process and show you how we bring our ideas to life.",
				createdAt: '2025-06-17T14:30:00.000Z'
			}
		];
	}

	return postsCache;
}

// Save posts to file if possible, otherwise keep in memory
async function savePosts(posts) {
	postsCache = posts;

	const canWrite = await testFileSystemWritable();
	if (canWrite) {
		try {
			await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
		} catch (error) {
			console.warn('Failed to write posts to file, using in-memory storage:', error.message);
		}
	}
}

// Get all posts
export async function getPosts() {
	return await loadInitialPosts();
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
	const updatedPosts = [...posts, newPost];
	await savePosts(updatedPosts);
	return newPost;
}

// Update an existing post
export async function updatePost(id, postData) {
	const posts = await getPosts();
	const index = posts.findIndex((p) => p.id === Number(id));
	if (index === -1) throw new Error('Post not found');

	const updatedPosts = [...posts];
	updatedPosts[index] = {
		...updatedPosts[index],
		...postData,
		updatedAt: new Date().toISOString()
	};

	await savePosts(updatedPosts);
	return updatedPosts[index];
}

// Delete a post
export async function deletePost(id) {
	const posts = await getPosts();
	const filteredPosts = posts.filter((p) => p.id !== Number(id));
	await savePosts(filteredPosts);
}
