<script lang="ts">
	import { downloadVideo, readFile, removeFileExtension } from '$lib/utils';
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { confetti } from '@neoconfetti/svelte';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import '../global.css';
	import UploadIcon from '$lib/components/UploadIcon.svelte';
	import { _ } from 'svelte-i18n';

	type State = 'loading' | 'loaded' | 'converts.start' | 'converts.error' | 'converts.done';

	let state: State = 'loading';
	let error = '';
	let ffmpeg: FFmpeg | null = null;
	let progress = tweened(0);
	let fileName = '';

	async function handleFileDrop(e: any) {
		e.preventDefault();
		if (e.dataTransfer.files.length > 1) {
			error = $_('🤚 One file at a time, please! 🤚');
			return;
		}
		const fileDropped = e.dataTransfer.files[0];
		if (!fileDropped) return;
		if (!fileDropped?.type.includes('video')) {
			error = $_('😖 ¡Only video files are allowed! 😖');
			return;
		}
		error = '';
		const data = await convertVideo(fileDropped);
		downloadVideo(data, fileName);
	}

	async function handleFileChange(e: any) {
		e.preventDefault();
		if (e.target.files.length > 1) {
			error = $_('🤚 One file at a time, please! 🤚');
			return;
		}
		const fileDropped = e.target.files[0];
		if (!fileDropped) return;
		if (!fileDropped?.type.includes('video')) {
			error = $_('😖 ¡Only video files are allowed! 😖');
			return;
		}
		error = '';
		const data = await convertVideo(fileDropped);
		downloadVideo(data, fileName);
	}

	async function loadFFmpeg() {
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm';
		ffmpeg = new FFmpeg();
		await ffmpeg.load({
			coreURL: `${baseURL}/ffmpeg-core.js`,
			wasmURL: `${baseURL}/ffmpeg-core.wasm`,
			workerURL: `${baseURL}/ffmpeg-core.worker.js`
		});
		state = 'loaded';

		ffmpeg.on('log', (msg) => console.info(msg));
		ffmpeg.on('progress', (e) => {
			$progress = e.progress * 100;
		});
	}

	async function convertVideo(video: File) {
		state = 'converts.start';
		// Remove fileName extension
		fileName = removeFileExtension(video.name);
		const videoData = await readFile(video);
		await ffmpeg?.writeFile(video.name, videoData);
		await ffmpeg?.exec(['-i', video.name, 'output.mp3']);
		const data = await ffmpeg?.readFile('output.mp3');
		state = 'converts.done';
		return data as Uint8Array;
	}

	// Loading up FFmpeg
	onMount(() => {
		loadFFmpeg();
	});
</script>

<svelte:head>
	<title>{$_('Video to Mp3')}</title>
</svelte:head>
<!-- svelte-ignore a11y-no-static-element-interactions -->

<label
	for="file"
	data-state={state}
	on:drop|preventDefault={handleFileDrop}
	on:dragover|preventDefault={() => {}}
	class="drop"
>
	<input
		on:change={handleFileChange}
		style="display: none;"
		type="file"
		id="file"
		accept="video/*"
	/>
	{#if state === 'converts.done'}
		<div use:confetti={{ colors: ['cyan', 'white', 'yellow'], particleShape: 'rectangles' }} />
		<p in:fade class="text-2xl">{$_('Done')}!</p>
	{/if}
	{#if state === 'converts.start'}
		<p in:fade>{$_('Converting video')}!</p>
		<div class="progress-bar">
			<div class="progress" style:--progress="{$progress}%">
				{$progress.toFixed(0)}%
			</div>
		</div>
	{/if}
	{#if state === 'loading'}
		<p in:fade>{$_('Loading dependencies')}...</p>
	{/if}
	{#if state === 'loaded'}
		<div class="flex flex-col items-center gap-1">
			<UploadIcon />
			<p in:fade class="text-xl">{$_('Drag and drop a file')}</p>
			<p in:fade class="text-xl">{$_('Or Click')}!</p>
		</div>
	{/if}

	{#if error}
		<div use:confetti={{ colors: ['red'], particleShape: 'rectangles' }} />
		<p class="error text-2xl" in:fade>{error}</p>
	{/if}
</label>

<style>
	.drop {
		transition: all 0.3s ease-in-out;
		display: grid;
		place-content: center;
		width: 100%;
		height: 400px;
		max-width: 90vw;
		border: 2px dashed #ccc;
		border-radius: 7px;
		filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.2));
		box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.75);
	}
	@media (max-width: 768px) {
		.drop {
			height: 200px;
		}
	}
	.error {
		color: hsl(0, 100%, 64%);
		font-weight: 700;
	}
	.progress-bar {
		--progress-bar-clr: hsl(263, 100%, 50%);
		--progress-txt-clr: hsl(0, 0%, 100%);
		width: 90%;
		height: 2.5rem;
		position: relative;
		font-weight: 700;
		background-color: hsl(200, 100%, 14%);
		border-radius: 8px;
		box-shadow: -1px 1px 10px 0px rgba(0, 0, 0, 0.75);
	}

	.progress {
		width: var(--progress);
		height: 100%;
		position: absolute;
		left: 0px;
		display: grid;
		place-content: center;
		background: var(--progress-bar-clr);
		color: var(--progress-txt-clr);
		border-radius: 8px;
	}

	.drop:hover {
		background: #35353573;
	}
</style>
