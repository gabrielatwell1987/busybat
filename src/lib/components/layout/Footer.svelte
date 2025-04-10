<script>
	let { year = new Date().getFullYear(), name } = $props();
</script>

<footer>
	<section>
		<p>
			&copy;
			{year}

			{name} All rights reserved
		</p>
	</section>
</footer>

<style>
	footer {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: transparent;
		margin: 0;
		padding: 0;
		line-height: 1;
		border-radius: var(--radius);
		z-index: 10;
		max-width: calc(100% - 2rem);
		width: fit-content;
		box-shadow: 0 0 5px var(--color-accent);

		& section {
			backdrop-filter: blur(1rem);
			border-radius: var(--radius);
			margin: 0;
			padding: 0;

			& p {
				background-color: var(--color-accent);
				color: var(--color-secondary);
				font-family: var(--font-regular);
				font-size: clamp(var(--xs), 1.2vw, var(--h5));
				font-weight: 700;
				letter-spacing: 1px;
				text-wrap: nowrap;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				margin: 0;
				padding: 0.15em 0.5em;
				line-height: 1;

				@media (max-width: 500px) {
					--font-scale: 0.85;
					scale: 0.85;
				}
			}
		}
	}
</style>
