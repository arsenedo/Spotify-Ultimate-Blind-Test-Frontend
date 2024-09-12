<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { players } from '../../../stores';

	let code = '';

	const dispatch = createEventDispatcher();

	const handleJoin = () => {
		dispatch('join', {
			code
		});
	};
</script>

<div>
	{#if $players.length > 0}
		Joined players :
		{#each $players as player}
			<div>{player}</div>
		{/each}
        Waiting for the host to start the game...
	{:else}
		<h1>Enter room code</h1>
		<input bind:value={code} />
		<button on:click={() => handleJoin()}>Join</button>
	{/if}
</div>
