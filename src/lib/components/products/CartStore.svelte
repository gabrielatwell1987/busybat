<script module>
	import { loadStripe } from '@stripe/stripe-js';
	import { browser } from '$app/environment';

	// Initialize state from localStorage or default values
	let savedCart = [];
	let savedEmail = '';

	if (browser) {
		try {
			const saved = localStorage.getItem('busybat_cart');
			if (saved) {
				const { cart: loadedCart, customerEmail: loadedEmail } = JSON.parse(saved);
				savedCart = loadedCart;
				savedEmail = loadedEmail;
			}
		} catch (e) {
			console.error('Error loading cart from localStorage:', e);
		}
	}

	// Create reactive state with runes
	let cart = $state(savedCart);
	let customerEmail = $state(savedEmail);
	let isProcessingPayment = $state(false);

	// Initialize Stripe
	const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

	// Add to cart function
	export function addToCart(product) {
		const newCart = [...cart];
		const existingItem = newCart.find((item) => item.id === product.id);

		if (existingItem) {
			existingItem.quantity += 1;
			cart = newCart; // Trigger reactivity with assignment
		} else {
			cart = [...cart, { ...product, quantity: 1 }]; // Trigger reactivity with new array
		}
		console.log('Cart updated:', cart); // Debug log
	}

	// Remove from cart
	export function removeFromCart(productId) {
		cart = cart.filter((item) => item.id !== productId);
	}

	// Update item quantity
	export function updateQuantity(productId, newQuantity) {
		if (newQuantity < 1) {
			removeFromCart(productId);
			return;
		}
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

	// Calculate cart total
	export function getCartTotal() {
		return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	// Handle checkout
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
				throw new Error(`Server error (${response.status})`);
			}

			const { sessionId } = await response.json();
			const stripe = await stripePromise;

			if (!stripe) {
				throw new Error('Stripe failed to initialize');
			}

			const { error } = await stripe.redirectToCheckout({ sessionId });
			if (error) throw error;
		} catch (error) {
			console.error('Checkout error:', error);
			alert(`Payment error: ${error.message || 'Unknown error'}`);
		} finally {
			isProcessingPayment = false;
		}
	}
</script>
