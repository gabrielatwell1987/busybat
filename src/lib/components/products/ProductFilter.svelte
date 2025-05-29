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

	// View transition function for smooth category changes
	function triggerViewTransition(callback) {
		if (!browser || !document.startViewTransition) {
			// Fallback for browsers that don't support view transitions
			callback();
			return;
		}

		document.startViewTransition(() => {
			callback();
		});
	}

	// Handle category change with view transition
	function handleCategoryChange(event) {
		const newCategory = event.target.value;

		triggerViewTransition(() => {
			selectedCategory = newCategory;
		});
	}

	// Notify parent when category changes
	$effect(() => {
		onCategoryChange(selectedCategory);
	});
</script>

<section class="filter-container">
	<label for="category-filter">Filter by category:</label>
	<select id="category-filter" value={selectedCategory} onchange={handleCategoryChange}>
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
			transition: all 0.2s ease;

			&:hover {
				border-color: var(--color-primary);
			}

			&:focus {
				outline: 2px solid var(--color-primary);
				outline-offset: 2px;
			}
		}

		& label {
			font-family: var(--font-regular);
			font-size: var(--h6);
			color: var(--color-dark);
		}
	}

	/* View transition styles for category filtering */
	:global(::view-transition-group(category-filter)) {
		animation-duration: 1ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(::view-transition-old(category-filter)) {
		animation-name: filter-fade-out;
	}

	:global(::view-transition-new(category-filter)) {
		animation-name: filter-fade-in;
	}

	@keyframes filter-fade-out {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-10px);
		}
	}

	@keyframes filter-fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
