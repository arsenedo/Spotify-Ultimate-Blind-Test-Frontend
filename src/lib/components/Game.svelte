<script lang="ts">
	import websocket from "$lib/stores/websocket";
	import { onMount } from "svelte";
	import { code, name } from "../../stores";
	import AlbumPicker from "./Game/AlbumPicker.svelte";

	const unsubscribe = websocket.subscribe(ws => {
		if (ws.actionData) {
			const data = ws.actionData.data;
			console.log(data.action)
			switch (data.action) {
				case 'playerReady' :
                    console.log("Im ready!");
			}
		}
	});


    const playerReady = () => {
        const data = {
            action : "playerReady",
            payload : {
                name : $name,
                code : $code,
            }
        }
        websocket.send(data)
    };

    const handleReady = (data) => {
        console.log(data.detail)
    }

</script>

<div><AlbumPicker on:ready={handleReady}/></div>