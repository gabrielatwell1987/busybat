<script>
	import { browser } from '$app/environment';
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
	import pink from '$lib/assets/pink-leo.webp';
	import Product from '$lib/components/products/Product.svelte';
	import products from '$lib/components/products/productList.json';
	import ProductFilter from '$lib/components/products/ProductFilter.svelte';
	import { addToCart } from '$lib/components/products/CartStore.svelte';

	let selectedCategory = $state('All');
	const containFitCategories = $state(['Bags', 'Wall Art', 'Accessories']);

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
		<article
			class="product-wrapper"
			class:hidden={shouldHideProduct(product)}
			style="view-transition-name: product-{product.id};"
		>
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
				{addToCart}
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
		padding: 1rem;

		@media (width <= 500px) {
			grid-template-columns: 1fr;
			gap: 1.5em;
		}

		& .product-wrapper {
			width: 100%;
			transition: opacity 0.2s ease;
		}
	}

	/* Global view transition styles for individual products */
	:global([style*='view-transition-name: product-']::view-transition-old(*)),
	:global([style*='view-transition-name: product-']::view-transition-new(*)) {
		animation-duration: 0.4s;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	.hidden {
		display: none;
	}
</style>
