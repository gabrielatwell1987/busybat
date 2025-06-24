<script>
	/** @type {{src: any, alt: any}} */
	let { src, alt, width = 'auto', inline = 'center' } = $props();

	let imageElement;

	$effect(() => {
		const observer = new IntersectionObserver(([entry], observer) => {
			if (entry.isIntersecting) {
				imageElement.src = src;
				observer.unobserve(imageElement);
			}
		});

		observer.observe(imageElement);

		return () => observer.disconnect();
	});
</script>

<img {src} {alt} {width} bind:this={imageElement} class={inline} />

<style>
	img {
		max-width: 100%;
		height: auto;
		object-fit: cover;
		border-radius: 10px;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.left {
		margin-right: auto;
		margin-left: 0;
	}

	.center {
		margin-inline: auto;
	}

	.right {
		margin-left: auto;
		margin-right: 0;
	}
</style>
