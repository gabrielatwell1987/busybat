<script>
	import Title from '$lib/components/Title.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';
</script>

<section>
	<Title title="Success" />

	<VerticalTitle title="Success" />

	<p>Your message has been sent successfully. We will get back to you as soon as possible.</p>
</section>

<style>
	section {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		gap: 2rem;

		& p {
			font-size: clamp(var(--h6), 3vw, var(--h3));
			font-family: var(--font-regular);
			text-align: center;
		}
	}
</style>
