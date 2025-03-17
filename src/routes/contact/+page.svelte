<script>
	import SEO from '$lib/data/SEO.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import bg from '$lib/assets/product-bg.webp';
</script>

<SEO
	title="Busy Little Bat Sewing &middot; Contact Us"
	description="Contact Busy Bat"
	keywords="contact busy bat, contact busy bat sewing co"
/>

<section
	style="background-image: url({bg}); background-repeat: repeat; background-position: center center; background-size: contain;"
>
	<Contact />
</section>

<style>
	section {
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
		background-size: auto;
		background-repeat: repeat;
		position: relative;
		top: 0;
		left: 0;
	}
</style>
