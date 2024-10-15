<script lang="ts">
	import websocket from '$lib/stores/websocket';
	import { onMount } from 'svelte';
	import { code, name } from '../../../stores';
	import SongPicker from '../Pickers/SongPicker.svelte';
	import { playerStore } from '$lib/stores/player';

	let chosenSong: string;

	$: player = $playerStore;

	export let song;

	let pointsWon;

	$: pointsWon = player.score - player.prevScore;
	$: console.log(song);
	$: if(!song) {
		chosenSong = ""
	};

	const handleChoiceMade = (e) => {
		chosenSong = e.detail.song;
	};

	onMount(() => {
		console.log('Mounted!');
		const data = {
			action: 'playerLoaded',
			payload: { name: $name, code: $code }
		};

		websocket.send(data);
	});
</script>

<div class="text-white">
	{#if song}
		{#if !chosenSong}
			<SongPicker on:songPicked={handleChoiceMade} />
		{:else if chosenSong}
			<div>Choice made, waiting for results...</div>
		{/if}
	{:else}
		{#if player.score > player.prevScore}
			<div>Congratulations, you won {pointsWon} points!</div>
		{:else}
			<div>Wrong song!</div>
		{/if}
		<div>Your score is : {player.score}</div>
	{/if}
</div>
