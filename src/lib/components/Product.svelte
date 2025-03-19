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

						// Hide footer when product is enlarged - more aggressive approach
						const footer = document.querySelector('footer');
						if (footer) {
							footer.style.zIndex = '1';
							footer.style.opacity = '0';
							footer.style.visibility = 'hidden';
						}
					} else {
						setTimeout(() => {
							document.querySelectorAll('.product-card').forEach((product) => {
								product.style.visibility = 'visible';
							});

							// Restore footer z-index
							const footer = document.querySelector('footer');
							if (footer) {
								footer.style.zIndex = '20';
								footer.style.opacity = '1';
								footer.style.visibility = 'visible';
							}
						}, 500);
					}
				});

				// Optional: You can also set a custom duration for view transitions
				document.documentElement.style.setProperty('--view-transition-duration', '1s');

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

				// Add more aggressive footer handling here too
				const footer = document.querySelector('footer');
				if (footer) {
					footer.style.zIndex = '1';
					footer.style.opacity = '0';
					footer.style.visibility = 'hidden';
				}
			} else {
				setTimeout(() => {
					document.querySelectorAll('.product-card').forEach((product) => {
						product.style.visibility = 'visible';
					});

					// Add footer visibility restoration
					const footer = document.querySelector('footer');
					if (footer) {
						footer.style.zIndex = '20';
						footer.style.opacity = '1';
						footer.style.visibility = 'visible';
					}
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
		transform: translateZ(0);

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		&.enlarged {
			position: fixed;
			top: 57%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 50%;
			max-width: 800px;
			max-height: 90vh;
			overflow-y: auto;
			z-index: 999999;
			cursor: default;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
			margin-bottom: 2rem;
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
				/* height: 275px; */
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
			gap: 0.05rem;
			padding: 1rem;

			& .product-name {
				margin: 0;
				font-family: var(--font-bold);
				font-size: clamp(var(--h5), 2vw, var(--h4));
				font-weight: 600;
				letter-spacing: 2px;
				text-align: center;
				grid-row: 1;
			}

			& .product-price {
				font-size: 1.4rem;
				font-weight: bold;
				color: var(--color-success);
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
				background-color: var(--color-info);
				color: var(--color-white);
				border: none;
				border-radius: var(--radius);
				cursor: pointer;
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				font-weight: bold;
				transition: background-color 0.3s;
				grid-row: 5;

				&:hover:not([disabled]) {
					background-color: hsl(188, 78%, 31%);
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
		z-index: 999998;
	}

	@media (max-width: 768px) {
		.product-card.enlarged {
			width: 90%;
			top: 57%;
		}
	}
</style>
