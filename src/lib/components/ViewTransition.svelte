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
		animation: 0.75s cubic-bezier(0.37, 0.06, 0.6, 0.91) both out;
		animation-delay: 0.25s;
	}

	:root::view-transition-group(root) {
		animation: 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
</style>
