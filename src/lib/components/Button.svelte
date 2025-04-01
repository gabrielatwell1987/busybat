<!-- <script>
	import { goto } from '$app/navigation';

	let { title, href } = $props();

	function handleClick(e) {
		e.preventDefault();

		goto(href);
	}
</script>

<a {href} class="button">
	{title}
</a>

<style>
	a.button {
		font-family: var(--font-semibold);
		font-size: clamp(var(--h6), 2vw, var(--h3));
		padding: 0.5rem 1rem;
		background-color: var(--color-accent);
		color: var(--color-primary);
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		width: fit-content;
		text-decoration: none;
		display: inline-block;
		text-align: center;
		position: relative;
		z-index: 50;

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

 -->

<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let { title, href } = $props();

	function handleClick() {
		if (browser) {
			window.location.href = href;
		}
	}
</script>

<button class="button" onclick={handleClick} ontouchstart={handleClick} ontouchend={() => {}}>
	{title}
</button>

<style>
	.button {
		font-family: var(--font-title);
		font-size: clamp(var(--h5), 5vw, var(--h2));
		letter-spacing: 1px;
		padding: 0.5rem 1rem;
		background-color: var(--color-accent);
		color: var(--color-primary);
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		width: fit-content;
		text-decoration: none;
		display: inline-block;
		text-align: center;
		z-index: 999;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;

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
			font-size: clamp(var(--h5), 2vw, var(--h4));
			padding: 0.75rem 1.25rem; /* Larger touch target on mobile */
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
