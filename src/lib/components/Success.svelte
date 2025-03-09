<script>
	import Title from '$lib/components/Title.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
</script>

<section>
	<Title title="Success" />

	<VerticalTitle title="Success" />

	<p>
		<i>Your message has been sent successfully</i>.
	</p>

	<p>We will contact you as soon as possible.</p>
</section>

<style>
	section {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 90vh;
		gap: 1rem;
		transform: translateY(-2em);
		view-transition-name: success-slide;

		& p {
			font-size: clamp(var(--h6), 3vw, var(--h3));
			font-family: var(--font-regular);
			text-align: center;
			margin: 0;
			padding: 0;

			& i {
				font-size: clamp(var(--xs), 1vw, var(--h6));
				font-weight: 700;
			}
		}

		@media (width <= 500px) {
			transform: translateY(-5em);
		}
	}

	::view-transition-old(success-slide) {
		animation: success-slide-old 0.75s forwards ease-out;
	}

	::view-transition-new(success-slide) {
		animation: success-slide-new 1s forwards ease-out;
	}

	@keyframes success-slide-new {
		from {
			opacity: 0;
			transform: translateY(-5em);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes success-slide-old {
		to {
			opacity: 0;
			transform: translateY(5em);
		}
		from {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
