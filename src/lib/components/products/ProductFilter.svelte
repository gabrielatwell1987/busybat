<script>
	import { browser } from '$app/environment';

	// Props from parent
	let { products, onCategoryChange } = $props();

	// States for filter
	let allCategories = $state(['All', 'Bags', 'Clothing']);
	let selectedCategory = $state('All');

	// Initialize categories from products
	$effect(() => {
		if (browser) {
			products.forEach((product) => {
				if (product.category && !allCategories.includes(product.category)) {
					allCategories.push(product.category);
				}
			});
		}
	});

	// Notify parent when category changes
	$effect(() => {
		onCategoryChange(selectedCategory);
	});
</script>

<section class="filter-container">
	<label for="category-filter">Filter by category:</label>
	<select id="category-filter" bind:value={selectedCategory}>
		{#each allCategories as category}
			<option value={category}>{category}</option>
		{/each}
	</select>
</section>

<style>
	.filter-container {
		max-width: 1200px;
		width: 100%;
		margin: 0 auto 1rem;
		padding: 0 1rem;
		display: flex;
		gap: 0.5rem;
		align-items: center;

		& select {
			padding: 0.5rem;
			border-radius: var(--radius);
			border: 1px solid var(--color-secondary);
			background-color: var(--color-white);
			font-family: var(--font-regular);
			font-size: clamp(var(--sm), 1.5vw, var(--h5));
			cursor: pointer;
		}

		& label {
			font-family: var(--font-regular);
			font-size: var(--h6);
			color: var(--color-dark);
		}
	}
</style>
