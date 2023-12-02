import path from 'path';

export const removeFileExtension = (name: string) => name.replace(/\.[^/.]+$/, '');

const readFromBlobOrFile = (blob: Blob | File): Promise<Uint8Array> =>
	new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = () => {
			const { result } = fileReader;
			if (result instanceof ArrayBuffer) {
				resolve(new Uint8Array(result));
			} else {
				resolve(new Uint8Array());
			}
		};
		fileReader.onerror = (event) => {
			reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));
		};
		fileReader.readAsArrayBuffer(blob);
	});

export const fetchFile = async (file?: string | File | Blob): Promise<Uint8Array> => {
	let data: ArrayBuffer | number[];

	if (typeof file === 'string') {
		/* From base64 format */
		if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
			data = atob(file.split(',')[1])
				.split('')
				.map((c) => c.charCodeAt(0));
			/* From remote server/URL */
		} else {
			data = await (await fetch(file)).arrayBuffer();
		}
	} else if (file instanceof URL) {
		data = await (await fetch(file)).arrayBuffer();
	} else if (file instanceof File || file instanceof Blob) {
		data = await readFromBlobOrFile(file);
	} else {
		return new Uint8Array();
	}

	return new Uint8Array(data);
};

export async function readFile(file: File): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.onload = () => {
			const { result } = fileReader;
			if (result instanceof ArrayBuffer) {
				resolve(new Uint8Array(result));
			} else {
				resolve(new Uint8Array());
			}
		};

		fileReader.onerror = (event) => {
			reject(event);
		};

		fileReader.readAsArrayBuffer(file);
	});
}

export function downloadVideo(data: Uint8Array, fileName = 'output') {
	const a = document.createElement('a');
	a.href = URL.createObjectURL(new Blob([data], { type: 'audio/mp3' }));
	a.download = `${fileName}.mp3`;
	setTimeout(() => {
		a.click();
		a.remove();
	}, 1000);
}
