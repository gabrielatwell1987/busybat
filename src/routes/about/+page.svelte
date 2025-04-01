<script>
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
	import Image from '$lib/components/Image.svelte';
	import card from '$lib/assets/bcard-front.webp';
	import leopard from '$lib/assets/leopard.webp';
</script>

<SEO
	title="Busy Little Bat Sewing &middot; About Us"
	description="About Busy Little Bat Sewing."
	keywords="about busy little bat sewing, about busy little bat"
/>

<main>
	<VerticalTitle title="About" />

	<section class="content">
		<h5>Busy Little Bat Sewing</h5>

		<h2>About us</h2>

		<article class="summary">
			<p class="width indent">I make custom clothing and accessories for all ages and sizes.</p>

			<p class="width indent">
				I specialize in unique and fun designs. I are a small business that is dedicated to
				providing quality products and services to our customers. I take pride in our work and
				strive to make every customer happy. I are very passionate about sewing and love sharing our
				knowledge with others. I are committed to providing a positive and welcoming environment for
				all of our customers. We look forward to working with you!
			</p>

			<p class="width">
				If you have any questions or would like to learn more about our products and services,
				please feel free to contact us. I am always happy to help and look forward to hearing from
				you!
			</p>
		</article>

		<Image src={card} alt="Busy Little Bat Sewing" width="auto" />
	</section>
</main>

<style>
	main {
		height: auto;

		& .content {
			display: grid;
			place-items: center;
			padding-top: 3em;
			margin-bottom: 5em;
			padding-top: 3em;
			view-transition-name: slide-content;

			& h2 {
				font-family: var(--font-title);
				font-size: clamp(var(--h4), 15vw, var(--xxl));
				font-weight: 700;
				letter-spacing: 5px;
				margin: 0;
				padding: 0;
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-secondary);
				text-shadow: 2px 4px 4px rgba(100, 100, 100, 0.35);
			}

			& h5 {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				font-weight: 700;
				font-style: italic;
				margin: 0;
				padding: 0;
				margin-bottom: -1em;

				@media (width <= 850px) {
					margin-bottom: -0.5em;
				}
			}

			& .summary {
				margin-top: 1em;

				& p {
					margin-bottom: 0.15rem;
					padding: 0;
					font-size: clamp(var(--sm), 2vw, var(--h5));
					font-weight: 300;
					text-align: center;

					&.width {
						max-width: 1500px;
						width: 100%;
						margin-inline: auto;
						text-align: left;
						font-size: clamp(var(--sm), 4vw, var(--h5));
						font-weight: 500;

						&:first-child {
							text-align: center;
							font-family: var(--font-bold);
							font-size: clamp(var(--h5), 5vw, var(--h1));
							font-weight: 200;
							max-width: 1200px;
							width: fit-content;
							line-height: 1.25;
							margin-bottom: 1.5em;
							padding: 0;
							text-wrap: balance;
							color: var(--color-dark);
						}

						&:nth-child(2) {
							font-size: clamp(var(--h6), 6vw, var(--h4));
						}

						&:nth-child(3) {
							font-size: clamp(var(--sm), 3vw, var(--h5));
							font-weight: 800;
							letter-spacing: 2px;
							opacity: 0.85;

							@media (width <= 500px) {
								letter-spacing: 0;
							}
						}
					}
				}
			}
		}
	}

	::view-transition-old(slide-content) {
		animation: slide-down var(--timing) ease-out forwards;
	}

	::view-transition-new(slide-content) {
		animation: slide-up var(--timing) ease-out forwards;
	}

	@keyframes slide-up {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(0);
		}
	}

	@keyframes slide-down {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(100%);
		}
	}
</style>
