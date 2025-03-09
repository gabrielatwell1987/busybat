<script>
	let { year, name } = $props();
</script>

<footer>
	<p><span>&copy;</span> {year} <span>{name}</span> Co. All rights reserved</p>
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
		max-width: calc(100% - 2rem);
		width: auto;

		& p {
			font-family: var(--font-semibold);
			color: var(--color-secondary);
			padding: 0 0.5rem;
			font-size: clamp(var(--xs), 1vw, var(--sm));
			font-weight: 400;
			text-wrap: nowrap;
			display: flex;
			justify-content: center;
			align-items: center;

			& span {
				margin-top: 0.215rem;

				&:nth-child(2) {
					color: var(--color-accent);
					padding-inline: 0.5rem;
					margin-top: 0;
				}
			}

			@media (max-width: 500px) {
				scale: 0.9;
			}
		}
	}
</style>
