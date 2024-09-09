<script lang="ts">
	import { createEventDispatcher } from "svelte";

    let code = "";

    const dispatch = createEventDispatcher();

    const handleJoin = () => {
        dispatch("join", {
            code
        })
    }
</script>
<div>
    <h1>Enter room code</h1>
    <input bind:value={code}/>
    <button on:click={() => handleJoin()}>Join</button>
</div>