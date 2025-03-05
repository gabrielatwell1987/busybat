<script>
	import logo from '$lib/assets/logo.webp';
	import smallfinal from '$lib/assets/small-final.webp';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="content">
	<picture>
		<source srcset={smallfinal} media="(max-width: 600px)" />

		<img src={logo} alt="busy little bat" />
	</picture>

	<div class="hero-content">
		<h1>Busy Little Bat Sewing</h1>

		<p>Handmade clothing and accessories for the spooky and the strange.</p>

		<Button href="/products" title="Shop Now" />
	</div>
</div>

<style>
	.content {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		height: 100vh;
		background-color: hsl(0, 0%, 100%);
		view-transition-name: content;
		transform: translateY(-6em);
		position: relative;

		overflow: hidden;
		position: relative;
		inset: 0;
		width: 100%;
		z-index: 1;

		& picture {
			opacity: 0.25;
		}

		& img {
			width: fit-content;
			height: auto;

			@media (width <= 1150px) {
				width: 100%;
				max-width: 800px;
				margin-inline: auto;
				display: grid;
				place-items: center;
				padding-top: 5em;
			}

			@media (width <= 980px) {
				max-width: 600px;
			}

			@media (width <= 768px) {
				width: 90%;
				max-width: 400px;
				padding-top: 3em;
			}
		}

		@media (width <= 500px) {
			transform: translateY(-2em);
		}

		& .hero-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 1rem;
			text-align: center;
			position: absolute;
			inset: 0;
			padding: 1rem;

			& h1 {
				font-family: var(--font-semibold);
				font-size: clamp(var(--h4), 5vw, var(--lg));
				font-weight: 900;
				letter-spacing: 4px;
				color: var(--color-dark);
				margin: 0;
				visibility: hidden;
			}

			& p {
				font-size: clamp(var(--sm), 1.5vw, var(--h5));
				font-weight: 600;
				color: var(--color-secondary);
				margin: 0.5em 0;
			}

			@media (width <= 1800px) {
				transform: translateY(5em);
			}

			@media (width <= 768px) {
				margin-bottom: 6em;
				transform: translateY(0);
			}
		}
	}

	::view-transition-old(content) {
		animation: scale-out 0.75s ease-out forwards;
	}

	::view-transition-new(content) {
		animation: scale-in 0.75s ease-out forwards;
	}

	@keyframes scale-out {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.25);
			opacity: 0;
		}
	}

	@keyframes scale-in {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
