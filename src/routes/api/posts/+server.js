import { json } from '@sveltejs/kit';
import { getPosts, createPost, updatePost, deletePost } from '$lib/data/kv-storage.js';

export async function GET() {
	try {
		const posts = await getPosts();
		return json(posts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const postData = await request.json();
		const newPost = await createPost(postData);
		return json(newPost, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return json({ error: 'Failed to create post' }, { status: 500 });
	}
}

export async function PUT({ request }) {
	try {
		const { id, ...postData } = await request.json();
		const updatedPost = await updatePost(id, postData);
		return json(updatedPost);
	} catch (error) {
		console.error('Error updating post:', error);
		return json({ error: 'Failed to update post' }, { status: 500 });
	}
}

export async function DELETE({ request }) {
	try {
		const { id } = await request.json();
		await deletePost(id);
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting post:', error);
		return json({ error: 'Failed to delete post' }, { status: 500 });
	}
}
