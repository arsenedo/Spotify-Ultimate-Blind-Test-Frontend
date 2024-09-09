<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { code } from "../../../stores";

    export let players = [];

    const dispatch = createEventDispatcher();

    const handleBack = () => {
        dispatch('back');
    }
</script>
<div>
    <h1>Host menu</h1>
    <div>{code}</div>
    <div>
        Joined players :
        {#each players as player}
            <div>
                {player}
            </div>
        {/each}
    </div>
    <button on:click={() => console.log()}>Start</button>
</div>
<button on:click={() => handleBack()}>Back</button>