<script>
	import bcardfront from '$lib/assets/bcard-front.webp';
	import bcardback from '$lib/assets/bcard-back.webp';
</script>

<section>
	<div class="cards">
		<img class="left" src={bcardfront} alt="Business Card Front" width="600" height="400" />

		<img class="right" src={bcardback} alt="Business Card Back" width="600" height="400" />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: hsl(0, 0%, 100%);
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

			&.left {
				view-transition-name: left;
			}

			&.right {
				view-transition-name: right;
			}
		}

		& .cards {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 2rem;
			position: relative;
			margin: 0;
			transform: translateY(2em);
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

	::view-transition-old(left) {
		animation: left-out 1.25s ease-out forwards;
	}

	::view-transition-new(left) {
		animation: left-in 1.25s ease-out forwards;
	}

	::view-transition-old(right) {
		animation: right-out 1.25s ease-out forwards;
	}

	::view-transition-new(right) {
		animation: right-in 1.25s ease-out forwards;
	}

	@keyframes left-out {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-150%);
		}
	}

	@keyframes right-out {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(150%);
		}
	}

	@keyframes left-in {
		0% {
			transform: translateX(-150%);
		}
		100% {
			transform: translateX(0);
		}
	}

	@keyframes right-in {
		0% {
			transform: translateX(150%);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
