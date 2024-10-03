<script lang="ts">
	import websocket from '$lib/stores/websocket';
	import { onMount } from 'svelte';
	import { allPickedGameData, code, name } from '../../stores';
	import AlbumPicker from './Pickers/AlbumPicker.svelte';
	import { playerStore } from '$lib/stores/player';
	import { gameData } from '../../stores';
	import GameWrapper from './Game/GameWrapper.svelte';

	let player;
	let score;

	$: player = $playerStore;

	let error;
	let song;

	const unsubscribe = websocket.subscribe((ws) => {
		if (ws.actionData) {
			const data = ws.actionData.data;
			switch (data.action) {
				case 'playerReady':
					playerStore.setState({ ready: true });
					playerStore.setState({ gameDataPicked: true });
					break;
				case 'appendAlbums':
					if (ws.actionData.code === 200) {
						handleReady();
					}
					if (ws.actionData.code === 207) {
						error = `The following albums couldn't be added : ${data.existingAlbums.map((album) => album.name).join(', ')}`;
					}
					break;
				case 'allReady':
					$allPickedGameData = true;
					console.log('All players are ready!');
					break;
				case 'songReceive':
					song = data.song;
					break;
				case 'songPicked':
					score = data.score;
					console.log(score);
					break;
				case 'roundOver':
					prepareNextRound();
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
	};
	
	const prepareNextRound = () => {
		console.log("Round over, getting ready for the next one!");
	}
</script>

{#if !player.states.gameDataPicked}
	<div><AlbumPicker externalError={error} /></div>
{:else if player.states.ready && !$allPickedGameData}
	<div>Waiting for other players to pick albums</div>
{:else if $allPickedGameData}
	<GameWrapper {song} />
{/if}
