<script>
	let { title, url, onclick } = $props();
</script>

<li class="quick-flip">
	<a href={url} {onclick}>{title}</a>
</li>

<style>
	.quick-flip {
		--transition-duration: 0.4s;
		--timing-function: cubic-bezier(0.66, 0, 0.34, 1);
		overflow-y: clip;
		list-style: none;

		> * {
			display: block;
			transition:
				transform var(--transition-duration) var(--timing-function),
				translate 0ms calc(var(--transition-duration) / 2);
			text-decoration: none;
			color: var(--color-secondary);
			font-family: var(--font-bold);
			font-size: clamp(var(--h5), 2.5vw, var(--h3));
			font-weight: 900;
			letter-spacing: 3px;
		}

		&:is(:hover, :focus-within) > * {
			transform: translateY(-2lh);
			translate: 0 2lh;
			color: var(--color-accent);
			transition: color var(--transition-duration) var(--timing-function);
			-webkit-text-stroke: 1px var(--color-secondary);
		}

		&:focus-within {
			outline: 2px solid var(--teal);
			border-radius: 4px;

			> *:focus {
				outline: none;
			}
		}
	}

	@media (width <= 500px) {
		.quick-flip > * {
			letter-spacing: 5px;
		}

		.quick-flip:is(:hover, :focus-within) > * {
			border-bottom: none;
			transform: none;
			translate: 0;
			color: var(--color-accent);
			-webkit-text-stroke: 0px var(--color-secondary);
		}
	}
</style>
