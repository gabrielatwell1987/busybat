<script>
	import SendButton from '$lib/components/SendButton.svelte';
	import VerticalTitle from '$lib/components/VerticalTitle.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
</script>

<div class="content">
	<div class="form-container">
		<form method="POST" action="https://form.taxi/s/226lrszc">
			<fieldset>
				<legend>Message us</legend>

				<label for="name">Name:</label>
				<input type="text" id="name" name="name" bind:value={name} required />

				<label for="email">Email:</label>
				<input type="email" id="email" name="email" bind:value={email} required />

				<label for="message">Message:</label>
				<textarea name="message" id="message" cols="30" rows="10" bind:value={message} required
				></textarea>

				<div class="send">
					<SendButton title="Send" />
				</div>
			</fieldset>
		</form>
	</div>

	<VerticalTitle title="Contact" class="vertical-title" />
</div>

<style>
	.content {
		display: flex;
		width: 100%;
		overflow-x: hidden;

		& .form-container {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			width: 100%;
			overflow-y: auto;
			padding: 1rem 0;
			view-transition-name: form;
			overflow-x: hidden;
			transform: translateY(0);

			& form {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				width: min(70%, 1000px);
				margin-inline: auto;
				margin-bottom: 1em;
				transform: translateY(0);

				/* @media (width <= 500px) {
					transform: translateX(1rem);
				} */

				& fieldset {
					border: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					border: 2px solid var(--color-gray);
					border-radius: var(--radius);
					gap: inherit;
					width: 100%;
					padding: 2em;
					box-sizing: border-box;
					position: relative;
					background-color: var(--color-white);

					& legend {
						color: var(--color-gray);
						font-family: var(--font-regular);
						font-size: clamp(var(--h6), 2vw, var(--h5));
						font-weight: 700;
						text-align: left;
						letter-spacing: 3px;
						padding-inline: 1rem;

						@media (width <= 500px) {
							transform: translateY(0);
						}
					}

					@media (width <= 500px) {
						border: none;
					}
				}

				& label {
					color: var(--color-gray);
					font-family: var(--font-regular);
					font-size: clamp(var(--h6), 2vw, var(--h5));
					font-weight: 700;
					text-align: center;
					letter-spacing: 3px;

					@media (width <= 500px) {
						transform: translateX(-5%);
					}
				}

				& input,
				& textarea {
					font-family: var(--font-regular);
					font-size: clamp(var(--h6), 2vw, var(--h4));
					padding-block: 0.1rem;
					border-radius: calc(var(--radius) * 3);

					background-color: rgba(255, 255, 255, 0.9);
					backdrop-filter: blur(8px);
					border: 2px solid rgba(255, 255, 255, 0.3);
					box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
					outline: none;
					transition: all 0.3s ease-in-out;

					@media (width <= 500px) {
						transform: translateX(-5%);
					}
				}

				& input {
					padding-inline: 1rem;
					padding-block: 0.5rem;

					&:user-valid {
						outline: 2px solid var(--color-success);
						box-shadow: 0 0 0 2px var(--color-success);
					}

					&:user-invalid {
						outline: 2px solid var(--color-danger);
						box-shadow: 0 0 0 2px var(--color-danger);
					}

					&:focus {
						border: 2px solid rgba(255, 255, 255, 0.3);
						box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
					}
				}

				& .send {
					@media (width <= 500px) {
						transform: translateX(-5%);
						scale: 1.5;
						margin-top: 1em;
					}
				}

				& textarea {
					padding-inline: 1rem;
					padding-block: 0.5rem;

					&:user-valid {
						outline: 2px solid var(--color-success);
						box-shadow: 0 0 0 2px var(--color-success);
					}

					&:user-invalid {
						outline: 2px solid var(--color-danger);
						box-shadow: 0 0 0 2px var(--color-danger);
					}

					&:focus {
						border: 2px solid rgba(255, 255, 255, 0.3);
						box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
					}

					@media (width <= 768px) {
						height: 80px;
						min-height: 80px;
						rows: 4;
					}
				}

				@media (width <= 1150px) {
					width: min(80%, 1200px);
					padding-top: 1.5em;
					margin-inline: auto;
				}

				@media (width <= 980px) {
					width: min(85%, 900px);
				}

				@media (width <= 768px) {
					width: 90%;
					transform: translateY(0);
					margin-inline: auto;
					scale: 0.75;
					margin-right: 5em;

					& fieldset {
						padding: 1em 0.75em;
						width: 100%;
						box-sizing: border-box;
						box-shadow: none;
					}
				}
			}

			@media (width <= 768px) {
				align-items: center;
				height: 100vh;
				padding: 0;
				width: 100%;
				transform: translateY(0);
			}
		}
	}

	::view-transition-old(form) {
		animation: move-down var(--timing) ease-out forwards;
	}

	::view-transition-new(form) {
		animation: move-up var(--timing) ease-out forwards;
	}

	@keyframes move-down {
		0% {
			translate: 0 0;
			opacity: 1;
		}
		100% {
			translate: 0 100%;

			opacity: 0;
		}
	}

	@keyframes move-up {
		0% {
			translate: 0 100%;
			opacity: 0;
		}
		100% {
			translate: 0 0;
			opacity: 1;
		}
	}
</style>
