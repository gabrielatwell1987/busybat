<script>
	import { goto } from '$app/navigation';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	async function login() {
		if (!username.trim() || !password.trim()) {
			error = 'Please enter both username and password';
			// Focus the first empty field for better UX
			if (!username.trim()) {
				document.getElementById('username')?.focus();
			} else {
				document.getElementById('password')?.focus();
			}
			return;
		}

		loading = true;
		error = '';

		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: username.trim(), password })
			});

			const data = await res.json();

			if (data.token) {
				document.cookie = `token=${data.token}; path=/; max-age=3600`; // 1 hour
				goto('/admin');
			} else {
				error = data.error || 'Invalid credentials';
			}
		} catch (err) {
			error = 'Login failed. Please try again.';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}

	// Enhanced keyboard support
	function handleKeyDown(event) {
		// Allow Enter key to submit form from any input
		if (
			event.key === 'Enter' &&
			(event.target.id === 'username' || event.target.id === 'password')
		) {
			if (username.trim() && password.trim()) {
				login();
			}
		}
	}
</script>

<svelte:head>
	<title>Admin Login</title>
	<meta name="description" content="Admin login page" />
</svelte:head>

<VerticalTitle title="Admin Login" />

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<h1>Admin Login</h1>

			<p>Please sign in to access the admin dashboard</p>
		</div>
		{#if error}
			<div class="error-message" role="alert" aria-live="polite" id="error-message">
				<p>{error}</p>
			</div>
		{/if}

		<form
			onsubmit={(e) => {
				e.preventDefault();
				login();
			}}
			class="login-form"
		>
			<div class="form-group">
				<label for="username">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					placeholder="Enter your username"
					disabled={loading}
					required
					aria-describedby={error ? 'error-message' : undefined}
					autocomplete="username"
					onkeydown={handleKeyDown}
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Enter your password"
					disabled={loading}
					required
					aria-describedby={error ? 'error-message' : undefined}
					autocomplete="current-password"
					onkeydown={handleKeyDown}
				/>
			</div>

			<button type="submit" disabled={loading || !username.trim() || !password.trim()}>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		padding: 1rem;
		margin-top: -8em;

		@media (width <= 768px) {
			margin-top: -4em;
		}

		& .login-card {
			background: var(--color-white);
			border-radius: var(--radius);
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
			padding: 2.5rem;
			width: 100%;
			max-width: 600px;

			& .login-header {
				text-align: center;
				margin-bottom: 2rem;

				& h1 {
					margin: 0 0 0.5rem 0;
					font-size: clamp(var(--h3), 4vw, var(--lg));
					color: var(--color-accent);
					-webkit-text-stroke: 1px var(--color-secondary);
				}

				& p {
					margin: 0;
					color: var(--color-secondary);
					font-size: clamp(var(--sm), 1vw, var(--h6));
				}
			}

			& .error-message {
				background: var(--color-lighter-accent);
				border: 1px solid var(--color-danger);
				border-radius: var(--radius);
				padding: 0.75rem;
				margin-bottom: 1.5rem;

				& p {
					margin: 0;
					color: var(--color-danger);
					font-size: clamp(var(--xs), 1vw, var(--sm));
				}
			}
			& .login-form {
				margin-bottom: 2rem;

				@media (width <= 768px) {
					width: 70vw;
				}

				& .form-group {
					margin-bottom: 1.5rem;

					& label {
						display: block;
						margin-bottom: 0.5rem;
						font-weight: 600;
						color: var(--color-secondary);
						font-size: clamp(var(--sm), 1vw, var(--h6));
					}

					& input {
						width: 100%;
						padding: 0.75rem;
						border: 2px solid var(--color-fade-primary);
						border-radius: var(--radius);
						font-size: clamp(var(--sm), 1vw, var(--h6));
						transition: border-color 0.2s;
						box-sizing: border-box;
						color: var(--color-secondary);
						&:focus {
							outline: none;
							border-color: var(--color-accent);
							box-shadow: 0 0 0 3px rgba(var(--color-accent), 0.2);
						}

						&:focus-visible {
							outline: 2px solid var(--color-accent);
							outline-offset: 2px;
						}

						&:disabled {
							background: var(--color-light);
							cursor: not-allowed;
						}
					}
				}
				& button {
					width: 100%;
					padding: 0.875rem;
					background: var(--color-accent);
					color: var(--color-primary);
					border: none;
					border-radius: var(--radius);
					font-size: clamp(var(--sm), 1vw, var(--h6));
					font-weight: 600;
					cursor: pointer;
					transition: background-color 0.2s;

					&:hover:not(:disabled) {
						background: var(--color-primary);
						color: var(--color-accent);
						border: 1px solid var(--color-accent);
					}

					&:focus {
						outline: none;
						box-shadow: 0 0 0 3px rgba(var(--color-accent), 0.3);
					}

					&:focus-visible {
						outline: 2px solid var(--color-accent);
						outline-offset: 2px;
					}

					&:disabled {
						background: var(--color-gray);
						cursor: not-allowed;
					}
				}
			}
		}

		@media (max-width: 480px) {
			& .login-card {
				padding: 2rem;
				margin: 1rem;

				& .login-header {
					& h1 {
						font-size: clamp(var(--h6), 5vw, var(--h4));
					}
				}
			}
		}
	}
</style>
