<script>
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
	import pink from '$lib/assets/pink-leo.webp';
	import Product from '$lib/components/Product.svelte';
	import products from '$lib/data/products.json';

	function handleAddToCart(event) {
		console.log('Added to cart:', event.detail);
		// cart logic here
	}
</script>

<SEO
	title="Busy Little Bat Sewing &middot; Our Products"
	description="Busy Bat products"
	keywords="busy bat products, busy bat sewing co products"
/>

<div class="content">
	{#each products as product}
		<Product
			id={product.id}
			name={product.name}
			price={product.price}
			imageUrl={product.imageUrl}
			description={product.description}
			rating={product.rating}
			inStock={product.inStock}
			context="products-page"
			on:addtocart={handleAddToCart}
		/>
	{/each}
</div>

<VerticalTitle title="Products" />

<style>
	.content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1em;
		align-items: stretch;
		max-width: 1200px;
		margin-inline: auto;
		margin-bottom: 2rem;
		width: auto;
		height: auto;
		view-transition-name: products-content;
		padding: 1rem;

		@media (width <= 500px) {
			grid-template-columns: 1fr;
			gap: 1.5em;
		}
	}

	::view-transition-old(\*-product-card-\*) {
		animation: product-fade-out var(--timing) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
	}

	::view-transition-new(\*-product-card-\*) {
		animation: product-fade-in var(--timing) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
	}

	::view-transition-old(products-content) {
		animation: product-fade-out var(--timing) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
	}

	::view-transition-new(products-content) {
		animation: product-fade-in var(--timing) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
	}

	@keyframes product-fade-in {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes product-fade-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(1.02);
		}
	}
</style>
