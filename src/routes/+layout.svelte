<script>
	import '../app.css';
	import Nav from '../lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ViewTransition from '$lib/components/ViewTransition.svelte';

	let { children } = $props();
</script>

<ViewTransition />

<main>
	<Nav />

	<div class="slot">
		{@render children()}
	</div>

	<Footer year={new Date().getFullYear()} name="Busy Little Bat Sewing Co." />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		height: auto !important;
		min-height: 100%;
		overflow-y: auto !important;
		display: flex;
		flex-direction: column;
	}

	main {
		font-family: var(--font-regular);
		background-color: hsl(0, 0%, 100%);
		display: flex;
		flex-direction: column;
		flex: 1 0 auto;
		height: auto !important;
		padding-top: 5em;
	}

	.slot {
		flex: 1 0 auto;
		position: relative;
		margin-top: 2em;
		padding: 1em;
	}
</style>
