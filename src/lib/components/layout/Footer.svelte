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

		& section {
			backdrop-filter: blur(1rem);
			border-radius: var(--radius);
			margin: 0;
			padding: 0;

			& p {
				color: var(--color-secondary);
				font-family: var(--font-regular);
				font-size: clamp(var(--xs), 1.2vw, var(--h5));
				font-weight: 700;
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
					display: flex;
					justify-content: center;
				}
			}
		}
	}
</style>
