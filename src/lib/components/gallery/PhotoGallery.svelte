<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import ViewTransition from '$lib/data/ViewTransition.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';

	let supportsViewTransitions = $state(false);

	onMount(() => {
		supportsViewTransitions = browser && 'startViewTransition' in document;
	});

	// gallery images
	const images = [
		{
			id: 'mini-menace-side',
			src: '/products/mini.menace/mini-menace-chain__side.webp',
			alt: 'Mini Menace Tote viewed at an angle',
			title: 'Mini Menace Tote'
		},
		{
			id: 'mini-menace-forward',
			src: '/products/mini.menace/mini-menace-chain__forward.webp',
			alt: 'Mini Menace Tote viewed from the front',
			title: 'Mini Menace Tote'
		},
		{
			id: 'mini-menace-open',
			src: '/products/mini.menace/mini-menace-chain__open.webp',
			alt: 'inside the Mini Menace Tote showing a zipper pocket',
			title: 'Mini Menace Tote'
		},
		{
			id: 'dh-jacket-front',
			src: '/products/d.harry/dh-jacket__front.webp',
			alt: 'D. Harry jacket from the front',
			title: 'D. Harry Denim Jacket'
		},
		{
			id: 'dh-jacket-left',
			src: '/products/d.harry/dh-jacket__shoulder-left.webp',
			alt: 'D. Harry jackets left shoulder',
			title: 'D. Harry Denim Jacket'
		},
		{
			id: 'dh-jacket-right',
			src: '/products/d.harry/dh-jacket__shoulder-right.webp',
			alt: 'D. Harry jackets right shoulder',
			title: 'D. Harry Denim Jacket'
		},
		{
			id: 'dainty-pink-front',
			src: '/products/dainty.doomsday/dainty-pink__front.webp',
			alt: 'the front of Dainty Doomsday in Witches Brew',
			title: 'Dainty Doomsday in Witches Brew'
		},
		{
			id: 'dainty-pink-open',
			src: '/products/dainty.doomsday/dainty-pink__open.webp',
			alt: 'Inside Dainty Doomsday in Witches Brew showing two pockets',
			title: 'Dainty Doomsday in Witches Brew'
		},
		{
			id: 'dainty-pink-open-straps',
			src: '/products/dainty.doomsday/dainty-pink__open-straps.webp',
			alt: 'the Dainty Doomsday in Witches Brew with some business cards',
			title: 'Dainty Doomsday in Witches Brew'
		},
		{
			id: 'dainty-red-front',
			src: '/products/dainty.doomsday/dainty-red__front.webp',
			alt: 'the front of the Dainty Doomsday Tote',
			title: 'Dainty Doomsday Tote'
		},
		{
			id: 'dainty-red-open',
			src: '/products/dainty.doomsday/dainty-red__open.webp',
			alt: 'Inside Dainty Doomsday Tote showing two pockets',
			title: 'Dainty Doomsday Tote'
		},
		{
			id: 'dainty-red-open-straps',
			src: '/products/dainty.doomsday/dainty-red__closed.webp',
			alt: 'A closed Dainty Doomsday Tote',
			title: 'Dainty Doomsday Tote'
		},
		{
			id: 'major-menace-front',
			src: '/products/major.menace/major-menace__front.webp',
			alt: 'Major Menace Tote viewed from the front',
			title: 'Major Menace Tote'
		},
		{
			id: 'major-menace-open',
			src: '/products/major.menace/major-menace__open.webp',
			alt: 'Inside Major Menace Tote showing one zipper pocket',
			title: 'Major Menace Tote'
		},
		{
			id: 'major-menace-open-straps',
			src: '/products/major.menace/major-menace__open-zippers.webp',
			alt: 'Inside Major Menace Tote showing multiple wallet pockets',
			title: 'Major Menace Tote'
		}
	];

	// Active slide state
	let currentSlide = $state(0);

	// Function to handle slide change
	function changeSlide(index) {
		// Use View Transition API if available
		if (supportsViewTransitions) {
			document.startViewTransition(() => {
				updateSlide(index);
			});
		} else {
			// Fallback for browsers without view transition support
			updateSlide(index);
		}

		// Announce slide change to screen readers
		announceSlideChange(index);
	}

	// Function to announce slide changes to screen readers
	function announceSlideChange(index) {
		const announcer = document.getElementById('slide-announcer');
		if (announcer) {
			const slideNumber = index + 1;
			const total = images.length;
			const title = images[index]?.title || `Image ${slideNumber}`;
			announcer.textContent = `Showing slide ${slideNumber} of ${total}: ${title}`;
		}
	}

	// Separate function to update slide state
	function updateSlide(index) {
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
				event.preventDefault();
				changeSlide(currentSlide - 1);
				break;
			case 'ArrowRight':
				event.preventDefault();
				changeSlide(currentSlide + 1);
				break;
			case 'Home':
				event.preventDefault();
				changeSlide(0);
				break;
			case 'End':
				event.preventDefault();
				changeSlide(images.length - 1);
				break;
			default:
				return;
		}
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

		// Auto-focus the keyboard handler for immediate arrow key navigation
		const keyboardHandler = document.querySelector('.carousel-keyboard-handler');
		if (keyboardHandler) {
			keyboardHandler.focus();
		}

		// Announce the initial slide after a brief delay
		setTimeout(() => {
			announceSlideChange(currentSlide);
		}, 500);

		// Clean up on component destroy
		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

