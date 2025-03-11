<script>
	import b from '$lib/assets/b-noBG.webp';
</script>

<section>
	<div class="cards">
		<img class="rotate" src={b} alt="Icon" width="600" height="400" />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: transparent;
		border-radius: var(--radius);
		height: 100%;
		position: relative;
		z-index: 1;

		& img {
			aspect-ratio: 16 / 9;
			border-radius: 5px;
			width: fit-content;

			@media (width <= 768px) {
				width: 100%;
				max-width: 500px;
				height: auto;
				margin-inline: auto;
				scale: 1.5;
				padding-top: 5em;
			}

			&.rotate {
				view-transition-name: rotate;
			}
		}

		& .cards {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 2rem;
			position: relative;
			margin: 0;
			transform: translateY(-2em);
			padding-top: 2em;
		}

		@media (width <= 1400px) {
			.cards {
				flex-direction: column;
				scale: 0.8;
			}
		}

		@media (width <= 885px) {
			& .cards {
				gap: 1rem;
				scale: 0.65;
				transform: translateY(-10rem);
				padding-top: 0;
			}
		}
	}

	::view-transition-old(rotate) {
		animation: rotate 1s ease-out forwards;
	}

	::view-transition-new(rotate) {
		animation: rotate 1s ease-out forwards;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
			scale: 1;
		}
		25% {
			transform: rotate(-15deg);
			scale: 1.1;
		}
		50% {
			transform: rotate(0deg);
			scale: 1;
		}
		75% {
			transform: rotate(15deg);
			scale: 1.1;
		}
		100% {
			transform: rotate(0deg);
			scale: 1;
		}
	}
</style>
