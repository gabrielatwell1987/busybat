<script>
	// No special logic needed for canceled payments
</script>

<section class="canceled-container">
	<h1>Payment Canceled</h1>

	<div class="canceled-message">
		<p>Your checkout session was canceled and no payment has been processed.</p>
		<p>If you encountered any issues during checkout, please contact our support team.</p>
	</div>

	<div class="buttons">
		<a href="/products" class="continue-button">Continue Shopping</a>
	</div>
</section>

<style>
	.canceled-container {
		max-width: 600px;
		margin: 4rem auto;
		text-align: center;
		padding: 2rem;

		& .canceled-message {
			margin: 2rem 0;
			padding: 1.5rem;
			background-color: #fffdfa;
			border-radius: 8px;
			border-left: 4px solid #ff9800;
		}

		& .continue-button {
			display: inline-block;
			margin-top: 1rem;
			padding: 0.75rem 1.5rem;
			background-color: #4caf50;
			color: white;
			text-decoration: none;
			border-radius: 4px;
			font-weight: bold;
		}
	}
</style>
