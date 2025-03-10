<script>
	import Contact from '$lib/components/Contact.svelte';
	import bg from '$lib/assets/product-bg.webp';
</script>

<section
	style="background-image: url({bg}); background-repeat: repeat; background-position: center center;"
>
	<Contact />
</section>

<style>
	section {
		width: 100vw;
		height: 100vh;
		overflow-y: hidden;
	}
</style>
