<script>
	import SEO from './../lib/data/SEO.svelte';
	import Hero from '$lib/components/hero/Hero.svelte';
	import InvertedBorder from '$lib/components/layout/InvertedBorder.svelte';
</script>

<SEO
	title="Busy Little Bat Sewing"
	description="Handmade sewing company in Las Vegas, Nevada. Specializing in bags and accessories."
	keywords="busy bat, busy bat sewing, busy bat sewing co, busy bat sewing company, busy bat las vegas, busy bat sewing las vegas, busy bat sewing co las vegas, handmade bags, handmade accessories, handmade bags las vegas, handmade accessories las vegas"
/>

<main>
	<h1 class="visually-hidden">Busy Little Bat Sewing Co. - Handmade Gothic Accessories</h1>

	<Hero />

	<section aria-labelledby="handmade-heading">
		<InvertedBorder
			title="Handmade Goods"
			text="Custom handmade bags, clothing, and accessories. Everything is made by hand in Las Vegas, Nevada."
			src="/products/d.harry/dh-jacket__back.webp"
			alt="debbie harry jacket"
		/>
	</section>
</main>
