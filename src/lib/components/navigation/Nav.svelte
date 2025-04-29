<script>
	import { goto } from '$app/navigation';
	import Title from '$lib/components/layout/Title.svelte';
	import logo from '$lib/assets/logo.webp';
	import bg from '$lib/assets/pink-leo.webp';
	import NavLink from '$lib/components/navigation/NavLink.svelte';
	import CartIcon from '$lib/components/products/CartIcon.svelte';

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
		<li class="mobile-cart">
			<CartIcon onclick={handleLinkClick} navOpen={isOpen} />
		</li>

		<NavLink title="About" url="/about" onclick={handleLinkClick} />
		<NavLink title="Creations" url="/products" onclick={handleLinkClick} />
		<NavLink title="Gallery" url="/gallery" onclick={handleLinkClick} />
		<NavLink title="Summon Me" url="/contact" onclick={handleLinkClick} />
	</ul>

	<div class="cart-container desktop-cart">
		<CartIcon navOpen={isOpen} />
	</div>
</nav>

<style>
	:global(::view-transition-group(navigation)) {
		z-index: 5000 !important;
	}

	nav {
		position: relative;
		top: 0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding: 1rem;
		background-color: hsl(0, 0%, 100%);
		margin: 0;
		border-radius: 0;
		width: 100%;
		height: 3em;
		box-shadow: 0 0 4px var(--color-gray);
		z-index: 5000;
		margin-inline: auto;
		view-transition-name: navigation;
		scale: 1;

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
				margin: 0.45rem;
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
			gap: clamp(0.5rem, 1.75vw, 2rem);
			flex-flow: row wrap;
			margin: 0;
			padding: 0;
		}

		& .desktop-cart {
			display: flex;
			align-items: center;
			margin-right: 1rem;
			position: relative;
		}

		@media (width <= 500px) {
			width: 95%;
		}
	}

	.mobile-cart {
		display: none;

		@media (width <= 500px) {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			margin: 0;
			padding: 0;

			:global(.cart-icon) {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				text-decoration: none;
				color: var(--color-secondary);
				font-family: var(--font-bold);
				font-size: clamp(var(--h5), 1.5vw, var(--h4));
				font-weight: 900;
				letter-spacing: 5px;
				margin: 0;
				padding: 0;
				white-space: nowrap;
				text-align: center;
			}
		}
	}

	.desktop-cart {
		display: block;
	}

	@media (width <= 1150px) {
		nav {
			padding: 0.75rem;
		}
		ul {
			margin: 0 0.75rem;
			transform: scale(0.9);
			transform-origin: center;
		}
	}

	@media (width <= 980px) {
		nav {
			padding: 0.5rem;

			& .desktop-cart {
				margin-right: 0.5rem;
				transform: scale(0.85);
				transform-origin: center right;
			}
		}
		ul {
			margin: 0 0.5rem;
			transform: scale(0.85);
		}
	}

	@media (width <= 600px) {
		nav {
			height: auto;
			padding: 0.5rem;
			margin: 0;
			width: 100%;
			border-radius: 0;
		}

		ul {
			gap: 0.25rem;
		}
	}

	@media (width <= 500px) {
		nav {
			justify-content: space-between;
			border-radius: 0;
			padding: 0.05rem 1rem;
			margin: 0;
			width: 100%;
			height: 3.25em;

			& .desktop-cart {
				display: none;
			}

			& .burger {
				order: 3;
				display: block;
				position: relative;
				z-index: 4998;
				margin-right: 0.75rem;
			}

			& ul {
				position: fixed;
				inset: 0;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 3rem;
				width: 100vw;
				height: 100vh;
				background-color: var(--color-primary);
				z-index: 4997;
				overflow-y: auto;
				transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1) !important;
				margin: 0;
				padding: 0;
				transform: translateX(-100%);
				left: 0;
				right: 0;

				& li {
					opacity: 0;
					transform: translateX(0);
					transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
					pointer-events: none;
					text-align: center;
					width: 100%;
					padding: 0;
					margin: 0;
				}

				&.open {
					transform: translateX(0);
					left: 0;
					right: 0;

					& li {
						opacity: 1;
						transform: translateX(0);
						pointer-events: all;

						&:nth-child(1) {
							transition-delay: 0.4s;
						}
						&:nth-child(2) {
							transition-delay: 0.5s;
						}
						&:nth-child(3) {
							transition-delay: 0.6s;
						}
						&:nth-child(4) {
							transition-delay: 0.7s;
						}
						&:nth-child(5) {
							transition-delay: 0.8s;
						}
					}

					& li.mobile-cart {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						list-style: none;
						opacity: 1;
						transform: translateX(0);
						transition-delay: 0.3s;
						pointer-events: all;
						margin: 0;
						padding: 0.5rem 0;

						& :global(.cart-icon-wrapper) {
							display: flex;
							justify-content: center;
							align-items: center;
							width: auto;
							height: auto;
						}

						& :global(.cart-icon) {
							color: var(--color-secondary);
							display: flex;
							justify-content: center;
							align-items: center;
							margin: 0;
							padding: 0;
						}
					}
				}
			}
		}
	}
</style>
