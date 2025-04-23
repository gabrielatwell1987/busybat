<script>
	let { text, title, src, alt } = $props();
</script>

<div class="inverted-border">
	<div class="content">
		<h2>{title}</h2>

		<p>{text}</p>
	</div>

	<img {src} {alt} />
</div>

<style>
	.inverted-border {
		position: relative;
		width: 80vw;
		height: auto;
		background-color: var(--color-secondary);
		padding: 0.75rem 1rem;
		margin-inline: auto;
		display: grid;
		align-items: center;
		mask: radial-gradient(20px at 40px 40px, transparent 98%, black) -40px -40px;
		grid-template-areas:
			'title img'
			'text img'
			'text .';
		margin-block: 3em;

		&:before {
			content: '';
			position: absolute;
			width: 40px;
			height: 40px;
			margin: -20px;
			border-radius: 50%;
			box-shadow: 0 0 0 250px transparent;
		}

		& .content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-block: 3em;

			& h2 {
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-light);
				grid-area: title;
				text-align: center;
				margin: 0;
				padding: 0;
				font-family: var(--font-title);
				font-size: clamp(var(--h6), 7vw, var(--lg));
				letter-spacing: 3px;
				text-wrap: balance;
			}

			& p {
				color: var(--color-light);
				grid-area: text;
				padding: 0;
				font-family: var(--font-regular);
				font-size: clamp(var(--xs), 2vw, var(--h5));
				font-weight: 300;
				line-height: 1.1;
				margin-inline: auto;
			}
		}

		& img {
			max-width: clamp(10em, 3vw, 15em);
			width: 100%;
			height: auto;
			object-fit: cover;
			grid-area: img;
			margin-top: 1em;

			@media (width <= 500px) {
				margin-top: 0;
			}
		}
	}
</style>
