<script>
	let { title, href } = $props();
</script>

<a {href}>
	<button type="submit">{title}</button>
</a>

<style>
	a {
		text-decoration: none;
		display: flex;
		justify-content: center;
		align-items: center;

		& button {
			font-family: var(--font-semibold);
			font-size: clamp(var(--h6), 2vw, var(--h3));
			padding: 0.5rem 1rem;
			background-color: var(--color-accent);
			color: var(--color-primary);
			border: none;
			border-radius: var(--radius);
			cursor: pointer;
			width: 25%;
			margin-inline: auto;
			width: fit-content;

			&:hover {
				background: linear-gradient(
					70deg,
					var(--color-accent),
					var(--color-secondary),
					var(--color-accent)
				);
				background-size: 200% 100%;
				box-shadow: 0 0 5px var(--color-accent);
				animation: gradientFlow 3s ease infinite;
			}

			@media (width <= 500px) {
				font-size: clamp(var(--sm), 2vw, var(--h4));
			}
		}
	}

	@keyframes gradientFlow {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
