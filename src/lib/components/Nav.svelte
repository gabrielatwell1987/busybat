<script>
	import Title from '$lib/components/Title.svelte';
	import logo from '$lib/assets/logo.webp';
	import bg from '$lib/assets/pink-leo.webp';
	import NavLink from '$lib/components/NavLink.svelte';
	import { goto } from '$app/navigation';

	let isOpen = $state(false);

	const toggleMenu = () => (isOpen = !isOpen);

	const handleLinkClick = (event) => {
		if (isOpen) {
			isOpen = false;

			const href = event.currentTarget.getAttribute('href');

			setTimeout(() => {
				goto(href);
			}, 10);

			event.preventDefault();
		}
	};
</script>

<nav
	style="background-image: url({bg}); background-size: cover; background-position: center; background-attachment: fixed; background-repeat: repeat;"
>
	<div class="title">
		<Title title="Busy Little Bat Sewing" />
	</div>

	<button class="burger" class:open={isOpen} onclick={toggleMenu} aria-label="hamburger menu">
		<span class="bar"></span>
		<span class="bar"></span>
		<span class="bar"></span>
	</button>

	<ul class:open={isOpen}>
		<NavLink title="About" url="/about" onclick={handleLinkClick} />
		<NavLink title="Creations" url="/products" onclick={handleLinkClick} />
		<NavLink title="Gallery" url="/gallery" onclick={handleLinkClick} />
		<NavLink title="Summon Me" url="/contact" onclick={handleLinkClick} />
	</ul>
</nav>

<style>
	:global(::view-transition-group(navigation)) {
		z-index: 5000 !important;
	}

	nav {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding: 1rem;
		background-color: hsl(0, 0%, 100%);
		margin: 0.25rem 0;
		border-radius: var(--radius);
		width: 99%;
		height: 3.5em;
		box-shadow: 0 0 4px var(--color-gray);
		z-index: 40;
		margin-inline: auto;
		view-transition-name: navigation;
		scale: 1;
		z-index: 5000;

		& .title {
			opacity: 0.9;

			&:hover {
				opacity: 1;
			}
		}

		& .burger {
			display: none;
			background-color: transparent;
			border: none;
			cursor: pointer;
			z-index: 20;

			& .bar {
				display: block;
				width: 2rem;
				height: 0.25rem;
				background-color: var(--color-secondary);
				margin: 0.5rem;
				border-radius: 10px;
				transition: all 0.3s linear;
			}

			&.open .bar:nth-child(1) {
				transform: rotate(45deg) translate(0.25rem, 0.8rem);
				transition: transform 0.3s linear;
				background-color: var(--color-dark);
			}

			&.open .bar:nth-child(2) {
				opacity: 0;
			}

			&.open .bar:nth-child(3) {
				transform: rotate(-45deg) translate(0.25rem, -0.8rem);
				transition: transform 0.3s linear;
				background-color: var(--color-dark);
			}
		}

		& ul {
			display: flex;
			gap: clamp(0.5rem, 2vw, 2rem);
			flex-flow: row wrap;
		}

		@media (width <= 500px) {
			width: 95%;
		}
	}

	@media (width <= 1150px) {
		ul {
			scale: 0.9;
		}
	}

	@media (width <= 980px) {
		ul {
			scale: 0.8;
		}
	}

	@media (width <= 500px) {
		nav {
			justify-content: space-between;
			border-radius: 0;
			padding: 0.05rem 1rem;

			& .burger {
				display: block;
				position: relative;
				z-index: 4998;
			}

			& ul {
				position: fixed;
				top: 0;
				left: -120%;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 3.5rem;
				width: 100%;
				height: 100vh;
				background-color: var(--color-primary);
				z-index: 4997;
				overflow-y: auto;
				opacity: 1;
				transition: left 0.5s ease-in-out !important;
				transform: none !important;
				margin: 0;
				scale: 1;

				&.open {
					left: -12%;
				}
			}
		}
	}
</style>
