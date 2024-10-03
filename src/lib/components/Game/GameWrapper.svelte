<script lang="ts">
	import websocket from "$lib/stores/websocket";
	import { onMount } from "svelte";
	import { code, name } from "../../../stores";
	import SongPicker from "../Pickers/SongPicker.svelte";

	let chosenSong;
    export let song;

	const handleChoiceMade = (e) => {
		chosenSong = e.detail.song;
	}

    onMount(() => {
        console.log("Mounted!");
		const data = {
			action: 'playerLoaded',
			payload: { name : $name, code : $code }
		};

		websocket.send(data);
    });
</script>
<div>Here will be the game!</div>
{#if song}
	{#if !chosenSong}
		<SongPicker on:songPicked={handleChoiceMade}/>
	{:else if chosenSong}
		<div>Choice made, waiting for results...</div>
	{/if}
{/if}