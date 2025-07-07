<script>
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.webp';

	/** @type {{title: any, description: any, keywords: any}} */
	let { title, description, keywords } = $props();

	let url = $derived($page.url.href);
	let siteName = 'Busy Bat Sewing Co.';
	let baseUrl = $derived($page.url.origin);

	// Canonical URL with proper normalization
	let canonicalUrl = $derived(() => {
		const { origin, pathname } = $page.url;
		// Remove trailing slash except for root path, and ensure consistent formatting
		const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
		return `${origin}${normalizedPath}`;
	});
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:image" content="{baseUrl}/photos/logo.webp" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{baseUrl}/photos/logo.webp" />

	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "http://schema.org",
			"@type": "WebSite",
			"name": siteName,
			"description": description,
			"url": canonicalUrl
		})}
	</script>
</svelte:head>
