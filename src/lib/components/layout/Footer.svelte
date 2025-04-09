<script>
	let { year = new Date().getFullYear(), name } = $props();
</script>

<footer>
	<section>
		<p>
			<span>
				<span class="copyright">&copy;</span>
				{year}
			</span>
			{name}. All rights reserved
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
		border-radius: var(--radius);
		height: 3em;
		z-index: 10;
		max-width: calc(100% - 2rem);
		width: fit-content;

		& section {
			backdrop-filter: blur(1rem);
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
					display: flex;
					align-items: center;

					& .copyright {
						display: inline-flex;
						align-items: center;
						justify-content: center;
						line-height: 1;
						padding-right: 2px;
						position: relative;
						top: calc(0.15em * var(--font-scale, 1));
						font-size: clamp(var(--h5), 1.2vw, var(--h4));
					}
				}

				@media (max-width: 500px) {
					--font-scale: 0.85;
					scale: 0.85;
				}
			}
		}
	}
</style>
