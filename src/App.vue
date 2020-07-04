<template>
	<div id="task-board">
		<router-view/>
	</div>
</template>

<script>

export default {
	name: 'app',
	components: {

	}
}

</script>

<style lang="scss">
	*, ::before, ::after {
		box-sizing: border-box;
	}

	html, body {
		margin: 0;
		padding: 0;

		font-family: 'Comfortaa', cursive;
		font-size: 16px;
		background-color: #001925;
		color: #fff;
	}

	#task-board {
		.form {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			
			&-container {
				background-color: #042b3e;
				box-shadow: 0.625rem 0.625rem 0.3rem 0px rgba(0,0,0,0.4);
				min-width: 350px;
				text-align: center;

				&-header {
					padding: 1.5rem 2rem 1rem 2rem;
					background-color: #154e6b;

					h2 {
						font-size: 1.6rem;
						margin: 0;
					}
				}

				&-inner {
					display: flex;
					flex-direction: column;
					padding: 1.5rem 2rem;

					hr {
						margin: 0;
						border: 0;
						border-bottom: 1px solid #134e6b;
						margin-top: 0.3rem;
						margin-bottom: 1.5rem;
					}

					input {
						outline: none;
						font-size: 1rem;
						font-weight: 500;
						color: #fff;
						background: transparent;
						border: 1px solid #134e6b;
						padding: 0.8rem 1rem;
						transition: 0.3s ease-in-out;
						font-family: 'Comfortaa', cursive;

						&::placeholder {
							color: rgb(166, 170, 189);
						}

						&[type="submit"] {
							background-color: #154e6b;
							padding: 0.8rem;
							cursor: pointer;
							box-shadow: 0.625rem 0.625rem 0.625rem -0.25rem #0f0f0f;
							border: none;

							&:hover {
								transform: translate(-0.15rem, -0.15rem);
								box-shadow: 1rem 1rem 0.625rem -0.35rem #0f0f0f;
							}
						}

						&:not(:last-child) {
							margin-bottom: 1.2rem;
						}
					}

					.validate {

						&.success {
							p {
								color: green;
							}
						}
						p {
							color: red;
							margin: 0.5rem 0 0;
						}
					}
				}

				&-footer {
					margin-bottom: 1.5rem;

					span {
						font-size: 0.9rem;

						a {
							color: #fff;
						}
					}
				}
			}
		}
	}
</style>
