<script>
	import ViewTransition from './ViewTransition.svelte';
	import VerticalTitle from './VerticalTitle.svelte';

	const images = [
		{ src: '/products/mini-menace-chain__side.webp', alt: 'Description 1' },
		{ src: '/products/mini-menace-chain__forward.webp', alt: 'Description 2' },
		{ src: '/products/dh-jacket__shoulder-left.webp', alt: 'Description 3' },
		{ src: '/products/dh-jacket__shoulder-right.webp', alt: 'Description 4' }
	];

	// Active slide state
	let currentSlide = 0;

	// Function to handle slide change
	function changeSlide(index) {
		if (index < 0) {
			currentSlide = images.length - 1;
		} else if (index >= images.length) {
			currentSlide = 0;
		} else {
			currentSlide = index;
		}
	}

	// Keyboard navigation handler
	function handleKeydown(event) {
		switch (event.key) {
			case 'ArrowLeft':
				changeSlide(currentSlide - 1);
				break;
			case 'ArrowRight':
				changeSlide(currentSlide + 1);
				break;
			default:
				return;
		}
		event.preventDefault();
	}
</script>

<a href="#carousel-controls" class="skip-link">Skip to carousel controls</a>

<VerticalTitle title="Gallery" />

<main
	class="carousel"
	role="region"
	aria-roledescription="carousel"
	aria-label="Product gallery"
	tabindex="-1"
>
	<span class="visually-hidden">Use left and right arrow keys to navigate between slides</span>

	<div class="carousel-container">
		<div
			class="carousel-slides"
			aria-live="polite"
			style="transform: translateX(-{currentSlide * 100}%)"
		>
			{#each images as image, i}
				<div
					class="carousel-slide"
					role="group"
					aria-roledescription="slide"
					aria-label="Slide {i + 1} of {images.length}"
					aria-hidden={currentSlide !== i}
				>
					<img src={image.src} alt={image.alt || `Product image ${i + 1}`} />
				</div>
			{/each}
		</div>

		{#if images.length > 1}
			<div class="carousel-controls" id="carousel-controls" tabindex="-1">
				<button
					class="prev-slide"
					aria-label="Previous slide"
					onclick={() => changeSlide(currentSlide - 1)}
					onkeydown={handleKeydown}
					type="button"
				>
					❮
				</button>

				<button
					class="next-slide"
					aria-label="Next slide"
					onclick={() => changeSlide(currentSlide + 1)}
					onkeydown={handleKeydown}
					type="button"
				>
					❯
				</button>
			</div>

			<div class="carousel-nav" role="tablist" aria-label="Slide navigation">
				{#each images as _, i}
					<button
						class="nav-dot"
						role="tab"
						aria-selected={currentSlide === i}
						aria-label="Go to slide {i + 1}"
						aria-controls="slide-{i}"
						onclick={() => changeSlide(i)}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--color-accent, #2563eb);
		color: white;
		padding: 8px;
		z-index: 1000;
		transition: top 0.2s ease;

		&:focus {
			top: 0;
		}
	}

	.carousel {
		max-width: 1200px;
		width: 100%;
		height: 100dvh;
		margin-inline: auto;
		position: relative;
		overflow: hidden;

		&:focus {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		@media (width <= 500px) {
			height: 70dvh;
		}

		& .carousel-container {
			width: 100%;
			position: relative;

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

			& .carousel-controls {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 5;
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
				z-index: 10;
				pointer-events: auto;
				border: none;

				&:focus {
					outline: 2px solid var(--color-accent);
					outline-offset: 2px;
				}
			}

			& .prev-slide {
				left: 10px;
			}

			& .next-slide {
				right: 10px;
			}

			& .carousel-nav {
				position: absolute;
				bottom: 20px;
				left: 0;
				right: 0;
				display: flex;
				justify-content: center;
				gap: 10px;
				z-index: 10;

				& .nav-dot {
					width: 0.75rem;
					height: 0.75rem;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.5);
					cursor: pointer;
					transition: background 0.3s ease;
					border: none;
					padding: 0;

					&[aria-selected='true'] {
						background: white;
						transform: scale(1.2);
					}

					&:focus {
						outline: 2px solid white;
						outline-offset: 2px;
					}
				}
			}
		}
	}
</style>
