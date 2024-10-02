<script lang="ts">
	import websocket from "$lib/stores/websocket";
	import { onMount } from "svelte";
	import { code, name } from "../../../stores";

    export let song;

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
    <div>Received a song!song name : {song.name}</div>
{/if}