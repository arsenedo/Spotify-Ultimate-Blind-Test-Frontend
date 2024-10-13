<script lang="ts">
	import PlayerCard from '../Cards/ItemCard.svelte';
	import host from '$lib/images/host.webp';
	import invited from '$lib/images/invited.webp';

	export let players;
</script>

<div class="grid grid-cols-2 gap-3">
	{#each players as player, i}
		{#if i === 0}
			<PlayerCard name={player} img={host} />
		{:else}
			<PlayerCard name={player} img={invited} />
		{/if}
	{/each}
</div>
