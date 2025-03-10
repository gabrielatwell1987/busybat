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

	:root::view-transition-group(root) {
		animation: 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
</style>
