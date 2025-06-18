<script>
	import { goto } from '$app/navigation';

	let { data } = $props();

	let title = $state('');
	let content = $state('');
	let editingPost = $state(null);
	let posts = $state([]);
	let loading = $state(false);
	let storageStatus = $state(null);

	// Load posts and storage status on component mount
	$effect(() => {
		loadPosts();
		checkStorageStatus();
	});

	async function checkStorageStatus() {
		try {
			const res = await fetch('/api/storage-status');
			storageStatus = await res.json();
		} catch (error) {
			console.error('Failed to check storage status:', error);
		}
	}

	async function loadPosts() {
		loading = true;
		try {
			const res = await fetch('/api/posts');
			posts = await res.json();
		} catch (error) {
			console.error('Failed to load posts:', error);
		} finally {
			loading = false;
		}
	}

	async function logout() {
		try {
			await fetch('/api/logout', { method: 'POST' });
			goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			// Force logout anyway
			document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			goto('/login');
		}
	}

	async function createOrUpdatePost() {
		if (!title.trim() || !content.trim()) {
			alert('Please fill in both title and content');
			return;
		}

		loading = true;
		try {
			const endpoint = editingPost ? `/api/posts/edit/${editingPost.id}` : '/api/posts/create';
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: title.trim(), content: content.trim() })
			});

			if (response.ok) {
				title = '';
				content = '';
				editingPost = null;
				await loadPosts();
			} else {
				alert('Failed to save post');
			}
		} catch (error) {
			console.error('Failed to save post:', error);
			alert('Failed to save post');
		} finally {
			loading = false;
		}
	}

	function editPost(post) {
		editingPost = post;
		title = post.title;
		content = post.content;
	}

	function cancelEdit() {
		editingPost = null;
		title = '';
		content = '';
	}

	async function deletePost(id) {
		if (!confirm('Are you sure you want to delete this post?')) {
			return;
		}

		loading = true;
		try {
			const response = await fetch(`/api/posts/delete/${id}`, { method: 'POST' });
			if (response.ok) {
				await loadPosts();
			} else {
				alert('Failed to delete post');
			}
		} catch (error) {
			console.error('Failed to delete post:', error);
			alert('Failed to delete post');
		} finally {
			loading = false;
		}
	}
</script>

