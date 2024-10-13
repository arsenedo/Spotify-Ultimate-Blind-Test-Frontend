<script lang="ts">
	import ItemCard from "../Cards/ItemCard.svelte";

    export let items;
</script>

<div class="grid grid-cols-2 gap-3">
	{#each items as item}
		<ItemCard name={item.name} img={item.image.url} />
	{/each}
</div>
