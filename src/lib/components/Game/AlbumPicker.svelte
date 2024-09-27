<script lang="ts">
	import { spotify } from '$lib/stores/spotify';
	import axios from 'axios';

	let title: string;
	let isSearching: boolean;
	let onCooldown = false;
	let promise: Promise<any>;

	const searchAlbum = async () => {
		isSearching = true;
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
				isSearching = false;
				return resp.data;
			})
			.catch((e) => {
				console.log('Couldnt get the album...');
				return Promise.reject(e);
			});
		return await res.data;
	};

	const handleSearch = () => {
		if (title.length < 3 || isSearching) return;
		promise = searchAlbum();
	};
</script>

<div>
	Choose up to 5 albums
	<div>
		<input bind:value={title} on:keyup={handleSearch} />
		{#if promise}
			<div>
				{#await promise}
					<div>Fetching songs...</div>
				{:then data}
                {console.log(data)}
					{#each data.albums.items as album}
						{album.name}
					{/each}
				{/await}
			</div>
		{/if}
	</div>
</div>
