<script lang="ts">
	import { spotify } from '$lib/stores/spotify';
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';

	let title: string;
	let onCooldown = false;
	let promise: Promise<any>;
    let chosenAlbums = [];

    const dispatch = createEventDispatcher();

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
                setTimeout(() => onCooldown = false, 1000)
				return resp.data;
			})
			.catch((e) => {
				console.log('Couldnt get the album...');
				return Promise.reject(e);
			});
		return await res;
	};

    const handleChooseAlbum = (album) => {
        chosenAlbums = [...chosenAlbums, album];
    }

	const handleSearch = () => {
		if (title.length < 3 || onCooldown) return;
		promise = searchAlbum();
	};
</script>

<div>
	Choose up to 5 albums
    <div>
        <div>Chosen :</div>
        {#each chosenAlbums as album}
            <div>
                {album.name}
            </div>
        {/each}
    </div>
	<div>
		<input bind:value={title} on:keyup={handleSearch} />
		{#if promise}
			<div>
				{#await promise}
					<div>Fetching songs...</div>
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
    <div>
        <button class="bg-green-500 h-6 rounded-md" on:click={() => dispatch('ready', { chosenAlbums })}>Ready</button>
    </div>
</div>
