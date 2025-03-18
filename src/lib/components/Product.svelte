<script>
	import { createEventDispatcher } from 'svelte';

	let { id, name, price, description, imageUrl, rating, inStock, context = 'default' } = $props();
	let isEnlarged = $state(false);

	const dispatch = createEventDispatcher();

	// For formatting price with currency
	const formatPrice = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	// Function to handle adding to cart
	function addToCart() {
		// Prevent the click from triggering the product enlargement
		event.stopPropagation();

		// Dispatch a custom event that parent components can listen to
		dispatch('addtocart', { id, name, price, imageUrl, quantity: 1 });
	}

	function toggleEnlargement() {
		if (document.startViewTransition) {
			// Add a small delay before starting the transition
			setTimeout(() => {
				const transition = document.startViewTransition(() => {
					isEnlarged = !isEnlarged;

					// Force layout recalculation
					document.documentElement.scrollTop;

					if (isEnlarged) {
						document
							.querySelectorAll(
								`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
							)
							.forEach((product) => {
								product.style.visibility = 'hidden';
							});
					} else {
						setTimeout(() => {
							document.querySelectorAll('.product-card').forEach((product) => {
								product.style.visibility = 'visible';
							});
						}, 300);
					}
				});

				// Handle ready and finished states
				transition.ready.then(() => {
					// Ready to animate
				});
			}, 10);
		} else {
			// Fallback for browsers without view transitions
			isEnlarged = !isEnlarged;

			// Same visibility logic as before
			if (isEnlarged) {
				document
					.querySelectorAll(
						`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
					)
					.forEach((product) => {
						product.style.visibility = 'hidden';
					});
			} else {
				setTimeout(() => {
					document.querySelectorAll('.product-card').forEach((product) => {
						product.style.visibility = 'visible';
					});
				}, 300);
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="product-card {isEnlarged ? 'enlarged' : ''}"
	style="view-transition-name: {context}-product-card-{id}"
	onclick={toggleEnlargement}
	onkeydown={(e) => e.key === 'Enter' && toggleEnlargement()}
	aria-label="View product details"
>
	<div class="product-image">
		<img src={imageUrl} alt={name} />

		{#if !inStock}
			<div class="out-of-stock">Out of Stock</div>
		{/if}
	</div>

	<div class="product-info">
		<h3 class="product-name">{name}</h3>

		<div class="product-rating">
			{#each Array(5) as _, i}
				<span class="star {i < rating ? 'filled' : ''}">★</span>
			{/each}
		</div>

		<p class="product-price">{formatPrice(price)}</p>

		<p class="product-description" class:expanded={isEnlarged}>{description}</p>

		<button class="add-to-cart-btn" onclick={addToCart} disabled={!inStock}>
			{inStock ? 'Add to Cart' : 'Out of Stock'}
		</button>
	</div>
</div>

{#if isEnlarged}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="overlay" onclick={toggleEnlargement}></div>
{/if}

<style>
	.product-card {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s cubic-bezier(0.25, 1, 0.5, 1),
			box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
		background-color: hsl(0, 0%, 89%);
		width: 100%;
		position: relative;
		cursor: pointer;
		z-index: 1;
		will-change: transform, opacity;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		&.enlarged {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 50%;
			max-width: 800px;
			max-height: 90vh;
			overflow-y: auto;
			z-index: 10000;
			cursor: default;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		}

		&:not(.enlarged):hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		& .product-image {
			position: relative;
			height: 200px;
			overflow: hidden;

			.enlarged & {
				height: 300px;
			}

			& img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			& .out-of-stock {
				position: absolute;
				inset: 0;
				background-color: rgba(0, 0, 0, 0.6);
				backdrop-filter: blur(2px);
				color: var(--color-white);
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;
			}
		}

		& .product-info {
			display: grid;
			grid-template-rows: auto auto auto 1fr auto;
			gap: 0.5rem;
			padding: 1rem;

			& .product-name {
				margin: 0;
				font-family: var(--font-semibold);
				font-size: clamp(var(--h5), 2vw, var(--h4));
				font-weight: 600;
				letter-spacing: 2px;
				text-align: center;
				grid-row: 1;
			}

			& .product-price {
				font-size: 1.4rem;
				font-weight: bold;
				color: var(--color-info);
				margin: 0.5rem 0;
				grid-row: 3;
			}

			& .product-description {
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				color: var(--color-gray);
				margin-bottom: 16px;
				display: -webkit-box;
				line-clamp: 3;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				grid-row: 4;
				transition: all 0.3s ease;

				&.expanded {
					line-clamp: initial;
					-webkit-line-clamp: initial;
				}
			}

			& .product-rating {
				margin: 0.5rem 0;
				text-align: center;
				grid-row: 2;

				& .star {
					color: #ddd;
					font-size: clamp(var(--h6), 1.5vw, var(--h4));
					-webkit-text-stroke: 1px var(--color-secondary);

					&.filled {
						color: #ffc107;
					}
				}
			}

			& .add-to-cart-btn {
				width: 100%;
				padding: 0.7rem;
				background-color: var(--color-success);
				color: var(--color-white);
				border: none;
				border-radius: var(--radius);
				cursor: pointer;
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				font-weight: bold;
				transition: background-color 0.3s;
				grid-row: 5;

				&:hover:not([disabled]) {
					background-color: hsl(134, 61%, 31%);
				}

				&:disabled {
					background-color: var(--color-gray);
					cursor: not-allowed;
				}
			}
		}
	}

	.overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}

	@media (max-width: 768px) {
		.product-card.enlarged {
			width: 90%;
		}
	}
</style>
