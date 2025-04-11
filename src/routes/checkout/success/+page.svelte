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

		& .success-message {
			margin: 2rem 0;
			padding: 1.5rem;
			background-color: #f0fff0;
			border-radius: 8px;
			border-left: 4px solid #4caf50;

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
			margin-top: 2rem;
			padding: 0.75rem 1.5rem;
			background-color: #4caf50;
			color: white;
			text-decoration: none;
			border-radius: 4px;
			font-weight: bold;
		}
	}
</style>
