<script lang="ts">
	import { spotify } from '$lib/stores/spotify';
	import websocket from '$lib/stores/websocket';
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';
	import { code } from '../../../stores';
	import SongList from '../Lists/SongList.svelte';

	let title: string;
	let onCooldown = false;
	let promise: Promise<any>;
	let chosenAlbums = [];
	let error;
	export let externalError;

	$: if (externalError) {
		(error = externalError), (chosenAlbums = []);
	}

	const searchAlbum = async () => {
		onCooldown = true;
		const res = await axios
			.get('https://api.spotify.com/v1/search', {
				headers: {
					Authorization: `${$spotify.token_type} ${$spotify.access_token}`
				},
				params: {
					q: `album:${title}`,
					type: 'album',
					limit: 5
				}
			})
			.then((resp) => {
				setTimeout(() => (onCooldown = false), 500);
				return resp.data;
			})
			.catch((e) => {
				console.log('Couldnt get the album...');
				return Promise.reject(e);
			});
		return await res;
	};

	const handleChooseAlbum = (album) => {
		const newAlbum = {
			id: album.id,
			name: album.name,
			image: album.images[0]
		};
		chosenAlbums = [...chosenAlbums, newAlbum];
		if (chosenAlbums.length >= 2) error = '';

		return false;
	};

	const handleSearch = () => {
		if (title.length < 3) {
			promise = undefined;
			return
		}
		if (onCooldown) return;
		promise = searchAlbum();
	};

	const handleReady = () => {
		if (chosenAlbums.length < 2) {
			error = 'You must choose at least 2 albums to start the game!';
			return;
		}

		const data = {
			action: 'appendAlbums',
			payload: { albums: chosenAlbums, code: $code }
		};

		websocket.send(data);
	};
</script>

<div class="text-white flex flex-col justify-around items-center h-full w-full">
	<h1 class="text-2xl text-center pt-3">Choose up to 5 albums</h1>
	<div class="h-3/5 w-full">
		<div class="h-full overflow-y-auto">
			<SongList items={chosenAlbums} />
		</div>
	</div>
	<div class="w-full relative">
		{#if promise}
			<div class="absolute -top-[370px] w-full bg-neutral-800 rounded-md pr-2">
				<div class="grid grid-rows-1 gap-2">
					{#await promise}
						<div>Fetching albums...</div>
					{:then data}
						{#each data.albums.items as album}
							<a on:click={() => handleChooseAlbum(album)} href="#" class="block w-full h-16 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-neutral-200">
								<div class="w-full h-full flex justify-between items-center gap-2">
									<img class="h-full" src={album.images[2].url} alt="album_img" />
									<div>{album.name}</div>
								</div>
							</a>
						{/each}
					{/await}
				</div>
			</div>
		{/if}
		<input
			bind:value={title}
			on:keyup={handleSearch}
			class="rounded-full h-10 w-full text-center p-1 box-border text-white placeholder:text-neutral-400 bg-neutral-700 focus:ring focus:ring-spotifyGreen focus:outline-none"
		/>
	</div>
	<div class="pb-2 w-full">
		<button class="h-12 bg-spotifyGreen rounded-full w-full" on:click={() => handleReady()}
			>Ready</button
		>
	</div>
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
</div>
