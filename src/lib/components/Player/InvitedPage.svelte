<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { players } from '../../../stores';
	import PlayerList from './PlayerList.svelte';

	let code = '';

	const dispatch = createEventDispatcher();

	const handleJoin = () => {
		dispatch('join', {
			code
		});
	};
</script>

<div class="w-full text-white">
{#if $players.length > 0}
	<h1 class="text-6xl text-center">{code}</h1>
	<PlayerList players={$players} />
	Waiting for the host to start the game...
{:else}
	<div class="text-white flex flex-col items-center justify-center w-full gap-5">
		<h1>Enter room code</h1>
		<input
			bind:value={code}
			class="w-full rounded-full h-10 text-center p-1 box-border text-white placeholder:text-neutral-400 bg-neutral-700 focus:ring focus:ring-spotifyGreen focus:outline-none"
		/>
		<button on:click={() => handleJoin()} class="w-full h-12 bg-spotifyGreen rounded-full">Join</button>
	</div>
{/if}
</div>
