<script>
	import SendButton from '$lib/components/layout/SendButton.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
</script>

<VerticalTitle title="Contact" class="vertical-title" />

<div class="content">
	<div class="form-container">
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			class="visually-hidden"
			id="form-status"
		>
			<!-- Screen reader announcements will go here -->
		</div>
		<form method="POST" action="https://form.taxi/s/226lrszc">
			<fieldset>
				<p>
					<span class="visually-hidden">contact form</span>
				</p>

				<legend>Message Us</legend>

				<label for="name">Name:</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={name}
					required
					aria-describedby="name-help"
				/>
				<div id="name-help" class="visually-hidden">Please enter your full name</div>

				<label for="email">Email:</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					aria-describedby="email-help"
				/>
				<div id="email-help" class="visually-hidden">Please enter a valid email address</div>

				<label for="message">Message:</label>
				<textarea
					name="message"
					id="message"
					cols="30"
					rows="10"
					bind:value={message}
					required
					aria-describedby="message-help"
				></textarea>
				<div id="message-help" class="visually-hidden">Please enter your message or question</div>

				<div class="send">
					<SendButton title="Send" />
				</div>
			</fieldset>
		</form>
	</div>
</div>

<style>
	.content {
		display: flex;
		width: 100%;
		overflow: hidden;
		height: 100vh;

		@media (width <= 768px) {
			width: 100vw;
		}

		& .form-container {
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
			padding: 0;
			transform: translateY(0);
			position: relative;
			width: 100%;
			height: 100vh;

			& form {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				width: min(70%, 1000px);
				margin-inline: auto;
				transform: translateY(0);
				scale: 1;
				padding-bottom: 1.5rem;

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
						color: var(--color-dark);
						font-family: var(--font-regular);
						font-size: clamp(var(--h5), 2vw, var(--h4));
						font-weight: 700;
						text-align: left;
						letter-spacing: -1px;
						padding-inline: 1rem;

						@media (width <= 500px) {
							transform: none;
						}
					}

					@media (width <= 500px) {
						border: none;
					}
				}
				& label {
					color: var(--color-gray);
					font-family: var(--font-semibold);
					font-size: clamp(var(--h6), 2vw, var(--h5));
					font-weight: 700;
					text-align: center;
					letter-spacing: 0px;

					@media (width <= 500px) {
						transform: none;
					}
				}
				& input,
				& textarea {
					font-family: var(--font-regular);
					font-size: clamp(var(--h6), 2vw, var(--h4));
					padding-block: 0.1rem;
					border-radius: calc(var(--radius) * 3);
					width: 100%;
					box-sizing: border-box;

					background-color: rgba(255, 255, 255, 0.9);
					backdrop-filter: blur(8px);
					border: 2px solid rgba(255, 255, 255, 0.3);
					box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
					outline: none;
					transition: all 0.3s ease-in-out;

					@media (width <= 768px) {
						font-size: 1rem;
						width: 100%;
						box-sizing: border-box;
					}

					@media (width <= 500px) {
						transform: none;
						font-size: 0.9rem;
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
					margin-bottom: 1rem;
					@media (width <= 500px) {
						transform: none;
						scale: 1.2;
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

				@media (width <= 1950px) {
					scale: 0.9;
					margin-block: 1em;
					padding-top: 7em;
				}

				@media (width <= 1150px) {
					width: min(80%, 1200px);
					padding-bottom: 2.5rem;
					margin-inline: auto;
					padding-top: 0;
				}

				@media (width <= 980px) {
					width: min(85%, 900px);
				}
				@media (width <= 768px) {
					width: 90vw;
					max-width: 90vw;
					transform: translateY(-2em);
					margin: 0 auto;
					scale: 1;
					box-sizing: border-box;
					padding: 0;

					& fieldset {
						padding: 1rem;
						width: 100%;
						box-sizing: border-box;
						box-shadow: none;
						margin: 0;
						border: none;
						position: relative;
						z-index: 1;

						& legend {
							position: relative;
							z-index: 2;
							background-color: var(--color-white);
							padding-inline: 1rem;
							padding-block: 0.5rem;
							margin-bottom: 1rem;
						}
					}
				}

				@media (width <= 500px) {
					width: 95vw;
					max-width: 95vw;
					transform: translateY(-2em);
					margin: 0 auto;
					margin-top: 0;
					scale: 1;

					& fieldset {
						padding: 0.75rem;
						padding-top: 0;

						& legend {
							position: relative;
							z-index: 2;
							background-color: var(--color-white);
							padding-inline: 1rem;
							padding-block: 0.5rem;
							margin-bottom: 0;
						}
					}
				}
			}

			@media (width <= 768px) {
				align-items: flex-start;
				justify-content: center;
				height: 100vh;
				width: 100%;
				transform: translateY(0);
				overflow: hidden;
				box-sizing: border-box;
				margin-right: 2em;
				padding-top: 1em;
			}
		}
	}
</style>
