<script>
	let { title } = $props();
</script>

<div class="title-container">
	<h1>{title}</h1>
</div>

<style>
	.title-container {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;

		@media (width <= 500px) {
			position: absolute;
			right: 2rem;
			bottom: 1rem;
			top: auto;
			transform: none;
		}

		& h1 {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);
			font-family: var(--font-title);
			font-size: clamp(var(--h5), 4vw, var(--h1));
			text-align: center;
			text-wrap: nowrap;
			writing-mode: vertical-lr;
			margin-bottom: 3em;
			margin-right: 1rem;
			z-index: 5;

			@media (width <= 768px) {
				margin-bottom: 12em;
				margin-right: 0;
			}
		}
	}
</style>
