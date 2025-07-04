<script>
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import {
		formatPrice,
		trapFocus,
		createToggleDropdownHandler,
		createToggleEnlargementHandler
	} from './productFunctions.js';
	import ProductDropdown from './ProductDropdown.svelte';
	import { getCartData } from './CartStore.svelte';

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
		dropdown,
		dropdownImage,
		category,
		imageFit = 'cover',
		addToCart,
		style = ''
	} = $props();
	let isEnlarged = $state(false);
	let isLoading = $state(false);
	let isDropdownOpen = $state(false);
	let isDropdownOpened = $state(false);
	let isAddedToCart = $state(false);
	let isTransitioning = $state(false);
	let supportsViewTransitions = $state(false);
	let isFirefox = $state(false);
	let cart = $state([]);

	// initialization and state management
	$effect(() => {
		// Initialize browser detection (runs once on mount)
		if (browser && !supportsViewTransitions && !isFirefox) {
			supportsViewTransitions = browser && 'startViewTransition' in document;
			isFirefox = browser && navigator.userAgent.toLowerCase().includes('firefox');

			// Add a way to force Firefox mode for testing
			const urlParams = new URLSearchParams(window.location.search);
			const forceFirefoxMode = urlParams.get('firefox') === 'true';

			if (forceFirefoxMode) {
				isFirefox = true;
				supportsViewTransitions = false;
				console.log('🦊 Firefox mode forced for product', id);
			}

			// Debug logging
			console.log('Product browser detection:', {
				id,
				supportsViewTransitions,
				isFirefox,
				userAgent: browser ? navigator.userAgent : 'SSR'
			});
		}

		// Get cart data and update state
		const data = getCartData();
		cart = data.cart;
		isAddedToCart = cart.some((item) => item.id === id);
	});

	const useContainFit = imageFit === 'contain' || category === 'Bags' || category === 'Clothing';
	const dispatch = createEventDispatcher();
	// Product data for cart
	const productData = { id, name, price, imageUrl, productUrl, quantity: 1 };

	// Handle add to cart with proper state updates
	async function handleAddToCart(e) {
		e.stopPropagation();
		if (addToCart && !isLoading && !isAddedToCart) {
			isLoading = true;
			addToCart(productData);
			await new Promise((resolve) => setTimeout(resolve, 500));
			isLoading = false;
			isAddedToCart = true;
		}
	}

	const toggleDropdown = createToggleDropdownHandler({
		isDropdownOpen: (val) => (val !== undefined ? (isDropdownOpen = val) : isDropdownOpen),
		id: () => id
	});
	const toggleEnlargement = createToggleEnlargementHandler(
		{ id, context },
		{
			isEnlarged: (val) => {
				if (val !== undefined) {
					console.log('Toggling enlargement:', { val, isFirefox, supportsViewTransitions });

					// Set transitioning flag before changing state
					isTransitioning = true;

					isEnlarged = val;
					// When un-enlarging, always close the dropdown
					if (!val) {
						isDropdownOpen = false;
						isDropdownOpened = false;
					}

					// Clear transitioning flag after a delay to allow transition to complete
					setTimeout(
						() => {
							isTransitioning = false;

							// Ensure scroll is reset to top after transition completes
							if (isEnlarged) {
								const productInfo = document.querySelector('.product-card.enlarged .product-info');
								if (productInfo) {
									productInfo.scrollTop = 0;
								}
							}
						},
						isFirefox ? 300 : 750
					); // Shorter delay for Firefox
				}
				return isEnlarged;
			},
			isDropdownOpen: (val) => (val !== undefined ? (isDropdownOpen = val) : isDropdownOpen)
		}
	);

	function handleDropdownState(isOpen) {
		isDropdownOpened = isOpen;
		// Only handle visibility restoration when un-enlarging
		if (!isOpen && !isEnlarged) {
			// For Firefox and non-supporting browsers, select differently
			const otherProducts =
				isFirefox || !supportsViewTransitions
					? document.querySelectorAll(`.product-card:not(.product-id-${id})`)
					: document.querySelectorAll(
							`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
						);
			const footer = document.querySelector('footer');

			otherProducts.forEach((product) => {
				product.style.removeProperty('visibility');
				product.style.opacity = '1';
				product.style.transition = 'opacity 0.3s ease';
			});
			if (footer) {
				footer.style.removeProperty('visibility');
				footer.style.opacity = '1';
				footer.style.zIndex = '20';
			}
		}
	}

	// enlargement state management
	$effect(() => {
		// Don't run DOM manipulation effects during transitions to prevent flicker
		if (isTransitioning) {
			return;
		}

		if (isEnlarged) {
			// Add class to body to handle global z-index issues
			document.body.classList.add('product-enlarged');

			// Announce enlargement to screen readers
			const announcement = document.createElement('div');
			announcement.setAttribute('aria-live', 'polite');
			announcement.setAttribute('aria-atomic', 'true');
			announcement.className = 'visually-hidden';
			const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
			announcement.textContent = `Product details for ${name} expanded. ${cleanDescription}. Press Escape to close.`;
			document.body.appendChild(announcement);

			setTimeout(() => {
				if (document.body.contains(announcement)) {
					document.body.removeChild(announcement);
				}
			}, 1000);

			// Immediately force NavBar behind with JavaScript (optimized for speed)
			const navElements = document.querySelectorAll('nav, header, .navbar');
			for (let i = 0; i < navElements.length; i++) {
				const el = navElements[i];
				// On mobile, hide the navbar with visibility. On desktop, just grey it out.
				if (window.innerWidth <= 768) {
					el.style.cssText += ';visibility:hidden';
				} else {
					el.style.cssText += ';z-index:1;opacity:0.25';
				}
			}

			// Reset scroll immediately when enlarged
			const productInfo = document.querySelector('.product-card.enlarged .product-info');
			if (productInfo) {
				productInfo.scrollTop = 0;
				// Force immediate scroll to top with multiple methods
				productInfo.scrollTo(0, 0);
				productInfo.scrollTo({ top: 0, behavior: 'instant' });
			}

			// Focus handling with slight delay to ensure DOM is ready
			setTimeout(() => {
				const card = document.querySelector('.product-card.enlarged');
				if (card) {
					trapFocus(card);
					card.style.zIndex = '10';
				}

				// Extra backup to force NavBar behind (optimized for speed)
				const navElements = document.querySelectorAll('nav, header, .navbar');
				for (let i = 0; i < navElements.length; i++) {
					const el = navElements[i];
					// On mobile, hide the navbar with visibility. On desktop, just grey it out.
					if (window.innerWidth <= 768) {
						el.style.cssText += ';visibility:hidden';
					} else {
						el.style.cssText += ';z-index:1;opacity:0.45';
					}
				}

				// Delayed scroll reset to ensure content starts at top
				const productInfo = document.querySelector('.product-card.enlarged .product-info');
				if (productInfo) {
					productInfo.scrollTop = 0;
					productInfo.scrollTo(0, 0);
					productInfo.scrollTo({ top: 0, behavior: 'instant' });
				}
			}, 0);
		} else {
			// When un-enlarging, handle cleanup
			// Announce closing to screen readers
			if (document.body.classList.contains('product-enlarged')) {
				const announcement = document.createElement('div');
				announcement.setAttribute('aria-live', 'polite');
				announcement.setAttribute('aria-atomic', 'true');
				announcement.className = 'visually-hidden';
				announcement.textContent = `Product details closed. Returned to product grid.`;
				document.body.appendChild(announcement);

				setTimeout(() => {
					if (document.body.contains(announcement)) {
						document.body.removeChild(announcement);
					}
				}, 1000);
			}

			// Remove class when not enlarged
			document.body.classList.remove('product-enlarged');

			// Reset product card z-index FIRST
			const card = document.querySelector(`.product-card.product-id-${id}`);
			if (card) {
				card.style.removeProperty('z-index');
				card.style.removeProperty('position');
			}

			// Reset any enlarged cards
			const enlargedCard = document.querySelector('.product-card.enlarged');
			if (enlargedCard) {
				enlargedCard.style.removeProperty('z-index');
			}

			// Reset NavBar styles when not enlarged - smooth transition for mobile
			const navElements = document.querySelectorAll('nav, header, .navbar');
			navElements.forEach((el) => {
				el.style.removeProperty('z-index');
				el.style.removeProperty('opacity');
				el.style.removeProperty('visibility');
			});

			// Ensure visibility is restored for other products regardless of dropdown state
			const otherProducts =
				isFirefox || !supportsViewTransitions
					? document.querySelectorAll(`.product-card:not(.product-id-${id})`)
					: document.querySelectorAll(
							`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
						);
			const footer = document.querySelector('footer');

			otherProducts.forEach((product) => {
				product.style.removeProperty('visibility');
				product.style.opacity = '1';
				product.style.transition = 'opacity 0.3s ease';
			});
			if (footer) {
				footer.style.removeProperty('visibility');
				footer.style.opacity = '1';
				footer.style.zIndex = '20';
			}
		}
	});
