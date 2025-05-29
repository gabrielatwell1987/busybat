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
				await new Promise((r) => setTimeout(r, 50)); // Give it a bit more time
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
		animation: none;
		transform: scale(1);
	}

	:root::view-transition-new(root) {
		animation: none;
		transform: scale(1);
	}

	@supports (-webkit-touch-callout: none) {
		:root::view-transition-old(root) {
			animation: var(--timing) cubic-bezier(0.4, 0, 1, 1) both out-safari;
			animation-delay: 0.5s;
		}

		:root::view-transition-new(root) {
			animation: var(--timing) cubic-bezier(0, 0, 0.2, 1) both in-safari;
			animation-delay: 0.5s;
		}
	}

	@keyframes in {
		from {
			opacity: 0.3;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes out {
		from {
			opacity: 1;
		}

		to {
			opacity: 0.3;
		}
	}

	@keyframes in-safari {
		from {
			opacity: 0.65;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes out-safari {
		from {
			opacity: 1;
		}

		to {
			opacity: 0.65;
		}
	}
</style>
