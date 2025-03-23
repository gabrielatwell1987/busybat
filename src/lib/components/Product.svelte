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
			// Prepare elements before transition
			const otherProducts = document.querySelectorAll(
				`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
			);
			const footer = document.querySelector('footer');
			const isCurrentlyEnlarged = isEnlarged;

			// Set custom duration for the transition
			document.documentElement.style.setProperty('--view-transition-duration', '1.25s');
			document.documentElement.style.setProperty('--view-transition-delay', '0.2s');

			// Create a specific style for transition timing
			const styleEl = document.createElement('style');
			styleEl.textContent = `
				::view-transition-old(${context}-product-card-${id}),
				::view-transition-new(${context}-product-card-${id}) {
				animation-delay: 0.2s;
				animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
				animation-duration: 1.2s;
				}
			`;
			document.head.appendChild(styleEl);

			const transition = document.startViewTransition(() => {
				isEnlarged = !isEnlarged;

				// Force layout recalculation
				document.body.offsetHeight;

				if (isEnlarged) {
					// Hide other elements when enlarging
					setTimeout(() => {
						otherProducts.forEach((product) => {
							product.style.opacity = '0';
							product.style.visibility = 'hidden';
						});

						if (footer) {
							footer.style.zIndex = '1';
							footer.style.opacity = '0';
							footer.style.visibility = 'hidden';
						}
					}, 100);
				} else {
					// When closing, start making elements visible DURING the transition
					otherProducts.forEach((product) => {
						product.style.visibility = 'visible';
						product.style.opacity = '0.3'; // Start with low opacity
					});

					if (footer) {
						footer.style.visibility = 'visible';
						footer.style.opacity = '0.3';
						footer.style.zIndex = '20';
					}
				}
			});

			// For the end of transition
			transition.finished.then(() => {
				// Clean up the added style
				document.head.removeChild(styleEl);

				if (!isEnlarged) {
					// When transition is done, make everything fully visible
					otherProducts.forEach((product) => {
						product.style.opacity = '1';
						product.style.transition = 'opacity 0.3s ease';
					});

					if (footer) {
						footer.style.opacity = '1';
					}
				}
			});
		} else {
			// Update fallback version with the same pattern
			isEnlarged = !isEnlarged;

			if (isEnlarged) {
				setTimeout(() => {
					document
						.querySelectorAll(
							`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
						)
						.forEach((product) => {
							product.style.opacity = '0';
							product.style.visibility = 'hidden';
						});

					const footer = document.querySelector('footer');
					if (footer) {
						footer.style.zIndex = '1';
						footer.style.opacity = '0';
						footer.style.visibility = 'hidden';
					}
				}, 200);
			} else {
				// Make elements visible immediately but with fading in
				const products = document.querySelectorAll('.product-card');
				const footer = document.querySelector('footer');

				products.forEach((product) => {
					product.style.visibility = 'visible';
					product.style.opacity = '0.3';
					product.style.transition = 'opacity 0.4s ease';
				});

				if (footer) {
					footer.style.visibility = 'visible';
					footer.style.opacity = '0.3';
					footer.style.zIndex = '20';
					footer.style.transition = 'opacity 0.4s ease';
				}

				// Then fade to full opacity
				setTimeout(() => {
					products.forEach((product) => {
						product.style.opacity = '1';
					});

					if (footer) {
						footer.style.opacity = '1';
					}
				}, 100);
			}
		}
	}
</script>

<div
	class="product-card {isEnlarged ? 'enlarged' : ''}"
	style="view-transition-name: {context}-product-card-{id}"
	onclick={toggleEnlargement}
	onkeydown={(e) => e.key === 'Enter' && toggleEnlargement()}
	aria-label="View product details"
	role="button"
	tabindex="0"
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
	<button
		class="overlay"
		onclick={toggleEnlargement}
		onkeydown={(e) => e.key === 'Enter' && toggleEnlargement()}
		aria-label="Close enlarged view"
	></button>
{/if}

<style>
	.product-card {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			box-shadow 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1);
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
			max-height: 98vh;
			overflow: hidden;
			z-index: 999999;
			cursor: default;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
			animation: enlarge 1s cubic-bezier(0.25, 1, 0.5, 1) 0.1s forwards;
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
				height: min(40vh, 400px);
				transition: height 0.8s cubic-bezier(0.25, 1, 0.5, 1);
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

			@media (max-width: 768px) {
				.enlarged & {
					height: 350px;
				}
			}

			@media (max-width: 480px) {
				.enlarged & {
					height: 200px;
				}
			}
		}

		& .product-info {
			display: grid;
			grid-template-rows: auto auto auto 1fr auto;
			gap: 0.05rem;
			padding: 1rem;

			.enlarged & {
				flex: 1;
				min-height: 0;
			}

			& .product-name {
				margin: 0;
				color: var(--color-dark);
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
				text-align: right;
			}

			& .product-description {
				font-size: clamp(var(--xs), 1.5vw, var(--h6));
				font-weight: 500;
				letter-spacing: 0;
				line-height: 1.25;
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
					max-height: 40vh;
					overflow-y: auto;
					padding-inline: 0.5rem;
					font-size: clamp(var(--sm), 1.5vw, var(--h5));
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
			top: 50%;
			max-height: 95vh;
		}
	}

	@keyframes enlarge {
		0% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}

	@keyframes shrink {
		0% {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		::view-transition-old(root),
		::view-transition-new(root) {
			animation-delay: 0.2s;
			animation-duration: 1.2s;
		}

		/* Target all view transitions for product cards */
		::view-transition-group(*) {
			animation-delay: 0.2s;
			animation-duration: 1.2s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Animation for overlay */
		.overlay {
			animation: fadeIn 0.5s ease 0.15s both; /* 0.15s delay */
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
</style>
