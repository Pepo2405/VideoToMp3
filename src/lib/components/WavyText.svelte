<script>
	export let text = 'Hello World';
</script>

<header>
	<p id="width-provide" class="text-md" style="visibility: hidden;">{text}</p>

	<p class="border text-">{text}</p>
	<p class="wave">{text}</p>
</header>

<style>
	/* Agrega un estilo al header para usar flexbox */
	header {
		display: flex;
		justify-content: center; /* Centra el contenido horizontalmente */
		height: 3rem;
	}

	/* Asegúrate de que el párrafo específico tenga el mismo ancho */
	#width-provide {
		border: 1px solid red;
		width: 100%; /* Usa el 100% del espacio disponible en el header */
		box-sizing: border-box; /* Incluye el ancho del borde en el ancho total */
	}

	p {
		position: absolute;
		font-size: 3rem;
	}
	@media (max-width: 768px) {
		p {
			margin-top: 3rem;
			font-size: 1.5rem;
		}
	}

	.border {
		color: black;
		text-shadow:
			-1px 1px white,
			1px -1px white,
			-1px -1px white,
			1px 1px white;
	}

	.wave {
		color: #09f;
		animation: waves 3s ease-in-out infinite;
	}

	@keyframes waves {
		0%,
		100% {
			clip-path: polygon(
				0% 47%,
				10% 48%,
				33% 54%,
				54% 60%,
				70% 61%,
				84% 59%,
				100% 52%,
				100% 100%,
				0% 100%
			);
		}
		50% {
			clip-path: polygon(
				0% 60%,
				15% 65%,
				34% 66%,
				51% 62%,
				67% 50%,
				84% 45%,
				100% 46%,
				100% 100%,
				0% 100%
			);
		}
	}
</style>
