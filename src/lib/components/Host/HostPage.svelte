<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { code, isStarted, minPlayers } from '../../../stores';
	import { players } from '../../../stores';
	import spotifyLogo from '$lib/images/spotify_logo.png';
	import host from '$lib/images/host.webp';
	import invited from '$lib/images/invited.webp';
	import PlayerCard from '../Player/PlayerCard.svelte';

	const dispatch = createEventDispatcher();

	const handleBack = () => {
		dispatch('back');
	};

	const handleStart = () => {
		if ($players.length < $minPlayers) return;
		dispatch('start');
	}
</script>

<div class="h-screen flex flex-col justify-between w-full gap-5">
	<div class="flex justify-center items-center">
		<img src={spotifyLogo} alt="spotify_logo" class="w-2/6 pt-2"/>
	</div>
	<div class="text-white flex-1">
		<h1 class="text-6xl text-center mt-2 mb-5">{$code}</h1>
		<div class="grid grid-cols-2 gap-3">
			{#each $players as player, i}
				{#if i === 0}
					<PlayerCard name={player} img={host} />
				{:else}
					<PlayerCard name={player} img={invited} />
				{/if}
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2 pb-2">
		<button on:click={() => handleStart()} class="h-12 bg-spotifyGreen rounded-full">Start</button>
		<button on:click={() => handleBack()} class="h-12 border border-white bg-black text-white rounded-full">Back</button>
	</div>
</div>
