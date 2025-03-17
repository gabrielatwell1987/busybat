<script>
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
</script>

<SEO
	title="Busy Little Bat Sewing &middot; About Us"
	description="About Busy Little Bat Sewing Co."
	keywords="about busy bat, about busy bat sewing co"
/>

<main>
	<VerticalTitle title="About" />

	<div class="content">
		<h2>About page</h2>

		<h5>All about us</h5>

		<div class="summary">
			<p class="width">About <span>Busy Little Bat Sewing Co.</span></p>

			<p class="width indent">We make custom clothing and accessories for all ages and sizes.</p>

			<p class="width indent">
				We specialize in unique and fun designs. We are a small business that is dedicated to
				providing quality products and services to our customers. We take pride in our work and
				strive to make every customer happy. We are very passionate about sewing and love sharing
				our knowledge with others. We are committed to providing a positive and welcoming
				environment for all of our customers. We look forward to working with you!
			</p>

			<p class="width indent">
				If you have any questions or would like to learn more about our products and services,
				please feel free to contact us. We are always happy to help and look forward to hearing from
				you!
			</p>
		</div>
	</div>
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
				font-size: clamp(var(--h4), 5vw, var(--xl));
				font-weight: 700;
				letter-spacing: 5px;
				margin: 0;
				padding: 0;
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-secondary);
			}

			& h5 {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				font-weight: 300;
				font-style: italic;
				margin: 0;
				padding: 0;
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
						max-width: 1200px;
						width: 100%;
						margin-inline: auto;
						text-align: left;
						font-size: clamp(var(--sm), 3vw, var(--h5));
						font-weight: 500;

						&:first-child {
							text-align: center;
							font-size: clamp(var(--h6), 5vw, var(--h3));
							font-weight: 200;
							letter-spacing: 3px;
							margin-bottom: 1.5em;

							& span {
								font-family: var(--font-bold);
								font-weight: 900;
							}
						}

						&:nth-child(2) {
							font-size: clamp(var(--h6), 5vw, var(--h5));
							font-weight: 600;
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
