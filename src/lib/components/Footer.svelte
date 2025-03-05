<script>
	let { year, name } = $props();
</script>

<footer>
	<p>&copy; {year} {name}.</p>
</footer>

<style>
	footer {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		padding: 1rem;
		background-color: transparent;
		margin: 0;
		border-radius: var(--radius);
		height: 3em;
		z-index: 20;

		& p {
			font-family: var(--font-semibold);
			color: var(--color-secondary);
			padding: 0 0.5rem;
			font-size: clamp(var(--sm), 2vw, var(--h4));
			font-weight: 400;
			text-wrap: nowrap;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
