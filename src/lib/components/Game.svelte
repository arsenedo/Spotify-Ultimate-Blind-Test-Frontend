<script lang="ts">
	import websocket from "$lib/stores/websocket";
	import { onMount } from "svelte";
	import { code, name } from "../../stores";

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

    onMount(() => {
        playerReady();
    })
</script>

<div>Game started!</div>