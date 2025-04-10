<script>
	import {
		getCartData,
		removeFromCart,
		updateQuantity,
		handleCheckout
	} from '$lib/components/products/CartStore.svelte';

	// Get reactive cart data from the store
	const { cart, customerEmail, isProcessingPayment, setEmail } = getCartData();

	// Fix cartTotal calculation to ensure it always returns a valid number
	let cartTotal = $state(
		cart.reduce((sum, item) => {
			const price = parseFloat(item.price) || 0; // Ensure price is a valid number
			const quantity = parseInt(item.quantity, 10) || 0; // Ensure quantity is a valid number
			return sum + price * quantity;
		}, 0)
	);

	$effect(() => {
		console.log('Cart in page component:', cart);
	});

	// Fix cartTotal calculation to ensure it updates reactively
	$effect(() => {
		cartTotal = cart.reduce((sum, item) => {
			const price = parseFloat(item.price) || 0; // Ensure price is a valid number
			const quantity = parseInt(item.quantity, 10) || 0; // Ensure quantity is a valid number
			return sum + price * quantity;
		}, 0);
	});

	// Handler to ensure item removal with proper ID
	function handleRemoveItem(id) {
		console.log('Remove button clicked for item:', id);
		removeFromCart(id);
	}
</script>

<div class="cart-page">
	<h1>Your Cart</h1>

	{#if cart.length === 0}
		<div class="empty-cart">
			<p>Your cart is empty</p>
			<a href="/products" class="continue-shopping">Continue Shopping</a>
		</div>
	{:else}
		<div class="cart-items">
			{#each cart as item (item.id)}
				<div class="cart-item">
					<div class="item-image">
						{#if item.imageUrl}
							<img src={item.imageUrl} alt={item.name} />
						{:else}
							<div class="placeholder-image"></div>
						{/if}
					</div>

					<div class="item-details">
						<h3>{item.name}</h3>
						<p class="item-price">${item.price.toFixed(2)}</p>

						<div class="quantity-controls">
							<button onclick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
							<span>{item.quantity}</span>
							<button onclick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
						</div>
					</div>

					<div class="item-total">
						<p>${(item.price * item.quantity).toFixed(2)}</p>

						<button class="remove-btn" onclick={() => handleRemoveItem(item.id)}> Remove </button>
					</div>
				</div>
			{/each}

			<div class="cart-summary">
				<div class="subtotal">
					<span>Subtotal:</span>
					<span>${cartTotal.toFixed(2)}</span>
				</div>

				<div class="checkout-form">
					<input
						type="email"
						placeholder="Your email"
						value={customerEmail}
						onchange={(e) => setEmail(e.target.value)}
						required
					/>

					<button
						class="checkout-btn"
						onclick={handleCheckout}
						disabled={isProcessingPayment || cart.length === 0}
					>
						{isProcessingPayment ? 'Processing...' : 'Proceed to Checkout'}
					</button>
				</div>

				<a href="/products" class="continue-shopping">Continue Shopping</a>
			</div>
		</div>
	{/if}
</div>

<style>
	h1 {
		color: var(--color-accent);
		-webkit-text-stroke: 1px var(--color-secondary);
		font-family: var(--font-title);
		font-size: clamp(var(--h5), 5vw, var(--lg));
		text-align: center;
		letter-spacing: 2px;
	}

	.cart-page {
		max-width: 960px;
		margin: 2rem auto;
		padding: 1rem;
	}

	.empty-cart {
		text-align: center;
		margin: 4rem 0;
		font-family: var(--font-regular);
		font-size: clamp(var(--h6), 2vw, var(--h3));
		font-weight: 600;
	}

	.cart-items {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.cart-item {
		display: grid;
		grid-template-columns: 120px 1fr auto;
		gap: 1.5rem;
		padding: 1.5rem;
		border: 1px solid #eee;
		border-radius: 8px;
	}

	.item-image img,
	.placeholder-image {
		width: 100%;
		height: 100px;
		object-fit: cover;
		border-radius: 4px;
		background-color: #f0f0f0;
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;

		& button {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			border: none;
			background-color: #f1f1f1;
			cursor: pointer;
		}
	}

	.remove-btn {
		font-family: var(--font-regular);
		font-size: clamp(var(--sm), 2vw, var(--h6));
		color: var(--color-danger);
		background: none;
		border: none;
		cursor: pointer;
		margin-top: 1rem;
	}

	.cart-summary {
		margin-top: 2rem;
		padding: 1.5rem;
		border: 1px solid #eee;
		border-radius: 8px;
	}

	.subtotal {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-regular);
		font-size: clamp(var(--sm), 2vw, var(--h6));
		margin-bottom: 1.5rem;
	}

	.checkout-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1.5rem 0;

		& input {
			padding: 0.75rem;
			border: 1px solid #ddd;
			border-radius: var(--radius);
			font-size: clamp(var(--sm), 2vw, var(--h6));
			font-weight: 600;
		}
	}

	.checkout-btn {
		background-color: var(--color-accent);
		color: var(--color-secondary);
		border: none;
		border-radius: 4px;
		padding: 1rem;
		font-family: var(--font-regular);
		font-size: clamp(var(--sm), 2vw, var(--h6));
		cursor: pointer;

		&:disabled {
			background-color: #cccccc;
		}
	}

	.continue-shopping {
		display: inline-block;
		margin-top: 1rem;
		color: var(--color-accent);
		text-decoration: none;
		font-size: clamp(var(--sm), 2vw, var(--h6));
		font-weight: 600;
	}
</style>
