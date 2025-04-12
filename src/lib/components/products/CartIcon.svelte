<script>
	import { getCartData } from './CartStore.svelte';

	// Accept class and onclick props
	let { class: className = '', onclick = undefined } = $props();

	// Get cart data from the store
	let cart = $state([]);
	$effect(() => {
		const data = getCartData();
		cart = data.cart;
	});

	// Calculate total items in cart
	let itemCount = $derived(cart.reduce((total, item) => total + (item.quantity || 0), 0));
</script>

<a href="/cart" class="cart-icon-wrapper {className}" {onclick}>
	<div class="cart-icon">
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

		{#if itemCount > 0}
			<span class="cart-count" role="status" aria-label="Cart items: {itemCount}">
				{itemCount}
			</span>
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
			scale: 1.5;

			& .cart-count {
				position: absolute;
				top: -8px;
				right: -8px;
				background: var(--color-danger);
				color: white;
				border-radius: 50%;
				min-width: 1rem;
				height: 1rem;
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				animation: pop 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			}
		}
	}

	@keyframes pop {
		0% {
			transform: scale(0);
		}
		70% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
