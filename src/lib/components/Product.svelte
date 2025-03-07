<script>
	import { createEventDispatcher } from 'svelte';

	let { id, name, price, description, imageUrl, rating, inStock, context = 'default' } = $props();

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
		// Dispatch a custom event that parent components can listen to
		dispatch('addtocart', { id, name, price, imageUrl, quantity: 1 });
	}
</script>

<div class="product-card" style="view-transition-name: {context}-product-card-{id}">
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

		<p class="product-description">{description}</p>

		<button class="add-to-cart-btn" onclick={addToCart} disabled={!inStock}>
			{inStock ? 'Add to Cart' : 'Out of Stock'}
		</button>
	</div>
</div>

<style>
	.product-card {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		background-color: white;
		width: 100%;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		& .product-image {
			position: relative;
			height: 200px;
			overflow: hidden;

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
				margin-top: 0;
				font-family: var(--font-semibold);
				font-size: clamp(var(--h5), 2vw, var(--h4));
				font-weight: 600;
				text-align: center;
				grid-row: 1;
			}

			& .product-price {
				font-size: 1.4rem;
				font-weight: bold;
				color: var(--color-info);
				margin: 8px 0;
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
			}

			& .product-rating {
				margin: 0.5rem 0;
				text-align: center;
				grid-row: 2;

				& .star {
					color: #ddd;
					font-size: clamp(var(--h6), 1.5vw, var(--h4));

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
</style>
