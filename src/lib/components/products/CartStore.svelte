<script module>
	import { loadStripe } from '@stripe/stripe-js';

	// Create reactive state with proper Svelte 5 syntax
	let cart = $state([]);
	let customerEmail = $state('');
	let isProcessingPayment = $state(false);

	// Initialize Stripe
	const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

	// Add to cart function
	export function addToCart(product) {
		console.log('Adding to cart:', product);

		// Check if item is already in cart
		const existingItem = cart.find((item) => item.id === product.id);

		if (existingItem) {
			// Update quantity if it exists
			cart = cart.map((item) =>
				item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
			);
		} else {
			// Add new item with quantity 1
			cart = [...cart, { ...product, quantity: 1 }];
		}

		console.log('Cart after update:', cart);
	}

	// Remove from cart
	export function removeFromCart(productId) {
		console.log('Removing item from cart, ID:', productId);
		console.log('Cart before removal:', cart);

		// Create a new array without the item to be removed
		cart = cart.filter((item) => item.id !== productId);

		console.log('Cart after removal:', cart);
	}

	// Update item quantity
	export function updateQuantity(productId, newQuantity) {
		console.log(`Updating quantity for item ${productId} to ${newQuantity}`);

		if (newQuantity < 1) {
			// If quantity becomes zero or negative, remove the item
			removeFromCart(productId);
			return;
		}

		// Create a new array with the updated item
		cart = cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item));
	}

	// Export cart data for components to use
	export function getCartData() {
		return {
			cart,
			customerEmail,
			isProcessingPayment,
			setEmail: (email) => (customerEmail = email)
		};
	}

	// Set email function
	export function setEmail(email) {
		customerEmail = email;
	}

	// Calculate cart total
	export function getCartTotal() {
		return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	// Updated handleCheckout function with better error handling and logging
	export async function handleCheckout() {
		if (cart.length === 0) {
			alert('Your cart is empty');
			return;
		}

		isProcessingPayment = true;

		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					items: cart,
					customerEmail
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Server error (${response.status}): ${errorText}`);
			}

			const { sessionId } = await response.json();

			// Redirect to Stripe Checkout
			const stripe = await stripePromise;

			if (!stripe) {
				throw new Error('Stripe failed to initialize. Check your publishable key.');
			}

			const { error } = await stripe.redirectToCheckout({ sessionId });

			if (error) {
				console.error('Stripe redirect error:', error);
				throw error;
			}
		} catch (error) {
			console.error('Checkout error:', error);
			alert(`Payment error: ${error.message || 'Unknown error'}`);
		} finally {
			isProcessingPayment = false;
		}
	}
</script>
