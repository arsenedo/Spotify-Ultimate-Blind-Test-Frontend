<script lang="ts">
	import { spotify } from '$lib/stores/spotify';
	import websocket from '$lib/stores/websocket';
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';
	import { code, name } from '../../../stores';

	let title: string;
	let onCooldown = false;
	let promise: Promise<any>;
    let chosenSong;
	let error;
    let dispatch = createEventDispatcher();

	const searchAlbum = async () => {
        onCooldown = true;
		const res = await axios
			.get('https://api.spotify.com/v1/search', {
				headers: {
					Authorization: `${$spotify.token_type} ${$spotify.access_token}`
				},
				params: {
					q: `track:${title}`,
					type: 'track',
					limit: 5
				}
			})
			.then((resp) => {
                setTimeout(() => onCooldown = false, 500)
				return resp.data;
			})
			.catch((e) => {
				console.log('Couldnt get the songs...');
				return Promise.reject(e);
			});
		return await res;
	};

    const handleChooseSong = (song) => {
		console.log(song)

        chosenSong = {
            id : song.id,
            name : song.name,
            img : song.album.images[0].url
        };
    }

	const handleSearch = () => {
		if (title.length < 3 || onCooldown) return;
		promise = searchAlbum();
	};

	const handleReady = () => {
        const data = {
			action: 'chosenSong',
			payload: { song : chosenSong.name, code : $code, name : $name }
		};

		websocket.send(data);

        dispatch("songPicked", {
            song : chosenSong
        });
	}
</script>

<div>
	Choose your song
    <div>
        {#if chosenSong}
        <div>Chosen :</div>
        <div>
            {chosenSong.name}
        </div>
        {/if}
    </div>
	<div>
		<input bind:value={title} on:keyup={handleSearch} />
		{#if promise}
			<div>
				{#await promise}
					<div>Fetching songs</div>
				{:then data}
					{#each data.tracks.items as song}
                        <button class="h-6 bg-neutral-500 cursor-pointer" on:click={() => handleChooseSong(song)}>
                            {song.name}
                        </button>
					{/each}
				{/await}
			</div>
		{/if}
	</div>
    <div>
        <button class="bg-green-500 h-6 rounded-md" on:click={() => handleReady()}>Ready</button>
    </div>
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
</div>
