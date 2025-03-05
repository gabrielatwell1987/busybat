<script>
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
	import pink from '$lib/assets/pink-leo.webp';
	import Product from '$lib/components/Product.svelte';
	import products from '$lib/data/products.json';

	function handleAddToCart(event) {
		console.log('Added to cart:', event.detail);
		// cart logic here
	}
</script>

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
			on:addtocart={handleAddToCart}
		/>
	{/each}
</div>

<style>
	.content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1em;
		width: auto;
		height: auto;
		view-transition-name: fade;

		@media (width <= 500px) {
			grid-template-columns: 1fr;
			gap: 1.5em;
		}
	}

	::view-transition-old(fade) {
		animation: fade-in 1s linear forwards;
	}

	::view-transition-new(fade) {
		animation: fade-out 1s linear forwards;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
