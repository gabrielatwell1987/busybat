<script>
	import { page } from '$app/stores';

	/** @type {{title: any, description: any, keywords: any}} */
	let { title, description, keywords } = $props();

	let url = $derived($page.url.href);
	let siteName = 'Busy Bat Sewing Co.';
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<link rel="canonical" href={url} />

	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebSite",
			"name": "Busy Bat",
			"description": "Busy Bat Sewing Co. - Handmade bags and accessories",
			"url": ${JSON.stringify(url)}
		}
	</script>
</svelte:head>