</script>

<div
	class="product-card {isEnlarged ? 'enlarged' : ''} product-id-{id} {isFirefox
		? 'firefox-browser'
		: ''}"
	style="{style}{supportsViewTransitions && !isFirefox
		? `; view-transition-name: ${context}-product-card-${id}`
		: ''}"
	onclick={toggleEnlargement}
	onkeydown={(e) => {
		if (e.target === e.currentTarget) {
			if (e.key === 'Enter') toggleEnlargement();
			if (e.key === 'Escape' && isEnlarged) toggleEnlargement();
		}
	}}
	aria-label={isEnlarged
		? `${name} - ${description.replace(/<[^>]*>/g, '')}`
		: `View product details for ${name}`}
	aria-describedby={isEnlarged ? `product-description-${id}` : null}
	aria-expanded={isEnlarged}
	role="button"
	tabindex="0"
>
	<div class="product-image">
		<img
			src={imageUrl}
			alt={name}
			class:zoomed-out={useContainFit}
			style={supportsViewTransitions && !isFirefox
				? `view-transition-name: ${context}-product-image-${id}`
				: ''}
		/>
		{#if !inStock}
			<div class="out-of-stock">Out of Stock</div>
		{/if}
	</div>

	<div class="product-info">
		<div class="product-line" class:expanded={isEnlarged}>
			<h3
				class="product-name"
				class:expanded={isEnlarged}
				style={supportsViewTransitions && !isFirefox
					? `view-transition-name: ${context}-product-name-${id}`
					: ''}
			>
				{name}
			</h3>
			<p class="product-price" class:expanded={isEnlarged}>{formatPrice(price)}</p>
		</div>

		<p
			class="product-description"
			class:expanded={isEnlarged}
			id="product-description-{id}"
			aria-label="Product description: {description.replace(/<[^>]*>/g, '')}"
			role="region"
			aria-live={isEnlarged ? 'polite' : 'off'}
		>
			{@html description}
		</p>
		{#if isEnlarged}
			<ProductDropdown
				{id}
				{name}
				{isEnlarged}
				onClose={toggleEnlargement}
				onStateChange={handleDropdownState}
				dropdownImage={dropdown ?? dropdownImage}
			/>

			<button
				class="add-to-cart-btn {isLoading ? 'loading' : ''} {isAddedToCart ? 'added' : ''}"
				onclick={handleAddToCart}
				onkeydown={(e) => {
					e.stopPropagation();
					if (e.key === 'Escape' && isEnlarged) {
						toggleEnlargement();
					}
				}}
				disabled={!inStock || isLoading || isAddedToCart}
				class:expanded={isEnlarged}
				aria-live="polite"
			>
				{#if isLoading}
					<span class="loading-text">Loading</span>
				{:else if isAddedToCart}
					Added to Cart ✓
				{:else}
					{inStock ? 'Add to Cart' : 'Out of Stock'}
				{/if}
			</button>
		{/if}
	</div>
</div>

{#if isEnlarged}
	<button
		class="overlay {isFirefox ? 'firefox-overlay' : ''}"
		onclick={toggleEnlargement}
		onkeydown={(e) => e.key === 'Enter' && toggleEnlargement()}
		aria-label="Close enlarged view"
	></button>
{/if}

<style>
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
		margin-top: 1em;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		&.enlarged {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 50%;
			max-width: 800px;
			height: 80vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			z-index: 9;
			cursor: default;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
			background-color: hsl(0, 0%, 100%);
		}

		/* For browsers without view transition support, use fallback animation */
		@supports not (view-transition-name: none) {
			&.enlarged {
				animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			}
		}

		/* For browsers with view transition support, disable manual animation */
		@supports (view-transition-name: none) {
			&.enlarged {
				animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			}
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
				height: min(70vh, 310px);
				transition: height 0.8s cubic-bezier(0.25, 1, 0.5, 1);
				padding-top: 1.2rem;
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
			gap: 0.5rem;
			padding: 1rem;
			scroll-behavior: instant;

			.enlarged & {
				flex: 1;
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
				overscroll-behavior: contain;
				padding: 1rem;
				padding-bottom: 2rem;
				display: grid;
				grid-template-rows: auto auto auto 1fr auto;
				gap: 1rem;
				scroll-padding-top: 1rem;
				scroll-behavior: auto;
				scrollbar-gutter: stable;
			}

			.product-line {
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				grid-row: 1;
				margin-bottom: 0.5rem;

				&.expanded {
					grid-row: 1;
					margin: 0;
					padding-bottom: 0.25rem;
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
				margin-bottom: 1rem;
				display: -webkit-box;
				line-clamp: 3;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				grid-row: 3;
				transition: all 0.3s ease;
				display: none;
				margin-top: 0.5rem;

				&.expanded {
					line-clamp: initial;
					-webkit-line-clamp: initial;
					max-height: none;
					overflow: visible;
					padding-inline: 0.5rem;
					font-size: clamp(var(--sm), 1.5vw, var(--h5));
					display: block;
					padding-top: 0.25rem;
				}
			}

			& .add-to-cart-btn {
				width: 100%;
				min-height: 2.8rem;
				height: 2.8rem;
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
				line-height: 1;
				letter-spacing: 2px;
				margin-top: auto;

				&.expanded {
					display: flex;
					align-items: center;
					justify-content: center;
				}

				&:hover:not([disabled]) {
					background-color: hsl(320, 75%, 56%);
				}

				&:disabled {
					background-color: var(--color-gray);
					cursor: not-allowed;

					&.added {
						background-color: var(--color-dark);
						opacity: 0.9;
					}
				}

				&.loading {
					background-color: hsl(320, 75%, 45%);
					position: relative;
					overflow: hidden;

					& .loading-text {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100%;
						letter-spacing: 0.5px;
						position: relative;
					}

					& .loading-text::after {
						content: '';
						animation: loadingDots 1s steps(1, end) infinite;
						margin-left: 4px;
						min-width: 24px;
						text-align: left;
					}
					&.added {
						background-color: var(--color-dark);
						cursor: default;
					}
				}
			}
		}
	}
	.overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 8;
		cursor: pointer;
	}

	/* Firefox specific overlay fix */
	.firefox-browser + .overlay {
		z-index: 9998 !important;
		background-color: rgba(0, 0, 0, 0.5) !important;
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
			height: 90vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			top: 50%;
			transform: translate(-50%, -50%);
			margin: 0;
			z-index: 10;

			& .product-info {
				flex: 1;
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
			}

			& .product-image {
				flex-shrink: 0;
				max-height: 200px;
			}
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		@supports (view-transition-name: none) {
			::view-transition-old(root),
			::view-transition-new(root) {
				animation-delay: 0s;
				animation-duration: 0.75s;
			}

			/* Target specific product card view transitions */
			::view-transition-group(*product-card*) {
				animation-delay: 0s;
				animation-duration: 0.75s;
				animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
			}

			/* Target the old and new states of product card transitions */
			::view-transition-old(*product-card*),
			::view-transition-new(*product-card*) {
				animation-delay: 0s;
				animation-duration: 0.75s;
				animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
			}
		}

		/* Fallback animations for browsers without view transition support */
		@supports not (view-transition-name: none) {
			.product-card.enlarged {
				animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			}
		}

		/* Animation for overlay */
		.overlay {
			animation: fadeIn 0.5s ease 0.15s both;
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

	@supports (view-transition-name: none) {
		/* Product name view transition animations */
		::view-transition-old(*product-name*),
		::view-transition-new(*product-name*) {
			animation-duration: 1s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Smooth font size and layout changes */
		::view-transition-group(*product-name*) {
			animation-duration: 1s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Product image view transition animations */
		::view-transition-old(*product-image*),
		::view-transition-new(*product-image*) {
			animation-duration: 0.5s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Smooth image size and layout changes */
		::view-transition-group(*product-image*) {
			animation-duration: 0.5s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
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
		0%,
		100% {
			content: '';
		}
		15% {
			content: '.';
		}
		30% {
			content: '..';
		}
		45%,
		85% {
			content: '...';
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

	/* Specific styles for the mini menace product (id 1) */
	:global(.product-id-1 .dropdown-container .toggle-wrapper) {
		position: absolute;
		top: -1rem;
		right: 0;
		z-index: 2;
	}
	:global(.product-id-1 .dropdown-toggle) {
		position: absolute;
		z-index: 3;
	}

	/* Make sure the D. Harry product works too */
	:global(.product-id-2 .dropdown-container),
	:global(.product-id-2 .dropdown-toggle) {
		z-index: 2;
	}
	:global(::view-transition-group(*product-card*)) {
		z-index: 9;
	}

	/* Specific CSS for Firefox */
	.product-card.firefox-browser.enlarged {
		z-index: 9999 !important;
		background-color: white !important;
		position: fixed !important;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%) !important;
		animation: firefox-enlarge 0.3s ease forwards !important;
	}

	/* Specific CSS for Firefox and browsers without view transition support */
	@supports not (view-transition-name: none) {
		.product-card.enlarged {
			z-index: 999 !important;
			background-color: white !important;
			animation: fallback-enlarge 0.5s ease forwards !important;
		}

		.overlay {
			z-index: 998 !important;
		}
	}

	/* Additional fallback for body class targeting */
	:global(body.view-transitions-not-supported) .product-card.enlarged {
		z-index: 999 !important;
		background-color: white !important;
	}

	:global(body.view-transitions-not-supported) .overlay {
		z-index: 998 !important;
	}

	@keyframes firefox-enlarge {
		0% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}

	/* Screen reader only content */
	:global(.visually-hidden) {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
