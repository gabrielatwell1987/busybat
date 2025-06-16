<script>
	let { title } = $props();
</script>

<a href="/">
	<h1>{title}</h1>
</a>

<style>
	a {
		text-decoration: none;
		height: auto;

		& h1 {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);
			font-family: var(--font-title);
			font-size: clamp(var(--h5), 3vw, var(--lg));
			text-align: center;
			text-wrap: nowrap;
			margin: 0;
			letter-spacing: -1px;
		}
	}
</style>
