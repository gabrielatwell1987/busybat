<script>
	import { createEventDispatcher } from 'svelte';
	import miniMenaceImg from '$lib/assets/mini-menace-chain__open.webp';
	import dhSizeChart from '$lib/assets/dh-size-chart.webp';

	let {
		id,
		name,
		price,
		description,
		imageUrl,
		rating,
		inStock,
		context = 'default',
		productUrl,
		dropdownImage
	} = $props();
	let isEnlarged = $state(false);
	let isLoading = $state(false);
	let isDropdownOpen = $state(false);

	const dropdownImages = {
		'1': miniMenaceImg,
		'2': dhSizeChart
	};

	const actualDropdownImage = dropdownImages[id] || dropdownImage;
	const dispatch = createEventDispatcher();

	// For formatting price with currency
	const formatPrice = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	// Function to handle adding to cart
	function addToCart(event) {
		// Prevent the click from triggering the product enlargement
		event.stopPropagation();
		event.preventDefault();

		if (isLoading) return;
		isLoading = true;

		console.log('Opening URL:', productUrl);

		if (productUrl) {
			// wait before opening URL
			setTimeout(() => {
				const newWindow = window.open(productUrl, '_blank');

				if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
					window.location.href = productUrl;
				}

				isLoading = false;
			}, 1000);
		} else {
			// If no URL, reset loading state immediately
			setTimeout(() => {
				isLoading = false;
			}, 750);
		}

		// Dispatch a custom event that parent components can listen to
		dispatch('addtocart', { id, name, price, imageUrl, quantity: 1 });
	}

	function toggleEnlargement() {
		if (document.startViewTransition) {
			// Prepare elements before transition
			const otherProducts = document.querySelectorAll(
				`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
			);
			const footer = document.querySelector('footer');
			const isCurrentlyEnlarged = isEnlarged;

			// Set custom duration for the transition
			document.documentElement.style.setProperty('--view-transition-duration', '1.25s');
			document.documentElement.style.setProperty('--view-transition-delay', '0.2s');

			// Create a specific style for transition timing
			const styleEl = document.createElement('style');
			styleEl.textContent = `
				::view-transition-old(${context}-product-card-${id}),
				::view-transition-new(${context}-product-card-${id}) {
				animation-delay: 0.2s;
				animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
				animation-duration: 1.2s;
				}
			`;
			document.head.appendChild(styleEl);

			const transition = document.startViewTransition(() => {
				isEnlarged = !isEnlarged;

				// Force layout recalculation
				document.body.offsetHeight;

				if (!isEnlarged) {
					isDropdownOpen = false;
				}

				if (isEnlarged) {
					// Hide other elements when enlarging
					setTimeout(() => {
						otherProducts.forEach((product) => {
							product.style.opacity = '0';
							product.style.visibility = 'hidden';
						});

						if (footer) {
							footer.style.zIndex = '1';
							footer.style.opacity = '0';
							footer.style.visibility = 'hidden';
						}
					}, 100);
				} else {
					// When closing, start making elements visible DURING the transition
					otherProducts.forEach((product) => {
						product.style.visibility = 'visible';
						product.style.opacity = '0.3'; // Start with low opacity
					});

					if (footer) {
						footer.style.visibility = 'visible';
						footer.style.opacity = '0.3';
						footer.style.zIndex = '20';
					}
				}
			});

			// For the end of transition
			transition.finished.then(() => {
				// Clean up the added style
				document.head.removeChild(styleEl);

				if (!isEnlarged) {
					// When transition is done, make everything fully visible
					otherProducts.forEach((product) => {
						product.style.opacity = '1';
						product.style.transition = 'opacity 0.3s ease';
					});

					if (footer) {
						footer.style.opacity = '1';
					}
				}
			});
		} else {
			// Update fallback version with the same pattern
			isEnlarged = !isEnlarged;

			if (isEnlarged) {
				setTimeout(() => {
					document
						.querySelectorAll(
							`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
						)
						.forEach((product) => {
							product.style.opacity = '0';
							product.style.visibility = 'hidden';
						});

					const footer = document.querySelector('footer');
					if (footer) {
						footer.style.zIndex = '1';
						footer.style.opacity = '0';
						footer.style.visibility = 'hidden';
					}
				}, 200);
			} else {
				// Make elements visible immediately but with fading in
				const products = document.querySelectorAll('.product-card');
				const footer = document.querySelector('footer');

				products.forEach((product) => {
					product.style.visibility = 'visible';
					product.style.opacity = '0.3';
					product.style.transition = 'opacity 0.4s ease';
				});

				if (footer) {
					footer.style.visibility = 'visible';
					footer.style.opacity = '0.3';
					footer.style.zIndex = '20';
					footer.style.transition = 'opacity 0.4s ease';
				}

				// Then fade to full opacity
				setTimeout(() => {
					products.forEach((product) => {
						product.style.opacity = '1';
					});

					if (footer) {
						footer.style.opacity = '1';
					}
				}, 100);
			}
		}
	}

	function toggleDropdown(event) {
		event.stopPropagation();
		event.preventDefault();

		isDropdownOpen = !isDropdownOpen;
	}
