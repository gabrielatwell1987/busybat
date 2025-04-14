<script>
	import miniMenaceImg from '$lib/assets/dropdown/mini-menace-chain__open.webp';
	import dhSizeChart from '$lib/assets/dropdown/dh-size-chart.webp';

	let { id, name, isEnlarged, onClose } = $props();
	let isDropdownOpen = $state(false);

	const dropdownImages = {
		'1': miniMenaceImg,
		'2': dhSizeChart
	};

	const actualDropdownImage = dropdownImages[id];

	function toggleDropdown(e) {
		e?.stopPropagation();
		isDropdownOpen = !isDropdownOpen;
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
			e.preventDefault();
			e.stopPropagation();
			toggleDropdown(e);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			if (isDropdownOpen) {
				// First close the dropdown if it's open
				isDropdownOpen = false;
			} else {
				// If dropdown is closed, close the enlarged product
				onClose?.();
			}
		}
	}
</script>

<div class="dropdown-container">
	<button
		class="dropdown-toggle"
		onclick={toggleDropdown}
		onkeydown={handleKeydown}
		aria-expanded={isDropdownOpen}
		aria-controls="product-dropdown-{id}"
		aria-label="View additional product details"
	>
		<span class="visually-hidden">View Details</span>
		<span class="arrow-icon">{isDropdownOpen ? '▲' : '▼'}</span>
	</button>

	{#if isDropdownOpen}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="dropdown-content"
			id="product-dropdown-{id}"
			role="region"
			aria-label="Additional product details"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					e.preventDefault();
					isDropdownOpen = false;
				}
			}}
		>
			<img src={actualDropdownImage} alt={name} class="dropdown-image" />
		</div>
	{/if}
</div>

<style>
	.dropdown-container {
		width: 100%;
		margin: 0.75rem 0;
		grid-row: 4;
		position: relative;
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;

		@media (max-width: 768px) {
			position: relative;
			z-index: 1000;
		}

		& .dropdown-toggle {
			width: 40px;
			height: 40px;
			padding: 0.5rem;
			background-color: var(--color-dark);
			color: white;
			border: none;
			border-radius: var(--radius);
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: clamp(var(--sm), 1.25vw, var(--h6));
			font-weight: 500;
			transition: background-color 0.3s;
			z-index: 2;
			position: relative;
			aspect-ratio: 1 / 1;

			@media (max-width: 768px) {
				position: absolute;
				top: -2em;
				right: 5%;
				z-index: 1001;
				width: 30px;
				height: 35px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
			}

			&:focus-visible {
				outline: 3px solid var(--color-secondary);
				outline-offset: 2px;
				box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
			}

			&:hover {
				background-color: hsl(220, 10%, 25%);
			}
		}

		& .arrow-icon {
			font-size: 1.5em;
			transition: transform 0.3s;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		& .dropdown-content {
			position: absolute;
			left: auto;
			right: 100%;
			max-width: 80vw;
			width: 600px;
			margin-left: 0;
			margin-right: 1rem;
			margin-top: 0;
			border-radius: var(--radius);
			animation: slideDown 0.3s ease forwards;
			z-index: 200;
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
			background-color: white;
			overflow: auto;
			max-height: 80vh;

			@media (max-width: 768px) {
				position: fixed;
				top: 15rem;
				left: 0;
				right: 0;
				bottom: auto;
				height: auto;
				margin-top: 0;
				margin-right: 0;
				max-height: 60vh;
				min-height: 200px;
				width: 100%;
				z-index: 500;
				background-color: var(--color-white);
				box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
				overflow: auto;
			}

			& .dropdown-image {
				max-height: none;
				width: 100%;
				height: auto;
				display: block;
				border-radius: var(--radius);
				object-fit: contain;

				@media (max-width: 768px) {
					max-height: 70vh;
					width: auto;
					max-width: 100%;
					max-height: 60vh;
					height: auto;
					display: block;
					border-radius: var(--radius);
					object-fit: contain;
					margin-inline: auto;
				}
			}
		}
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
