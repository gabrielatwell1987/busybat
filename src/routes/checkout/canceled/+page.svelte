<script>
	import SEO from '$lib/data/SEO.svelte';
	// No special logic needed for canceled payments
</script>

<SEO
	title="Payment Canceled &middot; Busy Little Bat Sewing"
	description="Your checkout session was canceled. Continue shopping for our handmade clothing and accessories."
	keywords="payment canceled, checkout canceled, alternative fashion, handmade clothing, busy little bat sewing canceled payment"
/>

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
		margin: auto;
		padding: 2rem;
		text-align: center;

		@media (width <= 768px) {
			margin-top: -5em;
		}

		& h1 {
			font-size: clamp(var(--h4), 5vw, var(--lg));
			letter-spacing: -1px;
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);

			@media (width <= 500px) {
				letter-spacing: 0;
			}
		}

		& .canceled-message {
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
		}

		& .continue-button {
			display: inline-block;
			margin-top: 1rem;
			padding: 0.75rem 1.5rem;
			background-color: var(--color-accent);
			color: var(--color-white);
			text-decoration: none;
			border-radius: 4px;
			font-family: var(--font-semibold);
			font-size: clamp(var(--sm), 2vw, var(--h5));
			letter-spacing: 1px;

			&:hover {
				background-color: hsl(320, 75%, 56%);
			}
		}
	}
</style>
