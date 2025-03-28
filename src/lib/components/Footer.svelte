<script>
	let { year, name } = $props();
</script>

<footer>
	<section>
		<p>
			<span>
				&copy;
				{year}
				{name}
				All rights reserved</span
			>
		</p>
	</section>
</footer>

<style>
	footer {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		/* padding: 1rem; */
		background-color: transparent;
		margin: 0;
		border-radius: var(--radius);
		height: 3em;
		z-index: 10;
		max-width: calc(100% - 2rem);
		width: fit-content;

		& section {
			backdrop-filter: blur(1rem);
			/* padding-inline: 1rem; */
			border-radius: var(--radius);

			& p {
				font-family: var(--font-regular);
				font-size: clamp(var(--xs), 1.2vw, var(--h5));
				letter-spacing: 1px;
				color: var(--color-secondary);
				text-wrap: nowrap;
				display: flex;
				justify-content: center;
				align-items: center;

				& span {
					background-color: var(--color-light);
					padding: 0 0.25rem;
					border-radius: var(--radius);
				}

				@media (max-width: 500px) {
					scale: 0.85;
				}
			}
		}
	}
</style>
