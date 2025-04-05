<script>
	import ViewTransition from './ViewTransition.svelte';
	import VerticalTitle from './VerticalTitle.svelte';

	const images = [
		{ src: '/products/mini-menace-chain__side.webp', alt: 'Description 1' },
		{ src: '/products/mini-menace-chain__forward.webp', alt: 'Description 2' },
		{ src: '/products/dh-jacket__shoulder-left.webp', alt: 'Description 3' },
		{ src: '/products/dh-jacket__shoulder-right.webp', alt: 'Description 3' }
	];
</script>

<VerticalTitle title="Gallery" />

<main class="carousel">
	<div class="carousel-container">
		{#each images as image, i}
			<input type="radio" name="carousel" id="slide-{i}" checked={i === 0} />
		{/each}

		<div class="carousel-slides">
			{#each images as image}
				<div class="carousel-slide">
					<img src={image.src} alt={image.alt || ''} />
				</div>
			{/each}
		</div>

		<div class="carousel-nav">
			{#each images as _, i}
				<label for="slide-{i}" class="nav-dot"></label>
			{/each}
		</div>

		{#if images.length > 1}
			{#each images as _, i}
				<label for="slide-{(i - 1 + images.length) % images.length}" class="prev-slide">❮</label>
				<label for="slide-{(i + 1) % images.length}" class="next-slide">❯</label>
			{/each}
		{/if}
	</div>
</main>

<style>
	.carousel {
		max-width: 1200px;
		width: 100%;
		height: 100dvh;
		margin-inline: auto;
		position: relative;
		overflow: hidden;

		@media (width <= 500px) {
			height: 70dvh;
		}

		& .carousel-container {
			width: 100%;
			position: relative;

			& input {
				position: absolute;
				opacity: 0;
				z-index: -999;
			}

			& .carousel-slides {
				display: flex;
				width: 100%;
				transition: transform 0.5s ease-in-out;

				& .carousel-slide {
					min-width: 100%;
					box-sizing: border-box;

					& img {
						width: 100%;
						height: auto;
						display: block;
					}
				}
			}

			& .prev-slide,
			& .next-slide {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				padding: 0.75rem 1rem;
				background: rgba(0, 0, 0, 0.7);
				color: white;
				cursor: pointer;
				border-radius: 10%;
				font-size: clamp(1rem, 2vw, 2rem);
				display: none;
				z-index: 10;
			}

			& .prev-slide {
				left: 10px;
			}

			& .next-slide {
				right: 10px;
			}

			& .carousel-nav {
				& .nav-dot {
					width: 0.25rem;
					height: 0.25rem;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.5);
					cursor: pointer;
					transition: background 0.3s ease;
				}
			}
		}
	}

	#slide-0:checked ~ .carousel-slides {
		transform: translateX(0);
	}
	#slide-1:checked ~ .carousel-slides {
		transform: translateX(-100%);
	}
	#slide-2:checked ~ .carousel-slides {
		transform: translateX(-200%);
	}
	#slide-3:checked ~ .carousel-slides {
		transform: translateX(-300%);
	}
	#slide-4:checked ~ .carousel-slides {
		transform: translateX(-400%);
	}
	/* Add more as needed */

	/* Control navigation dots */
	#slide-0:checked ~ .carousel-nav .nav-dot:nth-child(1) {
		background: white;
	}
	#slide-1:checked ~ .carousel-nav .nav-dot:nth-child(2) {
		background: white;
	}
	#slide-2:checked ~ .carousel-nav .nav-dot:nth-child(3) {
		background: white;
	}
	#slide-3:checked ~ .carousel-nav .nav-dot:nth-child(4) {
		background: white;
	}
	#slide-4:checked ~ .carousel-nav .nav-dot:nth-child(5) {
		background: white;
	}
	/* Add more as needed */

	/* Control prev/next buttons */
	#slide-0:checked ~ .prev-slide[for='slide-4'],
	#slide-0:checked ~ .next-slide[for='slide-1'] {
		display: block;
	}
	#slide-1:checked ~ .prev-slide[for='slide-0'],
	#slide-1:checked ~ .next-slide[for='slide-2'] {
		display: block;
	}
	#slide-2:checked ~ .prev-slide[for='slide-1'],
	#slide-2:checked ~ .next-slide[for='slide-3'] {
		display: block;
	}
	#slide-3:checked ~ .prev-slide[for='slide-2'],
	#slide-3:checked ~ .next-slide[for='slide-4'] {
		display: block;
	}
	#slide-4:checked ~ .prev-slide[for='slide-3'],
	#slide-4:checked ~ .next-slide[for='slide-0'] {
		display: block;
	}
</style>
