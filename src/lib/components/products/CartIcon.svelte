<script>
	import { getCartData } from './CartStore.svelte';

	// Get cart data from the store with Svelte 5 reactivity
	const { cart } = getCartData();

	// Use $derived to calculate total quantity across all items
	let itemCount = $derived(
		Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 0), 0) : 0
	);

	// Debug to check reactivity - will re-run when cart changes
	$effect(() => {
		console.log('Cart updated:', cart);
		console.log('Current item count:', itemCount);
	});
</script>

<a href="/cart" class="cart-icon-wrapper">
	<div class="cart-icon">
		<!-- SVG Cart Icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="9" cy="21" r="1"></circle>
			<circle cx="20" cy="21" r="1"></circle>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
		</svg>

		<!-- Badge with count - only show when items exist -->
		{#if itemCount > 0}
			<span class="cart-count">{itemCount}</span>
		{/if}
	</div>
</a>

<style>
	.cart-icon-wrapper {
		display: inline-flex;
		position: relative;
		color: inherit;
		text-decoration: none;

		& .cart-icon {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
		}

		& .cart-count {
			position: absolute;
			top: -8px;
			right: -8px;
			background: var(--color-accent, #ff3e00);
			color: white;
			border-radius: 50%;
			min-width: 18px;
			height: 18px;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			padding: 0 4px;
		}
	}
</style>
