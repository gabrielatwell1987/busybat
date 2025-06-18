<script>
	let { data } = $props();

	let posts = $state([]);
	let loading = $state(true);
	let error = $state(null);

	$effect(() => {
		loadPosts();
	});

	async function loadPosts() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/posts');
			if (!res.ok) {
				throw new Error('Failed to load posts');
			}
			posts = await res.json();
		} catch (err) {
			error = err.message;
			console.error('Failed to load posts:', err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Blog - Latest Posts</title>
	<meta name="description" content="Read our latest blog posts and updates" />
</svelte:head>

<div class="blog-container">
	<section class="admin">
		{#if data.user}
			<a href="/admin">Admin Dashboard</a>
		{:else}
			<a href="/login">Admin Login</a>
		{/if}
	</section>

	<header class="blog-header">
		<h1>Our Blog</h1>

		<p>Stay up to date with our latest news and insights</p>
	</header>

	{#if loading}
		<div class="loading">
			<p>Loading posts...</p>
		</div>
	{:else if error}
		<div class="error">
			<p>Failed to load posts: {error}</p>
			<button onclick={loadPosts}>Try Again</button>
		</div>
	{:else if posts.length === 0}
		<div class="no-posts">
			<p>No blog posts available yet. Check back soon!</p>
		</div>
	{:else}
		<div class="posts-grid">
			{#each posts as post (post.id)}
				<article class="post-card">
					<header class="post-header">
						<h2>{post.title}</h2>
						<div class="post-meta">
							<time datetime={post.createdAt}>
								{new Date(post.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</time>
						</div>
					</header>

					<div class="post-content">
						<p>{post.content}</p>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.blog-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;

		& .admin {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			a {
				font-size: clamp(--h6, 2vw, --h5);
				font-weight: 600;
			}
		}

		& .blog-header {
			text-align: center;
			margin-bottom: 3rem;

			& h1 {
				font-size: clamp(var(--h6), 5vw, var(--xl));
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-secondary);
				margin-bottom: 1rem;
			}

			& p {
				font-size: clamp(var(--sm), 1vw, var(--h5));
				color: var(--color-secondary);
				max-width: 600px;
				margin: 0 auto;
				line-height: 1.6;
			}
		}

		& .loading,
		& .error,
		& .no-posts {
			text-align: center;
			padding: 3rem;
			color: var(--color-warning);
		}

		& .error {
			color: var(--color-danger);

			& button {
				margin-top: 1rem;
				padding: 0.5rem 1rem;
				background: var(--color-info);
				color: var(--color-secondary);
				border: none;
				border-radius: 4px;
				cursor: pointer;

				&:hover {
					background: var(--color-primary);
				}
			}
		}

		& .posts-grid {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		}

		& .post-card {
			background: white;
			border-radius: 12px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			overflow: hidden;
			transition:
				transform 0.2s ease,
				box-shadow 0.2s ease;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
			}

			& .post-header {
				padding: 1.5rem 1.5rem 1rem;
				border-bottom: 1px solid #eee;

				& h2 {
					margin: 0 0 0.75rem 0;
					font-size: 1.5rem;
					color: #333;
					line-height: 1.3;
				}

				& .post-meta {
					color: #666;
					font-size: 0.9rem;
				}
			}

			& .post-content {
				padding: 1rem 1.5rem 1.5rem;

				& p {
					margin: 0;
					line-height: 1.7;
					color: #555;
					font-size: 1rem;
				}
			}
		}

		@media (max-width: 768px) {
			padding: 1rem;

			& .blog-header {
				& h1 {
					font-size: 2rem;
				}

				& p {
					font-size: 1rem;
				}
			}

			& .posts-grid {
				grid-template-columns: 1fr;
				gap: 1.5rem;
			}

			& .post-card {
				& .post-header {
					padding: 1rem 1rem 0.75rem;

					& h2 {
						font-size: 1.25rem;
					}
				}

				& .post-content {
					padding: 0.75rem 1rem 1rem;
				}
			}
		}
	}
</style>
