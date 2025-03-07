<script>
	import Title from '$lib/components/Title.svelte';
	import logo from '$lib/assets/logo.webp';
	import bg from '$lib/assets/pink-leo.webp';

	let isOpen = $state(false);

	const toggleMenu = () => (isOpen = !isOpen);

	const handleLinkClick = (event) => {
		if (isOpen) {
			isOpen = false;

			const href = event.currentTarget.getAttribute('href');

			setTimeout(() => {
				window.location.href = href;
			}, 10);

			event.preventDefault();
		}
	};
</script>

<nav style="background-image: url({bg});">
	<Title title="Busy Little Bat Sewing" />

	<button class="burger" class:open={isOpen} onclick={toggleMenu} aria-label="hamburger menu">
		<span class="bar"></span>
		<span class="bar"></span>
		<span class="bar"></span>
	</button>

	<ul class:open={isOpen}>
		<li><a href="/" onclick={handleLinkClick}>Home</a></li>

		<li><a href="/products" onclick={handleLinkClick}>Products</a></li>

		<li><a href="/about" onclick={handleLinkClick}>About</a></li>

		<li><a href="/contact" onclick={handleLinkClick}>Contact</a></li>
	</ul>
</nav>

<style>
	:global(::view-transition-group(navigation)) {
		z-index: 9999 !important;
	}

	nav {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding: 1rem;
		background-color: hsl(0, 0%, 100%);
		margin: 0.5rem 0;
		border-radius: var(--radius);
		width: 99%;
		height: 5em;
		box-shadow: 0 0 4px var(--color-gray);
		z-index: 40;
		margin-inline: auto;
		view-transition-name: navigation;
		scale: 1;
		z-index: 9000;

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

			& li {
				list-style: none;

				& a {
					text-decoration: none;
					color: var(--color-secondary);
					font-family: var(--font-bold);
					font-size: clamp(var(--h6), 2vw, var(--h3));
					font-weight: 900;
					letter-spacing: 3px;
					transition:
						color 0.2s ease-in-out,
						border-bottom 0.2s ease-in-out,
						transform 0.2s ease-in-out,
						font-weight 0.2s ease-in-out;
					display: inline-block;

					&:hover {
						border-bottom: 5px solid var(--color-secondary);
						border-radius: 2px;
						transform: scale(1.1);
						font-weight: 900;

						@media (width <= 500px) {
							border-bottom: none;
						}
					}

					@media (width <= 500px) {
						letter-spacing: 5px;
						font-size: var(--h6);
					}
				}
			}
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
				z-index: 9998;
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
				z-index: 9997;
				overflow-y: auto;
				opacity: 1;
				transition: left 0.5s ease-in-out !important;
				transform: none !important;
				margin: 0;
				scale: 1;

				&.open {
					left: -12%;
				}

				& li {
					transform: translateY(-15px);
					transition: transform 0.5s ease-out;
					transition-delay: 0.05s;

					&:nth-child(2) {
						transition-delay: 0.2s;
					}

					&:nth-child(3) {
						transition-delay: 0.25s;
					}

					&:nth-child(4) {
						transition-delay: 0.3s;
					}
				}

				&.open li {
					transform: translateY(0);
				}
			}
		}
	}
</style>
