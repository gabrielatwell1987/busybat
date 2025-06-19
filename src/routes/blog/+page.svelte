<script>
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';

	let { data } = $props();
	let posts = $state([]);
	let loading = $state(true);
	let error = $state(null);
	let expandedPosts = $state(new Set());

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

	function togglePostExpansion(postId) {
		if (expandedPosts.has(postId)) {
			expandedPosts.delete(postId);
		} else {
			expandedPosts.add(postId);
		}
		expandedPosts = new Set(expandedPosts);
	}
</script>

<svelte:head>
	<title>Blog - Latest Posts</title>
	<meta name="description" content="Read our latest blog posts and updates" />
</svelte:head>

<VerticalTitle title="Blog" />

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
						<div class="post-title-section">
							<h2>{post.title}</h2>
							<button
								class="expand-button"
								onclick={() => togglePostExpansion(post.id)}
								aria-label={expandedPosts.has(post.id) ? 'Collapse post' : 'Expand post'}
							>
								<span class="expand-icon" class:expanded={expandedPosts.has(post.id)}>
									{expandedPosts.has(post.id) ? '▼' : '▶'}
								</span>
							</button>
						</div>
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

					{#if expandedPosts.has(post.id)}
						<div class="post-content">
							<p>{post.content}</p>
						</div>
					{/if}
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

		@media (width <= 768px) {
			padding: 1rem;
		}

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

			@media (width <= 768px) {
				& h1 {
					font-size: 2rem;
				}

				& p {
					font-size: 1rem;
				}
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
			align-items: start;

			@media (width <= 768px) {
				grid-template-columns: 1fr;
				gap: 1.5rem;
			}
		}
		& .post-card {
			background: white;
			border-radius: 12px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			overflow: hidden;
			height: fit-content;
			transition:
				transform 0.2s ease,
				box-shadow 0.2s ease;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
			}

			& .post-header {
				padding: 1.5rem 1.5rem 1rem;

				& h2 {
					margin: 0 0 0.75rem 0;
					font-size: 1.5rem;
					color: #333;
					line-height: 1.3;
				}

				& .post-title-section {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 0.75rem;

					& .expand-button {
						background: none;
						border: none;
						cursor: pointer;
						padding: 0.5rem;
						border-radius: 6px;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: background-color 0.2s ease;

						&:hover {
							background-color: #f0f0f0;
						}

						& .expand-icon {
							font-size: clamp(var(--sm), 1vw, var(--h5));
							color: var(--color-secondary);
							transition: transform 0.2s ease;

							&.expanded {
								transform: rotate(0deg);
							}
						}
					}
				}
				& .post-meta {
					color: #666;
					font-size: 0.9rem;
				}

				@media (width <= 768px) {
					padding: 1rem 1rem 0.75rem;

					& h2 {
						font-size: 1.25rem;
					}

					& .post-title-section {
						& .expand-button {
							padding: 0.25rem;

							& .expand-icon {
								font-size: 0.9em;
							}
						}
					}
				}
			}
			& .post-content {
				padding: 1.5rem;
				border-top: 1px solid #eee;
				animation: slideDown 0.3s ease-out;
				max-height: 200px;
				overflow-y: auto;
				background-color: #fafafa;
				border-radius: 0 0 12px 12px;
				position: relative;

				/* Custom scrollbar styling */
				&::-webkit-scrollbar {
					width: 8px;
				}

				&::-webkit-scrollbar-track {
					background: #f1f1f1;
					border-radius: 4px;
				}

				&::-webkit-scrollbar-thumb {
					background: #c1c1c1;
					border-radius: 4px;

					&:hover {
						background: #a8a8a8;
					}
				}
				& p {
					margin: 0;
					line-height: 1.7;
					color: #555;
					font-size: 1rem;
					white-space: pre-wrap;
					word-wrap: break-word;
				}

				@media (width <= 768px) {
					padding: 1rem;
					max-height: 250px;
				}
			}
		}
		@keyframes slideDown {
			from {
				opacity: 0;
				transform: translateY(-10px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}
</style>
