<script>
	import { onNavigate } from '$app/navigation';

	// view transition
	onNavigate(() => {
		console.log('Navigation triggered:', navigation.from, '→', navigation.to);

		if (!document.startViewTransition) {
			console.log('View Transitions API not supported');
			return;
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
		background-color: #000;
	}

	:root::view-transition-group(root) {
		animation: 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
</style>