<VerticalTitle title="Gallery" />

<main class="carousel" role="region" aria-roledescription="carousel" aria-label="Product gallery">
	<!-- Screen reader announcements for slide changes -->
	<div id="slide-announcer" aria-live="polite" aria-atomic="true" class="visually-hidden"></div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="carousel-keyboard-handler"
		tabindex="0"
		onkeydown={handleKeydown}
		role="application"
		aria-label="Gallery keyboard navigation - use arrow keys to navigate"
	>
		<span class="visually-hidden"
			>Use left and right arrow keys to navigate between slides, Home for first slide, End for last
			slide</span
		>

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
							<div
								class="slide-title"
								style={supportsViewTransitions
									? `view-transition-name: slide-title-${currentSlide === i ? 'active' : i}`
									: ''}
							>
								{image.title}
							</div>
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

		/* Keyboard handler styles */
		& .carousel-keyboard-handler {
			width: 100%;
			height: 100%;
			position: relative;
			outline: none;
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
						background-color: var(--color-primary);
						color: var(--color-dark);
						padding: 0.5rem 0.75rem;
						border: 1px solid var(--color-dark);
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
				z-index: 3;
			}

			& .prev-slide,
			& .next-slide {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				padding: 0.75rem 1rem;
				background: var(--color-dark);
				color: white;
				cursor: pointer;
				border-radius: 10%;
				font-size: clamp(1rem, 2vw, 2rem);
				z-index: 4;
				pointer-events: auto;
				border: none;

				&:focus {
					outline: 2px solid var(--color-dark);
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
				z-index: 4;
				padding: 0.5rem 0.75rem;
				background-color: var(--color-dark);
				border-radius: 20px;
				width: fit-content;
				margin-inline: auto;

				@media (width >= 1024px) {
					bottom: 2em;
					z-index: 5;
				}

				@media (width >= 500px) and (width <= 800px) {
					bottom: -2em;
				}

				@media (width <= 500px) {
					display: none;
					bottom: -2.5em;
					padding: 0.4rem 0.6rem;
				}

				& .nav-dot {
					width: clamp(0.75rem, 2vw, 1rem);
					height: clamp(0.75rem, 2vw, 1rem);
					border-radius: 50%;
					background: var(--color-light);
					cursor: pointer;
					transition: background 0.3s ease;
					border: none;
					padding: 0;
					margin: 0 0.25rem;

					&[aria-selected='true'] {
						background: var(--color-accent);
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

	/* View Transition Animations */
	@supports (view-transition-name: none) {
		::view-transition-old(slide-title-active),
		::view-transition-new(slide-title-active) {
			animation-duration: 0.75s;
			animation-timing-function: ease-in-out;
		}

		::view-transition-old(slide-title-active) {
			animation-name: slide-title-out;
		}

		::view-transition-new(slide-title-active) {
			animation-name: slide-title-in;
		}
	}

	/* Fallback for browsers without view transition support */
	@supports not (view-transition-name: none) {
		[style*='view-transition-name: slide-title'] {
			transition:
				opacity 0.5s ease,
				transform 0.5s ease !important;
			animation: none !important;
		}
	}

	@keyframes slide-title-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
			scale: 0;
		}
	}

	@keyframes slide-title-in {
		from {
			opacity: 0;
			scale: 0.5;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
</style>
