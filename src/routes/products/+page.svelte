<script>
	import { browser } from '$app/environment';
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
	import pink from '$lib/assets/pink-leo.webp';
	import Product from '$lib/components/products/Product.svelte';
	import products from '$lib/components/products/products.json';
	import ProductFilter from '$lib/components/products/ProductFilter.svelte';

	let selectedCategory = $state('All');
	const containFitCategories = $state(['Bags', 'Wall Art', 'Accessories']);

	function handleAddToCart(event) {
		console.log('Added to cart:', event.detail);
		// cart logic here
	}

	function onCategoryChange(category) {
		selectedCategory = category;
	}

	function shouldHideProduct(product) {
		// If no category is set on the product, consider it uncategorized
		if (!product.category) return selectedCategory !== 'All';

		return selectedCategory !== 'All' && product.category !== selectedCategory;
	}

	function getImageFit(category) {
		return containFitCategories.includes(category) ? 'contain' : 'cover';
	}
</script>

<SEO
	title="Busy Little Bat Sewing &middot; Our Products"
	description="Busy Little Bat Sewing products"
	keywords="busy little bat products, busy little bat sewing creations"
/>

<ProductFilter {products} {onCategoryChange} />

<section class="products">
	{#each products as product}
		<article class="product-wrapper" class:hidden={shouldHideProduct(product)}>
			<Product
				id={product.id}
				name={product.name}
				price={product.price}
				imageUrl={product.imageUrl}
				description={product.description}
				inStock={product.inStock}
				context="products-page"
				productUrl={product.productUrl}
				category={product.category}
				imageFit={getImageFit(product.category)}
				on:addtocart={handleAddToCart}
			/>
		</article>
	{/each}
</section>

<VerticalTitle title="Products" />

<style>
	.products {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1em;
		align-items: stretch;
		max-width: 1200px;
		width: 100%;
		box-sizing: border-box;
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

		& .product-wrapper {
			width: 100%;
		}
	}

	::view-transition-old(products-content) {
		animation: product-fade-out var(--timing) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
	}

	::view-transition-new(products-content) {
		animation: product-fade-in var(--timing) cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
	}

	.hidden {
		display: none;
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
