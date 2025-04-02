<script>
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
	import Image from '$lib/components/Image.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<SEO
	title="Busy Little Bat Sewing &middot; About Us"
	description="About Busy Little Bat Sewing."
	keywords="about busy little bat sewing, about busy little bat"
/>

<div class="background-wrapper"></div>

<div class="about-container">
	<VerticalTitle title="About" />

	<section class="content">
		<h2>Welcome to</h2>
		<h2>Busy Little Bat Sewing</h2>
		<h2>where dark meets delightful in every stitch</h2>

		<article class="summary">
			<p class="width indent">
				I am a bewitchingly uncommon spirit with a haunting passion for arts and sewing. My name is
				Adrienne and I am the busiest of all bats. With a background steeped in the mysteries of
				sewing, design, and art. I strive to bring the hauntingly beautiful to everything I create.
			</p>

			<p class="width indent">
				My journey began many dark nights ago with a passion for art, music and, quiet frankly,
				clothes that actually fit. As a self-trained sewist, I unearthed my passion for creating
				unique items that fit my goth/punk aesthetic. Over the years, I have sharpened my skills
				like a finely honed blade, gaining invaluable experience through various ghostly projects
				and eerie collaborations. Each step along the way has transformed me into the ghoul that I
				am today.
			</p>

			<p class="width indent">
				I specialize in upcycling old denim, flannels and t-shirts into items for those who dare to
				stand out. Each stitch weaves a web of gothic glamour, gutter-punk horror and eerie every
				day wear. My creations are made with a touch of magic and a whole lot of love. I create
				sustainable, wearable art the blends the macabre with sustainability proving that fashion
				can be both distinctive and kind to the planet. I believe that each ghastly creature on this
				planet has the power to change lives and bring about unsettlingly meaningful change.
			</p>
			<p class="width indent">
				Do you hear the whispers of the night calling? Whether you seek a custom creation, have a
				question from beyond, or simply wish to share your love for the eerie and elegant, I am but
				a message away. I welcome all kindred spirits, fellow night dwellers, and lovers of the
				beautifully macabre.
			</p>

			<div class="contact-me">
				<p class="width"><span>📜</span> Send a Raven (or email):</p>

				<Button title="Summon Me" href="/contact" />
			</div>

			<div class="contact-me">
				<p class="width"><span>📲</span> Echoes in the Void:</p>

				<Button
					title="Instagram"
					href="https://www.instagram.com/busy_little_bat_sewing/"
					newTab={true}
				/>
			</div>
		</article>
	</section>
</div>

<style>
	.background-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.2;
		z-index: 5;
		background-image: url(/photos/pink-leo.webp);
		background-repeat: repeat;
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
	}

	.about-container {
		height: auto;
		position: relative;
		z-index: 6;
		width: 100%;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;

		& .content {
			display: grid;
			place-items: center;
			margin-bottom: 5em;
			view-transition-name: slide-content;
			width: 100%;
			max-width: 1500px;
			padding: 0;
			box-sizing: border-box;

			@media (width <= 500px) {
				margin-inline: auto;
				padding: 0;
				max-width: 100%;
			}

			& h2 {
				font-family: var(--font-title);
				font-size: clamp(var(--h6), 5vw, var(--h1));
				font-weight: 700;
				margin: 0;
				padding: 0;
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-secondary);
				text-shadow: 2px 4px 4px rgba(100, 100, 100, 0.35);
				width: 75%;
				margin-inline: auto;
				text-align: center;
				width: 100%;
				max-width: 800px;

				@media (width <= 768px) {
					width: 100%;
				}

				&:nth-of-type(2) {
					margin-top: -0.5em;
				}

				&:nth-of-type(3) {
					line-height: 1.35;
					font-family: var(--font-semibold);
					font-size: clamp(var(--xs), 3vw, var(--h5));
					font-weight: 300;
					color: var(--color-secondary);
					-webkit-text-stroke: none;
					text-shadow: none;
				}
			}

			& .summary {
				margin-top: 1em;
				width: 100%;
				max-width: 1500px;
				padding: 0 1rem;
				box-sizing: border-box;

				& .contact-me {
					display: flex;
					gap: 1rem;
					align-items: center;
					justify-content: center;
					margin-bottom: 1rem;
					width: 100%;
					flex-wrap: wrap;

					&:first-of-type {
						margin-top: 2em;
					}

					@media (width <= 500px) {
						padding: 0 0.5rem;
					}

					& p.width {
						max-width: unset;
						width: auto;
						margin: 0;
						white-space: nowrap;
						flex-shrink: 0;

						& span {
							font-size: clamp(var(--sm), 4vw, var(--h1));
							opacity: 0.8;
						}
					}
				}

				& p {
					margin-bottom: 0.15rem;
					padding: 0;
					font-size: clamp(var(--sm), 2vw, var(--h5));
					font-weight: 300;
					text-align: center;

					&.width {
						max-width: 1500px;
						width: 100%;
						padding: 0 1rem;
						box-sizing: border-box;
						margin-inline: auto;
						text-align: left;
						font-size: clamp(var(--sm), 3vw, var(--h5));
						font-weight: 500;

						@media (width <= 500px) {
							padding: 0;
							max-width: 100%;
						}

						&:nth-child(3) {
							font-size: clamp(var(--sm), 3vw, var(--h5));
							font-weight: 800;
							letter-spacing: 2px;
							opacity: 0.85;

							@media (width <= 500px) {
								letter-spacing: 0;
								padding: 0;
								max-width: 100%;
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
