<script>
	import { waitLocale } from 'svelte-i18n';
	import { _ } from 'svelte-i18n';

	export async function preload() {
		// awaits for the loading of the 'en-US' and 'en' dictionaries
		return waitLocale();
	}
</script>

<main
	class="!h-screen overflow-hidden
flex justify-start
items-center
 flex-col"
>
	<!-- <h2 class="bg-gradient-to-r from-fuchsia-600 to-purple-600"></h2> -->
	<div class="grow items-center flex flex-col justify-center">
		<h1
			class="text-5xl p-4 text-center font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"
		>
			{$_('Video to Mp3 converter')}
		</h1>
		<slot />
	</div>
	<footer
		class="flex self-start
	  			 px-16 py-2 text-xl
		 			 font-bold text-[#09cf]
					 hover:text-cyan-300 transition-all duration-300 ease-in-out
					 "
	>
		<p>Iglesias Ignacio</p>
	</footer>
</main>

<style>
	:global(body) {
		font-family:
			system-ui,
			-apple-system,
			Roboto,
			'Helvetica Neue',
			sans-serif;
		color: white;
		background-image: linear-gradient(135deg, hsl(237, 92%, 62%) 25%, transparent 25%),
			linear-gradient(225deg, hsl(237, 92%, 62%) 25%, transparent 25%),
			linear-gradient(45deg, hsl(237, 92%, 62%) 25%, transparent 25%),
			linear-gradient(315deg, hsl(237, 92%, 62%) 25%, transparent 25%);
		background-position:
			40px 0,
			40px 0,
			0 0,
			0 0;
		background-size: 80px 80px;
		background-repeat: repeat;
		background-attachment: fixed;
		margin: 0;
		width: 100%;
		min-height: 100vh;
	}

	:global(body::before) {
		content: '';
		width: 100%;
		height: 100%;
		min-height: 100vh;
		position: fixed;
		background-image: linear-gradient(to bottom, hsl(281, 63%, 14%), hsl(247, 92%, 29%));
		opacity: 0.94;
		z-index: -1;
	}
</style>
