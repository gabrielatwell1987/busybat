<script>
	import { onNavigate } from '$app/navigation';
	import { browser } from '$app/environment';

	// view transition
	onNavigate((navigation) => {
		if (!browser || !document.startViewTransition) {
			console.log('View transitions not supported');
			return;
		}

		console.log(`Navigation: ${navigation.from} → ${navigation.to}`);
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await new Promise((r) => setTimeout(r, 300)); // Longer duration for crossfade
			});

			transition.finished.catch((e) => {
				console.error('Transition failed:', e);
			});
		});
	});
</script>

<style>
	:root {
		view-transition-name: root;
	}
	:root::view-transition-old(root) {
		animation: 0.7s cubic-bezier(0.4, 0, 1, 1) both crossfade-out;
	}

	:root::view-transition-new(root) {
		animation: 0.4s cubic-bezier(0, 0, 0.2, 1) both crossfade-in;
	}
	@supports (-webkit-touch-callout: none) {
		:root::view-transition-old(root) {
			animation: 1s cubic-bezier(0.4, 0, 1, 1) both crossfade-out-safari;
		}

		:root::view-transition-new(root) {
			animation: 1.2s cubic-bezier(0, 0, 0.2, 1) both crossfade-in-safari;
		}
	}
	@keyframes crossfade-out {
		from {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
		to {
			opacity: 0;
			transform: scale(0.95) translateX(-10px);
		}
	}

	@keyframes crossfade-in {
		from {
			opacity: 0;
			transform: scale(1.09) translateX(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
	}

	@keyframes crossfade-out-safari {
		from {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
		to {
			opacity: 0.3;
			transform: scale(0.98) translateX(-8px);
		}
	}

	@keyframes crossfade-in-safari {
		from {
			opacity: 0.3;
			transform: scale(1.02) translateX(8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
	}
</style>
