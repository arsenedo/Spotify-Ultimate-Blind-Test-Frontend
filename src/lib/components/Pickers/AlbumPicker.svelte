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

	$ : if(externalError) {
		error = externalError,
		chosenAlbums = [];
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
                setTimeout(() => onCooldown = false, 500)
				return resp.data;
			})
			.catch((e) => {
				console.log('Couldnt get the album...');
				return Promise.reject(e);
			});
		return await res;
	};

    const handleChooseAlbum = (album) => {
		console.log(album)
		const newAlbum = {
			id : album.id,
			name : album.name,
			image : album.images[0]
		}
        chosenAlbums = [...chosenAlbums, newAlbum];
		if (chosenAlbums.length >= 2) error = "";
    }

	const handleSearch = () => {
		if (title.length < 3 || onCooldown) return;
		promise = searchAlbum();
	};

	const handleReady = () => {
		if (chosenAlbums.length < 2) {
			error = "You must choose at least 2 albums to start the game!";
			return
		}

		const data = {
			action: 'appendAlbums',
			payload: { albums : chosenAlbums, code : $code }
		};

		websocket.send(data);
	}
</script>

<div class="text-white h-screen flex flex-col justify-between items-center w-full">
	<h1 class="text-2xl text-center pt-3">Choose up to 5 albums</h1>
    <div>
        <div>Chosen :</div>
        <SongList items={chosenAlbums}/>
    </div>
	<div>
		<input bind:value={title} on:keyup={handleSearch} />
		{#if promise}
			<div>
				{#await promise}
					<div>Fetching albums...</div>
				{:then data}
					{#each data.albums.items as album}
                        <button class="h-6 bg-neutral-500 cursor-pointer" on:click={() => handleChooseAlbum(album)}>
                            {album.name}
                        </button>
					{/each}
				{/await}
			</div>
		{/if}
	</div>
	<div class="pb-2 w-full">
		<button class="h-12 bg-spotifyGreen rounded-full w-full" on:click={() => handleReady()}>Ready</button>
	</div>
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
</div>
