<script lang="ts">
	import { spotify } from '$lib/stores/spotify';
	import axios from 'axios';

	let title: string;
	let onCooldown = false;
	let promise: Promise<any>;

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

	const handleSearch = () => {
		if (title.length < 3 || onCooldown) return;
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
					{#each data.albums.items as album}
						{album.name}
					{/each}
				{/await}
			</div>
		{/if}
	</div>
</div>
