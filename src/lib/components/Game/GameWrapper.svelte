<script lang="ts">
	import websocket from '$lib/stores/websocket';
	import { onDestroy, onMount } from 'svelte';
	import { code, name } from '../../../stores';
	import SongPicker from '../Pickers/SongPicker.svelte';
	import { playerStore } from '$lib/stores/player';
	import { Howl } from 'howler';

	let chosenSong: string;

	$: player = $playerStore;

	export let song;

	let pointsWon;
	let player;
	let sound;

	$: pointsWon = player.score - player.prevScore;
	$: console.log(song);
	$: if (!song) {
		chosenSong = '';
		
		if(sound) {
			sound.stop()
			sound = undefined;
		}
	}
	$: if (song) {
		sound = new Howl({
			src: [song['preview_url']],
			format: ['mp3'],
			autoplay: true,
			volume: 1,
		});
	}

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

	onDestroy(() => {
		if(sound) {
			sound.stop();
		}
	})
</script>

<div class="text-white w-full h-full flex flex-col justify-between items-center">
	{#if song}
		<div class="text-4xl pt-3 pb-3">Choose your song</div>
		<div>
			<img src={song.album.images[1].url} alt="album_img" class="blur-md" />
		</div>
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
