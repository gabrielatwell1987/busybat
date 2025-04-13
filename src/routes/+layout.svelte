<script>
	import '../app.css';
	import ViewTransition from '$lib/data/ViewTransition.svelte';
	import Nav from '$lib/components/navigation/Nav.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import SkipToMain from '$lib/components/layout/SkipToMain.svelte';
	import LocalStorage from '$lib/components/layout/localStorage.svelte';

	let { children } = $props();
</script>

<LocalStorage />
<ViewTransition />
<SkipToMain />

<main>
	<Nav />

	<div class="slot" id="main-content">
		{@render children()}
	</div>

	<Footer year={new Date().getFullYear()} name="Busy Little Bat Sewing." />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		height: auto;
		min-height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	main {
		font-family: var(--font-regular);
		background-color: hsl(0, 0%, 100%);
		display: flex;
		flex-direction: column;
		flex: 1 0 auto;
		height: auto;
		padding-top: 5em;
	}

	.slot {
		flex: 1 0 auto;
		position: relative;
		margin-top: 2em;
		padding: 1em;
	}
</style>
