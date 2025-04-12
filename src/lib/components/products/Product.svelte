<script>
	import { createEventDispatcher } from 'svelte';
	import miniMenaceImg from '$lib/assets/dropdown/mini-menace-chain__open.webp';
	import dhSizeChart from '$lib/assets/dropdown/dh-size-chart.webp';
	import {
		formatPrice,
		trapFocus,
		createToggleDropdownHandler,
		createToggleEnlargementHandler
	} from './productFunctions.js';

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
		dropdownImage,
		category,
		imageFit = 'cover',
		addToCart
	} = $props();

	let isEnlarged = $state(false);
	let isLoading = $state(false);
	let isDropdownOpen = $state(false);

	const dropdownImages = {
		'1': miniMenaceImg,
		'2': dhSizeChart
	};
	const useContainFit = id === '2' || imageFit === 'contain' || category === 'Bags';

	const actualDropdownImage = dropdownImages[id] || dropdownImage;
	const dispatch = createEventDispatcher();

	// Product data for cart
	const productData = { id, name, price, imageUrl, productUrl, quantity: 1 };

	// Handle add to cart with proper state updates
	async function handleAddToCart(e) {
		e.stopPropagation();
		if (addToCart && !isLoading) {
			isLoading = true;
			addToCart(productData);
			await new Promise((resolve) => setTimeout(resolve, 500));
			isLoading = false;
		}
	}

	const toggleDropdown = createToggleDropdownHandler({
		isDropdownOpen: (val) => (val !== undefined ? (isDropdownOpen = val) : isDropdownOpen),
		id: () => id
	});

	const toggleEnlargement = createToggleEnlargementHandler(
		{ id, context },
		{
			isEnlarged: (val) => (val !== undefined ? (isEnlarged = val) : isEnlarged),
			isDropdownOpen: (val) => (val !== undefined ? (isDropdownOpen = val) : isDropdownOpen)
		}
	);

	$effect(() => {
		if (isEnlarged) {
			setTimeout(() => {
				const card = document.querySelector('.product-card.enlarged');
				if (card) trapFocus(card);
			}, 100);
		}
	});
</script>

<div
	class="product-card {isEnlarged ? 'enlarged' : ''}"
	style="view-transition-name: {context}-product-card-{id}"
	onclick={toggleEnlargement}
	onkeydown={(e) => {
		if (e.target === e.currentTarget) {
			if (e.key === 'Enter') toggleEnlargement();
			if (e.key === 'Escape' && isEnlarged) toggleEnlargement();
		}
	}}
	aria-label="View product details for {name}"
	role="button"
	tabindex="0"
>
	<div class="product-image">
		<img src={imageUrl} alt={name} class:zoomed-out={useContainFit} />
		{#if !inStock}
			<div class="out-of-stock">Out of Stock</div>
		{/if}
	</div>

	<div class="product-info">
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
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
							e.preventDefault();
							e.stopPropagation();
							toggleDropdown(e);
						} else if (e.key === 'Escape') {
							e.preventDefault();
							if (isDropdownOpen) {
								// First close the dropdown if it's open
								isDropdownOpen = false;
							} else {
								// If dropdown is closed, close the enlarged product
								toggleEnlargement();
							}
						}
					}}
					aria-expanded={isDropdownOpen}
					aria-controls="product-dropdown-{id}"
					aria-label="View additional product details"
				>
					<span class="visually-hidden">View Details</span>
					<span class="arrow-icon">{isDropdownOpen ? '▲' : '▼'}</span>
				</button>

				{#if isDropdownOpen}
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<div
						class="dropdown-content"
						id="product-dropdown-{id}"
						role="region"
						aria-label="Additional product details"
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Escape') {
								e.preventDefault();
								isDropdownOpen = false;
							}
						}}
					>
						<img src={actualDropdownImage} alt={name} class="dropdown-image" />
					</div>
				{/if}
			</div>

			<button
				class="add-to-cart-btn {isLoading ? 'loading' : ''}"
				onclick={handleAddToCart}
				onkeydown={(e) => {
					e.stopPropagation();
					if (e.key === 'Escape' && isEnlarged) {
						toggleEnlargement();
					}
				}}
				disabled={!inStock || isLoading}
				class:expanded={isEnlarged}
				aria-live="polite"
			>
				{#if isLoading}
					<span class="loading-text">Added!</span>
				{:else}
					{inStock ? 'Add to Cart' : 'Out of Stock'}
				{/if}
			</button>
		{/if}
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
				margin-bottom: 1rem;
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

			& .dropdown-container {
				width: 100%;
				margin: 0.75rem 0;
				grid-row: 4;
				position: relative;
				display: flex;
				justify-content: flex-end;
				align-items: flex-start;

				@media (max-width: 768px) {
					position: relative;
					z-index: 1000;
				}

				& .dropdown-toggle {
					width: 40px;
					height: 40px;
					padding: 0.5rem;
					background-color: var(--color-dark);
					color: white;
					border: none;
					border-radius: var(--radius);
					cursor: pointer;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: clamp(var(--sm), 1.25vw, var(--h6));
					font-weight: 500;
					transition: background-color 0.3s;
					z-index: 2;
					position: relative;
					aspect-ratio: 1 / 1;

					@media (max-width: 768px) {
						position: absolute;
						top: -2em;
						right: 5%;
						z-index: 1001;
						width: 30px;
						height: 35px;
						box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
					}

					&:focus-visible {
						outline: 3px solid var(--color-secondary);
						outline-offset: 2px;
						box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
					}

					&:hover {
						background-color: hsl(220, 10%, 25%);
					}

					& .arrow-icon {
						font-size: 1.5em;
						transition: transform 0.3s;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}

				& .dropdown-content {
					position: absolute;
					left: auto;
					right: 100%;
					max-width: 80vw;
					width: 600px;
					margin-left: 0;
					margin-right: 1rem;
					margin-top: 0;
					border-radius: var(--radius);
					animation: slideDown 0.3s ease forwards;
					z-index: 200;
					box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
					background-color: white;
					overflow: auto;
					max-height: 80vh;

					& .dropdown-image {
						max-height: none;
						width: 100%;
						height: auto;
						display: block;
						border-radius: var(--radius);
						object-fit: contain;
					}

					@media (max-width: 768px) {
						position: fixed;
						top: 15rem;
						left: 0;
						right: 0;
						bottom: auto;
						height: auto;
						margin-top: 0;
						margin-right: 0;
						max-height: 60vh;
						min-height: 200px;
						width: 100%;
						z-index: 500;
						background-color: var(--color-white);
						box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
						overflow: auto;

						& .dropdown-image {
							max-height: 70vh;
							width: auto;
							max-width: 100%;
							max-height: 60vh;
							height: auto;
							display: block;
							border-radius: var(--radius);
							object-fit: contain;
							margin-inline: auto;
						}
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
