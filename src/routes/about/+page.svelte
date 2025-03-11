<script>
	import Icon from '$lib/components/Icon.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
	import bg from '$lib/assets/product-bg.webp';
</script>

<main
	style="background-image: url({bg}); background-repeat: repeat; background-position: center center; background-size: contain;"
>
	<VerticalTitle title="About" />

	<Icon />

	<div class="content">
		<h2>About page</h2>

		<h5>All about you</h5>

		<div class="summary">
			<p>this is your about page..</p>

			<p class="width">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum laborum eveniet, explicabo
				ullam quasi velit consectetur illum officiis, nulla commodi animi placeat sunt doloremque
				dicta qui vel dolore molestiae ratione totam, quos facilis dignissimos. Impedit numquam enim
				ratione minus nesciunt voluptatibus saepe eum, laudantium error mollitia eaque assumenda
				alias vitae.
			</p>
		</div>
	</div>
</main>

<style>
	main {
		height: auto;

		& .content {
			text-align: center;
			display: grid;
			place-items: center;
			margin-bottom: 5em;

			& h2 {
				font-family: var(--font-title);
				font-size: clamp(var(--h4), 5vw, var(--lg));
				font-weight: 700;
				letter-spacing: 5px;
				margin: 0;
				padding: 0;
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-secondary);
			}

			& h5 {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.5vw, var(--h6));
				font-weight: 300;
				font-style: italic;
				margin: 0;
				padding: 0;
			}

			& .summary {
				margin-top: 1em;
				font-weight: 700;

				& p {
					margin-bottom: 0.15rem;
					padding: 0;
					font-size: clamp(var(--sm), 2vw, var(--h6));
					line-height: 1.5;

					&.width {
						width: 75%;
						margin-inline: auto;
					}
				}
			}
		}
	}
</style>
