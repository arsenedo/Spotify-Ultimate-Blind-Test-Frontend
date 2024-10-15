<script lang="ts">
	import { spotify } from '$lib/stores/spotify';
	import websocket from '$lib/stores/websocket';
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';
	import { code, name } from '../../../stores';

	let title: string;
	let onCooldown = false;
	let promise;
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

		title = "";
		promise = undefined;
    }

	const handleSearch = () => {
		if(title.length < 3) {
			promise = undefined;
			return
		}
		if (!title || onCooldown) return;
		promise = searchAlbum();
	};

	const handleReady = () => {
        const data = {
			action: 'songPicked',
			payload: { song : chosenSong.name, code : $code, name : $name }
		};

		websocket.send(data);

        dispatch("songPicked", {
            song : chosenSong
        });
	}
</script>

<div class="text-white flex flex-col justify-end items-center gap-5 h-full w-full">
    <div class="text-white w-full h-full pt-3 pb-3">
        {#if chosenSong}
		<div>Chosen :</div>
		<div class="w-full h-full flex justify-center items-end bg-center bg-cover" style={`background-image: url(${chosenSong.img});`}>
			<div class="bg-neutral-700 bg-opacity-50 backdrop-blur w-full h-1/6 text-2xl text-center text-white flex justify-center items-center text-ellipsis overflow-hidden whitespace-nowrap">
				{chosenSong.name}
			</div>
		</div>
        {/if}
    </div>
	<div class="w-full relative">
		{#if promise}
			<div class="absolute -top-[370px] w-full bg-neutral-800 rounded-md pr-2">
				<div class="grid grid-rows-1 gap-2">
					{#await promise}
						<div>Fetching albums...</div>
					{:then data}
						{#each data.tracks.items as song}
							<a
								on:click={() => handleChooseSong(song)}
								href="#"
								class="block w-full h-16 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-neutral-200"
							>
								<div class="w-full h-full flex justify-between items-center gap-2">
									<img class="h-full" src={song.album.images[2].url} alt="album_img" />
									<div>{song.name}</div>
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
        <button class="h-12 bg-spotifyGreen rounded-full w-full" on:click={() => handleReady()}>Ready</button>
    </div>
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
</div>
