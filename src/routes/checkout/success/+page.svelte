<script>
	import { page } from '$app/stores';

	let sessionId = $state($page.url.searchParams.get('session_id') || '');
	let isVerified = $state(false);

	// Optional: Verify the payment with your backend
	$effect(async () => {
		if (sessionId) {
			try {
				const response = await fetch('/api/verify-payment', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ sessionId })
				});

				if (response.ok) {
					isVerified = true;
				}
			} catch (error) {
				console.error('Error verifying payment:', error);
			}
		}
	});
</script>

<section class="success-container">
	<h1>Thank You for Your Order!</h1>

	<div class="success-message">
		<p>Your payment was successful and your order has been placed.</p>
		<p>We've sent a confirmation email with your order details.</p>

		{#if sessionId}
			<p class="order-id">Order Reference: {sessionId.substring(0, 8)}...</p>
		{/if}
	</div>

	<a href="/products" class="continue-button">Continue Shopping</a>
</section>

<style>
	.success-container {
		max-width: 600px;
		margin: 4rem auto;
		text-align: center;
		padding: 2rem;

		& h1 {
			font-size: clamp(var(--h6), 5vw, var(--h1));
			letter-spacing: 4px;
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);

			@media (width <= 500px) {
				letter-spacing: 0;
			}
		}

		& .success-message {
			margin: 2rem 0;
			padding: 1.5rem;
			background-color: var(--color-primary);
			border-radius: 8px;
			border-left: 4px solid var(--color-accent);
			text-align: left;

			& p {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.5vw, var(--h5));
				color: var(--color-secondary);
			}

			& .order-id {
				font-family: monospace;
				background: #e8f5e9;
				padding: 0.5rem;
				border-radius: 4px;
				margin-top: 1rem;
			}
		}

		& .continue-button {
			display: inline-block;
			margin-top: 1rem;
			padding: 0.75rem 1.5rem;
			background-color: var(--color-success);
			color: var(--color-white);
			text-decoration: none;
			border-radius: 4px;
			font-family: var(--font-semibold);
			font-size: clamp(var(--sm), 2vw, var(--h5));
			letter-spacing: 2px;

			@media (width <= 500px) {
				letter-spacing: 0;
			}

			&:hover {
				background-color: hsl(134, 61%, 31%);
			}
		}
	}
</style>
