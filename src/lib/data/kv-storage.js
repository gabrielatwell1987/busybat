import { kv } from '@vercel/kv';

// Check if KV environment variables are available
const isKVAvailable = () => {
	return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
};

// Key for storing posts in KV
const POSTS_KEY = 'blog_posts';
const POSTS_INDEX_KEY = 'blog_posts_index'; // For storing the list of post IDs

// In-memory storage fallback for development
let memoryPosts = null;

// Default posts for initial setup
const DEFAULT_POSTS = [
	{
		id: 1,
		title: 'Welcome to Our Blog!',
		content:
			"We're excited to launch our new blog where we'll share updates, insights, and stories. Stay tuned for more exciting content coming your way!",
		createdAt: '2025-06-18T10:00:00.000Z'
	}
];

// Get all posts
export async function getPosts() {
	if (!isKVAvailable()) {
		// Use in-memory storage when KV is not available
		if (!memoryPosts) {
			memoryPosts = [...DEFAULT_POSTS];
		}
		return memoryPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	}

	try {
		// Get the list of post IDs
		const postIds = await kv.get(POSTS_INDEX_KEY);

		if (!postIds || postIds.length === 0) {
			// Initialize with default posts
			await initializeDefaultPosts();
			return DEFAULT_POSTS;
		}

		// Get all posts using the IDs
		const posts = [];
		for (const id of postIds) {
			const post = await kv.get(`${POSTS_KEY}:${id}`);
			if (post) {
				posts.push(post);
			}
		}

		// Sort by creation date (newest first)
		return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	} catch (error) {
		console.error('Error getting posts from KV:', error);
		// Fallback to default posts if KV fails
		return DEFAULT_POSTS;
	}
}

// Get a single post by ID
export async function getPostById(id) {
	if (!isKVAvailable()) {
		// Use in-memory storage when KV is not available
		if (!memoryPosts) {
			memoryPosts = [...DEFAULT_POSTS];
		}
		const post = memoryPosts.find((p) => p.id === Number(id));
		if (!post) {
			throw new Error('Post not found');
		}
		return post;
	}

	try {
		const post = await kv.get(`${POSTS_KEY}:${id}`);
		if (!post) {
			throw new Error('Post not found');
		}
		return post;
	} catch (error) {
		console.error('Error getting post from KV:', error);
		throw new Error('Post not found');
	}
}

// Create a new post
export async function createPost(postData) {
	if (!isKVAvailable()) {
		// Use in-memory storage when KV is not available
		if (!memoryPosts) {
			memoryPosts = [...DEFAULT_POSTS];
		}
		const maxId = memoryPosts.length > 0 ? Math.max(...memoryPosts.map((p) => p.id)) : 0;
		const newPost = {
			id: maxId + 1,
			...postData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		memoryPosts.push(newPost);
		return newPost;
	}

	try {
		// Get current post IDs to generate new ID
		const postIds = (await kv.get(POSTS_INDEX_KEY)) || [];
		const maxId = postIds.length > 0 ? Math.max(...postIds) : 0;
		const newId = maxId + 1;

		const newPost = {
			id: newId,
			...postData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		// Store the post
		await kv.set(`${POSTS_KEY}:${newId}`, newPost);

		// Update the index
		const updatedIds = [...postIds, newId];
		await kv.set(POSTS_INDEX_KEY, updatedIds);

		return newPost;
	} catch (error) {
		console.error('Error creating post in KV:', error);
		throw new Error('Failed to create post');
	}
}

// Update an existing post
export async function updatePost(id, postData) {
	if (!isKVAvailable()) {
		// Use in-memory storage when KV is not available
		if (!memoryPosts) {
			memoryPosts = [...DEFAULT_POSTS];
		}
		const index = memoryPosts.findIndex((p) => p.id === Number(id));
		if (index === -1) {
			throw new Error('Post not found');
		}
		const updatedPost = {
			...memoryPosts[index],
			...postData,
			updatedAt: new Date().toISOString()
		};
		memoryPosts[index] = updatedPost;
		return updatedPost;
	}

	try {
		const existingPost = await kv.get(`${POSTS_KEY}:${id}`);
		if (!existingPost) {
			throw new Error('Post not found');
		}

		const updatedPost = {
			...existingPost,
			...postData,
			updatedAt: new Date().toISOString()
		};

		await kv.set(`${POSTS_KEY}:${id}`, updatedPost);
		return updatedPost;
	} catch (error) {
		console.error('Error updating post in KV:', error);
		throw new Error('Failed to update post');
	}
}

// Delete a post
export async function deletePost(id) {
	if (!isKVAvailable()) {
		// Use in-memory storage when KV is not available
		if (!memoryPosts) {
			memoryPosts = [...DEFAULT_POSTS];
		}
		memoryPosts = memoryPosts.filter((p) => p.id !== Number(id));
		return;
	}

	try {
		// Remove the post
		await kv.del(`${POSTS_KEY}:${id}`);

		// Update the index
		const postIds = (await kv.get(POSTS_INDEX_KEY)) || [];
		const updatedIds = postIds.filter((postId) => postId !== Number(id));
		await kv.set(POSTS_INDEX_KEY, updatedIds);
	} catch (error) {
		console.error('Error deleting post from KV:', error);
		throw new Error('Failed to delete post');
	}
}

// Initialize default posts (helper function)
async function initializeDefaultPosts() {
	try {
		const postIds = [];
		for (const post of DEFAULT_POSTS) {
			await kv.set(`${POSTS_KEY}:${post.id}`, post);
			postIds.push(post.id);
		}
		await kv.set(POSTS_INDEX_KEY, postIds);
	} catch (error) {
		console.error('Error initializing default posts:', error);
	}
}
