import { browser } from '$app/environment';

// Format price with currency
export function formatPrice(value) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(value);
}

// Handle focus trapping for accessibility
export function trapFocus(element) {
	const focusableElements = element.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);

	if (focusableElements.length === 0) return;

	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	// Set initial focus
	firstElement.focus();

	// Handle tab navigation
	element.addEventListener('keydown', (e) => {
		if (e.key === 'Tab') {
			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		}
	});
}

// Factory function for adding to cart
// export function createAddToCartHandler(productData, setState, dispatch) {
// 	return function addToCart(event) {
// 		// Prevent bubbling
// 		event.stopPropagation();
// 		event.preventDefault();

// 		const { id, name, price, imageUrl, productUrl } = productData;

// 		if (setState.isLoading) return;
// 		setState.isLoading(true);

// 		console.log('Opening URL:', productUrl);

// 		if (productUrl) {
// 			// Wait before opening URL
// 			setTimeout(() => {
// 				const newWindow = window.open(productUrl, '_blank');

// 				if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
// 					window.location.href = productUrl;
// 				}

// 				setState.isLoading(false);
// 			}, 1000);
// 		} else {
// 			// If no URL, reset loading state immediately
// 			setTimeout(() => {
// 				setState.isLoading(false);
// 			}, 750);
// 		}

// 		// Dispatch a custom event that parent components can listen to
// 		dispatch('addtocart', { id, name, price, imageUrl, quantity: 1 });
// 	};
// }

// Factory function for dropdown toggle
export function createToggleDropdownHandler(setState) {
	return function toggleDropdown(event) {
		event.stopPropagation();
		event.preventDefault();

		setState.isDropdownOpen(!setState.isDropdownOpen());

		if (setState.isDropdownOpen()) {
			setTimeout(() => {
				const announcement = document.getElementById(`product-dropdown-${setState.id()}`);
				if (announcement) announcement.setAttribute('aria-live', 'polite');
			}, 100);
		}
	};
}

// Factory function for enlargement toggle
export function createToggleEnlargementHandler(contextData, setState) {
	return function toggleEnlargement() {
		const { id, context } = contextData;

		if (browser && document.startViewTransition) {
			// Prepare elements before transition
			const otherProducts = document.querySelectorAll(
				`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
			);
			const footer = document.querySelector('footer');

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
				setState.isEnlarged(!setState.isEnlarged());

				// Force layout recalculation
				document.body.offsetHeight;

				// Reset dropdown state when closing
				if (!setState.isEnlarged()) {
					setState.isDropdownOpen(false);
				}

				if (setState.isEnlarged()) {
					// Reset scroll position to top when enlarged
					setTimeout(() => {
						const productInfo = document.querySelector('.product-card.enlarged .product-info');
						if (productInfo) {
							productInfo.scrollTo({ top: 0, behavior: 'instant' });
							productInfo.scrollTop = 0;
						}

						// Hide other elements when enlarging
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

					// Try again after a slightly longer delay to ensure it works
					setTimeout(() => {
						const productInfo = document.querySelector('.product-card.enlarged .product-info');
						if (productInfo) {
							productInfo.scrollTo({ top: 0, behavior: 'instant' });
							productInfo.scrollTop = 0;
						}
					}, 300);
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

				if (setState.isEnlarged()) {
					// Final attempt to reset scroll after transition completes
					const productInfo = document.querySelector('.product-card.enlarged .product-info');
					if (productInfo) {
						productInfo.scrollTo({ top: 0, behavior: 'instant' });
						productInfo.scrollTop = 0;
					}
				}

				if (!setState.isEnlarged()) {
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
			// Fallback for browsers without View Transitions API
			setState.isEnlarged(!setState.isEnlarged());

			if (setState.isEnlarged()) {
				setTimeout(() => {
					// Reset scroll position in fallback mode
					const productInfo = document.querySelector('.product-card.enlarged .product-info');
					if (productInfo) {
						productInfo.scrollTop = 0;
					}

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
	};
}
