<script>
	let { year, name } = $props();
</script>

<footer>
	<p>
		&copy;
		{year}
		{name}
		All rights reserved
	</p>
</footer>

<style>
	footer {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		padding: 1rem;
		background-color: transparent;
		margin: 0;
		border-radius: var(--radius);
		height: 3em;
		z-index: 20;
		max-width: calc(100% - 2rem);
		width: fit-content;

		& p {
			font-family: var(--font-semibold);
			color: var(--color-secondary);
			padding: 0 0.5rem;
			font-size: clamp(var(--sm), 1.2vw, var(--h5));
			font-weight: 100;
			text-wrap: nowrap;
			display: flex;
			justify-content: center;
			align-items: center;

			@media (max-width: 500px) {
				scale: 0.8;
			}
		}
	}
</style>
