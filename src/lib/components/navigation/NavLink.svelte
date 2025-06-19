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
		margin: 0;
		padding: 0;

		> * {
			display: block;
			text-decoration: none;
			color: var(--color-secondary);
			font-family: var(--font-bold);
			font-size: clamp(var(--sm), 1.25vw, var(--h4));
			font-weight: 900;
			letter-spacing: 1px;
			margin: 0;
			margin-right: clamp(0.25rem, 1vw, 0.5rem);
			padding: 0;
			white-space: nowrap;
			text-align: center;

			@media (600px <= width <= 768px) {
				font-size: clamp(var(--sm), 2.5vw, var(--h5));
			}

			@media (width >= 501px) {
				transition:
					transform var(--transition-duration) var(--timing-function),
					translate 0ms calc(var(--transition-duration) / 2),
					color 0.3s ease;
			}

			@media (width <= 500px) {
				font-size: var(--h5);
			}
		}

		&:is(:hover, :focus-within) > * {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);

			@media (min-width: 501px) {
				transform: translateY(-2lh);
				translate: 0 2lh;
			}
		}

		&:focus-within {
			outline: 2px solid var(--teal);
			border-radius: 4px;

			> *:focus {
				outline: none;
			}
		}
	}
</style>
