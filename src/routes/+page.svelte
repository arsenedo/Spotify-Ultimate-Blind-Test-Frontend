<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import { spotify } from '$lib/stores/spotify';

	export let data;

	spotify.set(data);
</script>

<div>
	<Menu/>
</div>
