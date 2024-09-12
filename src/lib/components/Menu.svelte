<script lang="ts">
	import { onMount } from 'svelte';
	import { name, players } from '../../stores';
	import { code } from '../../stores';
	import HostPage from './Host/HostPage.svelte';
	import InvitedPage from './Player/InvitedPage.svelte';

	let socket: WebSocket;

	const menu = {
		hostMenu: false,
		joinMenu: false
	};

	// Handle functions
	const handleHost = () => {
		if ($name.length === 0) return;
		registerPlayer('host');
	};

	const handleJoin = (event) => {
		if ($name.length === 0) return;
		registerPlayer('player', event.detail.code);
	};

	const handleJoinForm = () => {
		menu.hostMenu = false;
		menu.joinMenu = true;
	};

	const handleBack = () => {
		menu.hostMenu = false;
		menu.joinMenu = false;
	};

	/**
	 * Registers a player
	 * @param type defines if a player is a host (default = player)
	 * @param code code of the room if the player is joining a room
	 */
	function registerPlayer(type = 'player', code = '') {
		const data = {
			action: '',
			payload: {}
		};

		switch (type) {
			case 'host':
				data.action = 'registerHost';
				data.payload = {
					name : $name
				};
				break;
			case 'player':
				data.action = 'registerPlayer';
				data.payload = {
					name : $name,
					code
				};
				break;
			default:
				return;
		}
		socket.send(JSON.stringify(data));
	}

	onMount(() => {
		socket = new WebSocket('ws://localhost:8080');
		socket.addEventListener('open', () => {
			console.log('Connection opened');
		});

		socket.addEventListener('message', (event) => {
			const response = JSON.parse(event.data.toString());
			const data = response.data;
			switch (data.action) {
				case 'registerPlayer':
					console.log("A new player has registered", data.newPlayer)
					players.update((p) => {
						p.push(data.newPlayer);
						return p;
					});
					break;
				case 'registerHost':
					menu.hostMenu = true;
					menu.joinMenu = false;
					$code = data.code;
					$players.push($name);
					break;
			}
		});
	});
</script>

<div>
	<input bind:value={$name} placeholder="enter the name" />
	{#if menu.hostMenu}
		<HostPage on:back={() => handleBack()} />
	{:else if menu.joinMenu}
		<InvitedPage on:back={() => handleBack()} on:join={handleJoin} />
	{:else}
		<h1>Choose</h1>
		<button on:click={() => handleHost()}>Host</button>
		<button on:click={() => handleJoinForm()}>Join</button>
	{/if}
</div>
