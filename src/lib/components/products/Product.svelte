<script>
	import { browser } from '$app/environment';
	import {
		createToggleDropdownHandler,
		createToggleEnlargementHandler,
		trapFocus
	} from './productFunctions.js';
	import ProductDropdown from './ProductDropdown.svelte';
	import ProductImage from './ProductImage.svelte';
	import ProductInfo from './ProductInfo.svelte';
	import ProductActions from './ProductActions.svelte';
	import ProductOverlay from './ProductOverlay.svelte';
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

	// State variables
	let isEnlarged = $state(false);
	let isLoading = $state(false);
	let isDropdownOpen = $state(false);
	let isDropdownOpened = $state(false);
	let isAddedToCart = $state(false);
	let isTransitioning = $state(false);
	let supportsViewTransitions = $state(false);
	let isFirefox = $state(false);
	let cart = $state([]);
	let selectedSize = $state('');

	// Product data for cart - make it reactive to include selected size
	let productData = $derived({
		id,
		name,
		price,
		imageUrl,
		productUrl,
		quantity: 1,
		...(selectedSize && { size: selectedSize })
	});

	// Handle add to cart with proper state updates
	async function handleAddToCart(e) {
		e.stopPropagation();

		// Check if this product has size options and no size is selected
		if (browser && id === '3') {
			const productCard = document.querySelector(`.product-card.product-id-${id}`);
			const selectElements = productCard?.querySelectorAll('select');
			if (selectElements?.length > 0 && !selectedSize) {
				alert('Please select a size before adding to cart.');
				return;
			}
		}

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

					isTransitioning = true;
					isEnlarged = val;

					if (!val) {
						isDropdownOpen = false;
						isDropdownOpened = false;
					}

					setTimeout(
						() => {
							isTransitioning = false;
							if (isEnlarged) {
								const productInfo = document.querySelector('.product-card.enlarged .product-info');
								if (productInfo) {
									productInfo.scrollTop = 0;
								}
							}
						},
						isFirefox ? 300 : 750
					);
				}
				return isEnlarged;
			},
			isDropdownOpen: (val) => (val !== undefined ? (isDropdownOpen = val) : isDropdownOpen)
		}
	);

	function handleDropdownState(isOpen) {
		isDropdownOpened = isOpen;
		if (!isOpen && !isEnlarged) {
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

	function handleSelectClick(e) {
		e.stopPropagation();
	}

	function handleSizeChange(e) {
		selectedSize = e.target.value;
		console.log('Size selected:', selectedSize);

		if (browser) {
			const data = getCartData();
			cart = data.cart;
			isAddedToCart = cart.some((item) => {
				if (selectedSize) {
					return item.id === id && item.size === selectedSize;
				}
				return item.id === id && !item.size;
			});
		}
	}

	function cleanupSelectListeners() {
		if (browser) {
			const productCard = document.querySelector(`.product-card.product-id-${id}`);
			if (productCard) {
				const selectElements = productCard.querySelectorAll('select');
				selectElements.forEach((select) => {
					select.removeEventListener('click', handleSelectClick);
					select.removeEventListener('mousedown', handleSelectClick);
					select.removeEventListener('change', handleSizeChange);
				});
			}
		}
	}

	// Browser detection and cart state management
	$effect(() => {
		// Edge browser check for Android
		const ua = navigator.userAgent.toLowerCase();
		const isEdgeMobile = ua.includes('edg/') && ua.includes('android');
		if (isEdgeMobile) {
			supportsViewTransitions = false;
			console.log('Edge Android detected, disabling view transitions for product', id);
		}

		// firefox
		if (browser && !supportsViewTransitions && !isFirefox) {
			supportsViewTransitions = browser && 'startViewTransition' in document;
			isFirefox = browser && navigator.userAgent.toLowerCase().includes('firefox');

			const urlParams = new URLSearchParams(window.location.search);
			const forceFirefoxMode = urlParams.get('firefox') === 'true';

			if (forceFirefoxMode) {
				isFirefox = true;
				supportsViewTransitions = false;
				console.log('🦊 Firefox mode forced for product', id);
			}

			console.log('Product browser detection:', {
				id,
				supportsViewTransitions,
				isFirefox,
				userAgent: browser ? navigator.userAgent : 'SSR'
			});
		}

		const data = getCartData();
		cart = data.cart;
		isAddedToCart = cart.some((item) => {
			if (selectedSize) {
				return item.id === id && item.size === selectedSize;
			}
			return item.id === id && !item.size;
		});
	});

	// Enlargement state management
	$effect(() => {
		if (isTransitioning) return;

		if (isEnlarged) {
			document.body.classList.add('product-enlarged');

			// Screen reader announcement
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

			// Handle navigation elements
			const navElements = document.querySelectorAll('nav, header, .navbar');
			for (let i = 0; i < navElements.length; i++) {
				const el = navElements[i];
				if (window.innerWidth <= 768) {
					el.style.cssText += ';visibility:hidden';
				} else {
					el.style.cssText += ';z-index:1;opacity:0.25';
				}
			}

			// Immediately reset scroll when enlarged
			const productInfo = document.querySelector('.product-card.enlarged .product-info');
			if (productInfo) {
				productInfo.scrollTop = 0;
				productInfo.scrollTo(0, 0);
				productInfo.scrollTo({ top: 0, behavior: 'instant' });
			}

			// Handle select elements and scroll to top
			setTimeout(() => {
				const card = document.querySelector('.product-card.enlarged');
				if (card) {
					trapFocus(card);
					card.style.zIndex = '10';
				}

				// Force scroll to top of the product info content
				const productInfo = document.querySelector('.product-card.enlarged .product-info');
				if (productInfo) {
					productInfo.scrollTop = 0;
					productInfo.scrollTo(0, 0);
					productInfo.scrollTo({ top: 0, behavior: 'instant' });
				}

				if (browser) {
					const productCard = document.querySelector(`.product-card.product-id-${id}`);
					if (productCard) {
						const selectElements = productCard.querySelectorAll('select');
						selectElements.forEach((select) => {
							select.removeEventListener('click', handleSelectClick);
							select.removeEventListener('mousedown', handleSelectClick);
							select.removeEventListener('change', handleSizeChange);

							select.addEventListener('click', handleSelectClick);
							select.addEventListener('mousedown', handleSelectClick);
							select.addEventListener('change', handleSizeChange);

							if (select.value) {
								selectedSize = select.value;
							}
						});

						const data = getCartData();
						cart = data.cart;
						isAddedToCart = cart.some((item) => {
							if (selectedSize) {
								return item.id === id && item.size === selectedSize;
							}
							return item.id === id && !item.size;
						});
					}
				}

				// Additional delayed scroll reset to ensure content starts at top
				setTimeout(() => {
					const productInfo = document.querySelector('.product-card.enlarged .product-info');
					if (productInfo) {
						productInfo.scrollTop = 0;
						productInfo.scrollTo(0, 0);
						productInfo.scrollTo({ top: 0, behavior: 'instant' });
					}
				}, 100);
			}, 0);
		} else {
			cleanupSelectListeners();

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

			document.body.classList.remove('product-enlarged');

			const card = document.querySelector(`.product-card.product-id-${id}`);
			if (card) {
				card.style.removeProperty('z-index');
				card.style.removeProperty('position');
			}

			const enlargedCard = document.querySelector('.product-card.enlarged');
			if (enlargedCard) {
				enlargedCard.style.removeProperty('z-index');
			}

			const navElements = document.querySelectorAll('nav, header, .navbar');
			navElements.forEach((el) => {
				el.style.removeProperty('z-index');
				el.style.removeProperty('opacity');
				el.style.removeProperty('visibility');
			});

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
	<ProductImage
		{imageUrl}
		{name}
		{inStock}
		{context}
		{id}
		{imageFit}
		{category}
		{supportsViewTransitions}
		{isFirefox}
	/>

	<div class="product-info">
		<ProductInfo
			{name}
			{price}
			{description}
			{id}
			{isEnlarged}
			{context}
			{supportsViewTransitions}
			{isFirefox}
		/>

		{#if isEnlarged}
			<ProductDropdown
				{id}
				{name}
				{isEnlarged}
				onClose={toggleEnlargement}
				onStateChange={handleDropdownState}
				dropdownImage={dropdown ?? dropdownImage}
			/>

			<ProductActions
				{inStock}
				{isLoading}
				{isAddedToCart}
				{isEnlarged}
				onAddToCart={handleAddToCart}
				onToggleEnlargement={toggleEnlargement}
			/>
		{/if}
	</div>
</div>

<ProductOverlay {isEnlarged} {isFirefox} onToggleEnlargement={toggleEnlargement} />

<style>
	/* For browsers without view transition support, use fallback animation */
	@supports not (view-transition-name: none) {
		.product-card.enlarged {
			animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			z-index: 999 !important;
			background-color: white !important;
		}
	}

	/* For browsers with view transition support */
	@supports (view-transition-name: none) {
		.product-card.enlarged {
			animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
		}

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

	/* Enhanced animations for view transition supporting browsers with motion preference */
	@supports (view-transition-name: none) {
		@media (prefers-reduced-motion: no-preference) {
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
	}

	/* Fallback animations for browsers without view transition support but with motion preference */
	@supports not (view-transition-name: none) {
		@media (prefers-reduced-motion: no-preference) {
			.product-card.enlarged {
				animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			}
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

	/* Additional fallback for body class targeting */
	:global(body.view-transitions-not-supported) .product-card.enlarged {
		z-index: 999 !important;
		background-color: white !important;
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

		&:not(.enlarged):hover {
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

			@media (width <= 768px) {
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

				& :global(.product-image) {
					flex-shrink: 0;
					max-height: 200px;
				}
			}
		}

		&.firefox-browser.enlarged {
			z-index: 9999 !important;
			background-color: white !important;
			position: fixed !important;
			top: 50% !important;
			left: 50% !important;
			transform: translate(-50%, -50%) !important;
			animation: firefox-enlarge 0.3s ease forwards !important;
		}
	}

	.product-card.enlarged :global(.product-image) {
		flex-shrink: 0;
	}

	.product-info {
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
</style>
