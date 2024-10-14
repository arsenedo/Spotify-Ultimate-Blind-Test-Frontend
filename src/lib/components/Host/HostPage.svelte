<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { code, isStarted, minPlayers } from '../../../stores';
	import { players } from '../../../stores';
	import spotifyLogo from '$lib/images/spotify_logo.png';
	import PlayerCard from '../Cards/ItemCard.svelte';
	import PlayerList from '../Lists/PlayerList.svelte';

	const dispatch = createEventDispatcher();

	const handleBack = () => {
		dispatch('back');
	};

	const handleStart = () => {
		if ($players.length < $minPlayers) return;
		dispatch('start');
	};
</script>

<div class="flex flex-col justify-between gap-3 h-full">
	<div class="flex justify-center items-center">
		<img src={spotifyLogo} alt="spotify_logo" class="w-2/6 pt-2" />
	</div>
	<div class="text-white h-3/5">
		<h1 class="text-6xl text-center">{$code}</h1>
		<div class="h-full overflow-y-auto">
			<PlayerList players={$players} />
		</div>
	</div>
	<div class="flex flex-col gap-2 pb-2">
		<button on:click={() => handleStart()} class="h-12 bg-spotifyGreen rounded-full">Start</button>
		<button
			on:click={() => handleBack()}
			class="h-12 border border-white bg-black text-white rounded-full">Back</button
		>
	</div>
</div>
