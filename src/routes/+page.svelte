<script lang="ts">
	import HostPage from '$lib/components/Host/HostPage.svelte';
	import InvitedPage from '$lib/components/Player/InvitedPage.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { name } from '../stores';
	import Menu from '$lib/components/Menu.svelte';
</script>

<div>
	<Menu/>
</div>
