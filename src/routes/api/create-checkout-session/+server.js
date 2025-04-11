import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
	try {
		console.log('Creating checkout session...');

		const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
		const { items, customerEmail } = await request.json();

		if (!items || items.length === 0) {
			console.error('No items in cart');
			return json({ error: 'No items in cart' }, { status: 400 });
		}

		// Format line items for Stripe with URL validation
		const lineItems = items.map((item) => {
			// Create product data object
			const productData = {
				name: item.name
			};

			// Convert relative URL to absolute if needed
			if (item.imageUrl) {
				if (item.imageUrl.startsWith('/')) {
					productData.images = [`${url.origin}${item.imageUrl}`];
				} else if (isValidHttpUrl(item.imageUrl)) {
					productData.images = [item.imageUrl];
				}
			}

			// Only add description if it exists and isn't empty
			if (item.description && item.description.trim() !== '') {
				productData.description = item.description;
			}

			return {
				price_data: {
					currency: 'usd',
					product_data: productData,
					unit_amount: Math.round(item.price * 100)
				},
				quantity: item.quantity
			};
		});

		console.log('Creating Stripe session...');
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${url.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.origin}/checkout/canceled`,
			customer_email: customerEmail || undefined
		});

		console.log('Session created:', session.id);
		return json({ sessionId: session.id });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}

// Helper function to validate URLs
function isValidHttpUrl(string) {
	try {
		const url = new URL(string);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}