</script>

<div
	class="product-card {isEnlarged ? 'enlarged' : ''}"
	style="view-transition-name: {context}-product-card-{id}"
	onclick={toggleEnlargement}
	onkeydown={(e) => e.key === 'Enter' && toggleEnlargement()}
	aria-label="View product details for {name}"
	role="button"
	tabindex="0"
>
	<div class="product-image">
		<img src={imageUrl} alt={name} class:zoomed-out={id === '2'} />

		{#if !inStock}
			<div class="out-of-stock">Out of Stock</div>
		{/if}
	</div>

	<div class="product-info">
		<div class="product-rating" class:expanded={isEnlarged}>
			{#each Array(5) as _, i}
				<span class="star {i < rating ? 'filled' : ''}">★</span>
			{/each}
		</div>

		<div class="product-line" class:expanded={isEnlarged}>
			<h3 class="product-name" class:expanded={isEnlarged}>{name}</h3>

			<p class="product-price" class:expanded={isEnlarged}>{formatPrice(price)}</p>
		</div>

		<p class="product-description" class:expanded={isEnlarged}>{@html description}</p>

		{#if isEnlarged}
			<div class="dropdown-container">
				<button
					class="dropdown-toggle"
					onclick={toggleDropdown}
					onkeydown={(e) => e.key === 'Enter' && toggleDropdown(e)}
					aria-expanded={isDropdownOpen}
					aria-controls="product-dropdown"
				>
					<span class="visually-hidden">View Details</span>
					<span class="arrow-icon">{isDropdownOpen ? '▲' : '▼'}</span>
				</button>

				{#if isDropdownOpen}
					<div class="dropdown-content" id="product-dropdown">
						<img src={actualDropdownImage} alt={name} class="dropdown-image" />
					</div>
				{/if}
			</div>
		{/if}

		<button
			class="add-to-cart-btn {isLoading ? 'loading' : ''}"
			onclick={addToCart}
			disabled={!inStock || isLoading}
			class:expanded={isEnlarged}
		>
			{#if isLoading}
				<span class="loading-text">Loading</span>
			{:else}
				{inStock ? 'Add to Cart' : 'Out of Stock'}
			{/if}
		</button>
	</div>
</div>

{#if isEnlarged}
	<button
		class="overlay"
		onclick={toggleEnlargement}
		onkeydown={(e) => e.key === 'Enter' && toggleEnlargement()}
		aria-label="Close enlarged view"
	></button>
{/if}

<style>
	.dropdown-container {
		width: 100%;
		margin: 0.75rem 0;
		grid-row: 4;
		position: relative;
		display: flex;
		justify-content: flex-end;
	}

	.dropdown-toggle {
		min-width: 20px;
		width: auto;
		padding: 0.5rem;
		background-color: var(--color-dark);
		color: white;
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: clamp(var(--sm), 1.25vw, var(--h6));
		font-weight: 500;
		transition: background-color 0.3s;
		z-index: 2;
		position: relative;

		&:hover {
			background-color: hsl(220, 10%, 25%);
		}
	}

	.arrow-icon {
		font-size: 0.75em;
		transition: transform 0.3s;
	}

	.dropdown-content {
		position: absolute;
		left: auto;
		right: 100%;
		max-width: 80vw;
		width: 600px;
		margin-left: 0;
		margin-right: 1rem;
		margin-top: 0;
		border-radius: var(--radius);
		overflow: hidden;
		animation: slideDown 0.3s ease forwards;
		z-index: 200;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
		background-color: white;
	}

	.dropdown-image {
		max-height: 600px;
		width: 100%;
		height: auto;
		display: block;
		border-radius: var(--radius);
		object-fit: contain;
	}

	.product-card {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			box-shadow 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1);
		width: 100%;
		height: auto;
		position: relative;
		cursor: pointer;
		z-index: 1;
		will-change: transform, opacity;
		transform: translateZ(0);
		background-color: hsl(0, 0%, 100%);

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		&.enlarged {
			position: fixed;
			top: 57%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 50%;
			max-width: 800px;
			height: 80vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			z-index: 999999;
			cursor: default;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
			animation: enlarge 1s cubic-bezier(0.25, 1, 0.5, 1) 0.1s forwards;
			padding-bottom: 0;
			-webkit-overflow-scrolling: touch;
			overscroll-behavior: contain;
		}

		&:not(.enlarged):hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		& .product-image {
			position: relative;
			height: 300px;
			overflow: hidden;

			.enlarged & {
				height: min(70vh, 400px);
				transition: height 0.8s cubic-bezier(0.25, 1, 0.5, 1);
			}

			& img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			& .out-of-stock {
				position: absolute;
				inset: 0;
				background-color: hsla(0, 0%, 100%, 0.3);
				backdrop-filter: blur(2px);
				color: var(--color-white);
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;
			}

			@media (max-width: 768px) {
				.enlarged & {
					height: 350px;
				}
			}

			@media (max-width: 480px) {
				.enlarged & {
					height: 200px;
				}
			}
		}

		& .product-info {
			display: grid;
			grid-template-rows: auto auto auto 1fr auto;
			gap: 0.05rem;
			padding: 1rem;

			.enlarged & {
				flex: 1;
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
				overscroll-behavior: contain;
				padding-bottom: 2rem;
				display: grid;
				grid-template-rows: auto auto auto 1fr auto;
			}

			.product-line {
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				grid-row: 1;

				&.expanded {
					grid-row: 2;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					width: 100%;
					margin: 0.5rem 0;
				}
			}

			& .product-name {
				margin: 0;
				color: var(--color-dark);
				font-family: var(--font-bold);
				font-size: clamp(var(--h5), 2vw, var(--h4));
				font-weight: 600;
				letter-spacing: 1px;
				text-align: center;

				&.expanded {
					font-size: clamp(var(--h5), 2vw, var(--h3));
				}
			}

			& .product-price {
				font-size: clamp(var(--sm), 1.5vw, var(--h4));
				font-weight: bold;
				color: var(--color-success);
				margin: 0.5rem 0;
				grid-row: 3;
				text-align: right;
				display: none;

				&.expanded {
					display: block;
				}
			}

			& .product-description {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.25vw, var(--h6));
				font-weight: 500;
				letter-spacing: 0;
				line-height: 1.25;
				color: var(--color-secondary);
				margin-bottom: 16px;
				display: -webkit-box;
				line-clamp: 3;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				grid-row: 4;
				transition: all 0.3s ease;
				display: none;

				&.expanded {
					line-clamp: initial;
					-webkit-line-clamp: initial;
					max-height: none;
					overflow: visible;
					padding-inline: 0.5rem;
					font-size: clamp(var(--sm), 1.5vw, var(--h5));
					display: block;
				}
			}

			& .product-rating {
				text-align: center;
				grid-row: 2;

				.enlarged & {
					grid-row: 1;
					margin-bottom: 0.5rem;
				}

				& .star {
					color: #ddd;
					font-size: clamp(var(--sm), 1.25vw, var(--h5));
					-webkit-text-stroke: 1px var(--color-secondary);

					&.filled {
						color: #ffc107;
					}
				}
			}

			& .add-to-cart-btn {
				width: 100%;
				padding: 0.7rem;
				background-color: var(--color-accent);
				color: var(--color-white);
				border: none;
				border-radius: var(--radius);
				cursor: pointer;
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				font-weight: bold;
				transition: background-color 0.3s;
				grid-row: 5;
				display: none;

				&.expanded {
					display: block;
				}

				&:hover:not([disabled]) {
					background-color: hsl(320, 75%, 56%);
				}

				&:disabled {
					background-color: var(--color-gray);
					cursor: not-allowed;
				}

				&.loading {
					background-color: var(--color-dark);
					position: relative;
					overflow: hidden;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 0;
						height: 2px;
						width: 100%;
						background: linear-gradient(to right, transparent, white, transparent);
						animation: loading-animation 1.5s infinite;
					}
				}

				& .loading-text::after {
					content: '';
					animation: loadingDots 1.5s infinite steps(4, jump-none);
				}
			}
		}
	}

	.overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999998;
	}

	.product-card.enlarged .product-image {
		flex-shrink: 0;
	}

	.product-image img.zoomed-out {
		object-fit: contain;
	}

	@media (width <= 768px) {
		.product-card.enlarged {
			width: 90%;
			top: 50%;
			height: 90vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			margin-top: 45px;
			transform: translate(-50%, -40%);
		}

		.product-card.enlarged .product-info {
			flex: 1;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
		}

		.product-card.enlarged .product-image {
			flex-shrink: 0;
			max-height: 200px;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		::view-transition-old(root),
		::view-transition-new(root) {
			animation-delay: 0.2s;
			animation-duration: 1.2s;
		}

		/* Target all view transitions for product cards */
		::view-transition-group(*) {
			animation-delay: 0.2s;
			animation-duration: 1.2s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Animation for overlay */
		.overlay {
			animation: fadeIn 0.5s ease 0.15s both; /* 0.15s delay */
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}

	@keyframes shrink {
		0% {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
	}

	@keyframes enlarge {
		0% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}

	@keyframes loading-animation {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@keyframes loadingDots {
		0% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75% {
			content: '...';
		}
		100% {
			content: '';
		}
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
