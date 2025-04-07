<script>
	import ViewTransition from './ViewTransition.svelte';
	import VerticalTitle from './VerticalTitle.svelte';

	// gallery images
	const images = [
		{
			id: 'mini-menace-side',
			src: '/products/mini-menace-chain__side.webp',
			alt: 'Mini Menace Tote from the side',
			title: 'Mini Menace Tote'
		},
		{
			id: 'mini-menace-forward',
			src: '/products/mini-menace-chain__forward.webp',
			alt: 'Mini Menace Tote',
			title: 'Mini Menace Tote'
		},
		{
			id: 'mini-menace-open',
			src: '/products/mini-menace-chain__open.webp',
			alt: 'inside the Mini Menace Tote',
			title: 'Mini Menace Tote'
		},
		{
			id: 'dh-jacket-left',
			src: '/products/dh-jacket__shoulder-left.webp',
			alt: 'D. Harry left shoulder',
			title: 'D. Harry Upcycled Denim'
		},
		{
			id: 'dh-jacket-right',
			src: '/products/dh-jacket__shoulder-right.webp',
			alt: 'D. Harry right shoulder',
			title: 'D. Harry Upcycled Denim'
		},
		{
			id: 'dh-jacket-pocket',
			src: '/products/dh-jacket__pocket.webp',
			alt: 'D. Harry jacket pocket',
			title: 'D. Harry Upcycled Denim'
		},
		{
			id: 'dh-jacket-front',
			src: '/products/dh-jacket__front.webp',
			alt: 'D. Harry jacket from the front',
			title: 'D. Harry Upcycled Denim'
		}
	];

	// Active slide state
	let currentSlide = $state(0);

	// Function to handle slide change
	function changeSlide(index) {
		if (index < 0) {
			currentSlide = images.length - 1;
		} else if (index >= images.length) {
			currentSlide = 0;
		} else {
			currentSlide = index;
		}

		// Update URL hash without scrolling
		const id = images[currentSlide].id;
		history.replaceState(null, '', `#${id}`);
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

	// Function to find slide index by ID
	function findSlideIndexById(id) {
		return images.findIndex((image) => image.id === id);
	}

	// Function to navigate to slide by ID
	function navigateToSlide(id) {
		const index = findSlideIndexById(id);
		if (index !== -1) {
			changeSlide(index);
		}
	}

	// Handle URL hash changes
	function handleHashChange() {
		const hash = window.location.hash;
		if (hash) {
			const slideId = hash.substring(1); // Remove the # character
			navigateToSlide(slideId);
		}
	}

	$effect(() => {
		// Check for hash on initial load
		handleHashChange();

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange);

		// Clean up on component destroy
		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

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
					id="slide-{image.id}"
					class="carousel-slide"
					role="group"
					aria-roledescription="slide"
					aria-label="Slide {i + 1} of {images.length}"
					aria-hidden={currentSlide !== i}
				>
					<img src={image.src} alt={image.alt || `Product image ${i + 1}`} />

					{#if image.title}
						<div class="slide-title">{image.title}</div>
					{/if}
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
	.carousel {
		max-width: 1200px;
		width: 100%;
		height: 100dvh;
		margin-inline: auto;
		position: relative;
		overflow: hidden;
		padding-bottom: 5em;

		&:focus {
			outline: 2px solid var(--color-secondary);
			outline-offset: 2px;
		}

		@media (width >= 1024px) {
			height: calc(100dvh + 5em);
			padding-bottom: 6em;
			margin-bottom: 2em;
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
					position: relative;
					height: 70vh;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;

					& img {
						width: 100%;
						height: auto;
						display: block;
						object-fit: contain;
						max-height: 70vh;
					}

					& .slide-title {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						width: fit-content;
						margin-inline: auto;
						color: var(--color-white);
						padding: 0.5rem 0.75rem;
						background-color: rgba(0, 0, 0, 0.3);
						border-radius: var(--radius);
						text-align: center;
						font-family: var(--font-bold);
						font-size: clamp(var(--h6), 2.5vw, var(--h4));
						letter-spacing: 2px;
						opacity: 1;

						@media (width <= 500px) {
							padding: 0.15rem 0.5rem;
						}
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
					outline: 2px solid var(--color-secondary);
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
				bottom: 2em;
				left: 0;
				right: 0;
				display: flex;
				justify-content: center;
				gap: 0.75rem;
				z-index: 10;
				padding: 0.5rem 0.75rem;
				background-color: rgba(0, 0, 0, 0.25);
				border-radius: 20px;
				width: fit-content;
				margin-inline: auto;

				@media (width >= 1024px) {
					bottom: 2em;
					z-index: 500;
				}

				@media (width >= 500px) and (width <= 800px) {
					bottom: -2em;
				}

				@media (width <= 500px) {
					bottom: -2.5em;
					padding: 0.4rem 0.6rem;
				}

				& .nav-dot {
					width: clamp(0.75rem, 2vw, 1rem);
					height: clamp(0.75rem, 2vw, 1rem);
					border-radius: 50%;
					background: var(--color-secondary);
					cursor: pointer;
					transition: background 0.3s ease;
					border: none;
					padding: 0;
					margin: 0 0.25rem;
					opacity: 0.6;

					&[aria-selected='true'] {
						background: var(--color-white);
						transform: scale(1.2);
						opacity: 0.75;
					}

					&:focus {
						outline: 1px solid var(--color-white);
						outline-offset: 2px;
						opacity: 0.75;
					}

					&:hover {
						opacity: 0.8;
					}
				}
			}
		}
	}
</style>
