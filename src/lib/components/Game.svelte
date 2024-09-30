<script lang="ts">
	import websocket from '$lib/stores/websocket';
	import { onMount } from 'svelte';
	import { code, name } from '../../stores';
	import AlbumPicker from './Game/AlbumPicker.svelte';
	import { playerStore } from '$lib/stores/player';

	let player;

	$: player = $playerStore;

    let error;

	const unsubscribe = websocket.subscribe((ws) => {
		if (ws.actionData) {
			const data = ws.actionData.data;
			switch (data.action) {
				case 'playerReady':
					console.log('Im ready!');
                    break;
				case 'appendAlbums':
					if(ws.actionData.code === 200) {
                        handleReady();
                    }
                    if(ws.actionData.code === 207) {
                        error = `The following albums couldn't be added : ${data.existingAlbums.map(album => album.name).join(', ')}`
                    }
                    break;
			}
		}
	});

	const playerReady = () => {
		const data = {
			action: 'playerReady',
			payload: {
				name: $name,
				code: $code
			}
		};
		websocket.send(data);
	};

    const handleReady = () => {
        playerReady();
    }
</script>

{#if !player.states.gameDataPicked}
	<div><AlbumPicker externalError={error}/></div>
{/if}
