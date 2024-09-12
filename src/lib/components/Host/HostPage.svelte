<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { code, isStarted, minPlayers } from '../../../stores';
	import { players } from '../../../stores';

	const dispatch = createEventDispatcher();

	const handleBack = () => {
		dispatch('back');
	};

	const handleStart = () => {
		if ($players.length < $minPlayers) return;
		dispatch('start');
	}
</script>

<div>
	<h1>Host menu</h1>
	<div>{$code}</div>
	<div>
		Joined players :
		{#each $players as player}
			<div>
				{player}
			</div>
		{/each}
	</div>
	<button on:click={() => handleStart()}>Start</button>
</div>
<button on:click={() => handleBack()}>Back</button>
