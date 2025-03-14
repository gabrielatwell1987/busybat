<script>
	import { onNavigate } from '$app/navigation';

	// view transition
	onNavigate((navigation) => {
		console.log('Navigation triggered:', navigation.from, '→', navigation.to);

		if (!document.startViewTransition) {
			console.log('View Transitions API not supported');
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			console.log('Starting view transition');

			document.startViewTransition(async () => {
				resolve();
				console.log('View transition completed');
			});
		});
	});
</script>

<style>
	:root {
		background-color: hsl(0, 0%, 100%);
	}

<<<<<<< HEAD
	:root::view-transition-old(root) {
		animation: 0.75s cubic-bezier(0.37, 0.06, 0.6, 0.91) both out;
		animation-delay: 0.5s;
	}

	:root::view-transition-new(root) {
		animation: 0.75s cubic-bezier(0.37, 0.06, 0.6, 0.91) 1s both in;
		animation-delay: 0.5s;
	}

	@supports (-webkit-touch-callout: none) {
		:root::view-transition-old(root) {
			animation: 0.75s cubic-bezier(0.4, 0, 1, 1) both out-safari;
			animation-delay: 0.5s;
		}

		:root::view-transition-new(root) {
			animation: 0.75s cubic-bezier(0, 0, 0.2, 1) both in-safari;
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
=======
	:root::view-transition-group(root) {
		animation: 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
>>>>>>> parent of 2d7be53 (finally fixed the view transitions for mobile)
	}
</style>