<div class="admin-container">
	<header class="admin-header">
		<div class="header-content">
			<h1>Admin Dashboard</h1>

			<div class="header-actions">
				<span class="welcome">Welcome, {data.user.username}!</span>
				<button onclick={logout} class="logout-btn">Logout</button>
			</div>
		</div>
	</header>

	<div class="post-form">
		<h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				createOrUpdatePost();
			}}
		>
			<div class="form-group">
				<label for="title">Title:</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					placeholder="Enter post title..."
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="content">Content:</label>
				<textarea
					id="content"
					bind:value={content}
					placeholder="Write your post content here..."
					rows="10"
					disabled={loading}
				></textarea>
			</div>

			<div class="form-actions">
				<button type="submit" disabled={loading || !title.trim() || !content.trim()}>
					{loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
				</button>
				{#if editingPost}
					<button type="button" onclick={cancelEdit} disabled={loading}> Cancel </button>
				{/if}
			</div>
		</form>
	</div>

	<div class="posts-section">
		<h2>Manage Posts ({posts.length})</h2>

		{#if loading && posts.length === 0}
			<p class="loading">Loading posts...</p>
		{:else if posts.length === 0}
			<p class="no-posts">No posts yet. Create your first post above!</p>
		{:else}
			<div class="posts-grid">
				{#each posts as post (post.id)}
					<div class="post-card">
						<div class="post-header">
							<h3>{post.title}</h3>
							<div class="post-meta">
								<small>Created: {new Date(post.createdAt).toLocaleDateString()}</small>
							</div>
						</div>

						<div class="post-content">
							<p>{post.content}</p>
						</div>

						<div class="post-actions">
							<button onclick={() => editPost(post)} disabled={loading} class="edit-btn">
								Edit
							</button>
							<button onclick={() => deletePost(post.id)} disabled={loading} class="delete-btn">
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem 2rem;
		& .admin-header {
			background: var(--color-light);
			margin: 0 -2rem 2rem -2rem;
			padding: 1.5rem 2rem;
			border-bottom: 1px solid var(--color-fade-primary);

			& .header-content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				max-width: 1200px;
				margin: 0 auto;

				& h1 {
					margin: 0;
					color: var(--color-accent);
					-webkit-text-stroke: 1px var(--color-secondary);
					font-size: clamp(var(--h5), 4vw, var(--lg));
				}

				& .header-actions {
					display: flex;
					align-items: center;
					gap: 1rem;

					& .welcome {
						color: var(--color-secondary);
						font-weight: 500;
						font-size: clamp(var(--sm), 1vw, var(--h6));
					}

					& .logout-btn {
						background: var(--color-danger);
						color: var(--color-white);
						border: none;
						padding: 0.5rem 1rem;
						border-radius: var(--radius);
						cursor: pointer;
						font-size: clamp(var(--xs), 1vw, var(--sm));
						transition: background-color 0.2s;

						&:hover {
							background: var(--color-dark);
						}
					}
				}
			}
		}
		& .post-form {
			background: var(--color-light);
			padding: 2rem;
			border-radius: var(--radius);
			margin-bottom: 3rem;

			& h2 {
				color: var(--color-accent);
				font-size: clamp(var(--h6), 3vw, var(--h4));
				margin-bottom: 1.5rem;
			}

			& .form-group {
				margin-bottom: 1.5rem;

				& label {
					display: block;
					margin-bottom: 0.5rem;
					font-weight: 600;
					color: var(--color-secondary);
					font-size: clamp(var(--sm), 1vw, var(--h6));
				}

				& input[type='text'],
				& textarea {
					width: 100%;
					padding: 0.75rem;
					border: 1px solid var(--color-fade-primary);
					border-radius: var(--radius);
					font-size: clamp(var(--sm), 1vw, var(--h6));
					font-family: inherit;
					color: var(--color-secondary);

					&:focus {
						outline: none;
						border-color: var(--color-accent);
					}
				}

				& textarea {
					resize: vertical;
					min-height: 150px;
				}
			}

			& .form-actions {
				display: flex;
				gap: 1rem;

				& button {
					color: var(--color-primary);
					background-color: var(--color-accent);

					&:hover {
						background-color: var(--color-primary);
						color: var(--color-accent);
						border: 1px solid var(--color-accent);
					}
				}
			}
		}
		& button {
			padding: 0.75rem 1.5rem;
			border: none;
			border-radius: var(--radius);
			font-size: clamp(var(--xs), 1vw, var(--h6));
			cursor: pointer;
			transition: background-color 0.2s;

			&[type='submit'] {
				background: var(--color-info);
				color: var(--color-white);

				&:hover:not(:disabled) {
					background: var(--color-primary);
					color: var(--color-accent);
				}
			}

			&[type='button'] {
				background: var(--color-gray);
				color: var(--color-white);

				&:hover:not(:disabled) {
					background: var(--color-dark);
				}
			}

			&:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}
		& .posts-section {
			& h2 {
				margin-bottom: 1.5rem;
				color: var(--color-info);
				font-size: clamp(var(--h6), 3vw, var(--h4));
			}

			& .loading,
			& .no-posts {
				text-align: center;
				color: var(--color-warning);
				font-style: italic;
				padding: 2rem;
				font-size: clamp(var(--sm), 1vw, var(--h6));
			}

			& .posts-grid {
				display: grid;
				gap: 1.5rem;
				grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
			}
			& .post-card {
				background: var(--color-white);
				border: 1px solid var(--color-fade-primary);
				border-radius: var(--radius);
				padding: 1.5rem;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

				& .post-header {
					& h3 {
						margin: 0 0 0.5rem 0;
						color: var(--color-accent);
						-webkit-text-stroke: 1px var(--color-secondary);
						font-size: clamp(var(--sm), 2vw, var(--h5));
					}

					& .post-meta {
						color: var(--color-gray);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						margin-bottom: 1rem;
					}
				}

				& .post-content {
					margin-bottom: 1.5rem;

					& p {
						margin: 0;
						line-height: 1.6;
						color: var(--color-secondary);
						font-size: clamp(var(--sm), 1vw, var(--h6));
					}
				}

				& .post-actions {
					display: flex;
					gap: 0.5rem;

					& .edit-btn {
						background: var(--color-success);
						color: var(--color-white);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						padding: 0.5rem 1rem;
						border-radius: var(--radius);

						&:hover:not(:disabled) {
							background: var(--color-info);
						}
					}
					& .delete-btn {
						background: var(--color-danger);
						color: var(--color-white);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						padding: 0.5rem 1rem;
						border-radius: var(--radius);

						&:hover:not(:disabled) {
							background: var(--color-dark);
						}
					}
				}
			}
		}

		@media (max-width: 768px) {
			padding: 0 1rem 1rem;

			& .admin-header {
				margin: 0 -1rem 2rem -1rem;
				padding: 1rem;

				& .header-content {
					flex-direction: column;
					gap: 1rem;
					align-items: flex-start;

					& .header-actions {
						align-self: stretch;
						justify-content: space-between;
					}
				}
			}

			& .posts-section {
				& .posts-grid {
					grid-template-columns: 1fr;
				}
			}

			& .post-form {
				padding: 1.5rem;
			}
		}
	}
</style>
