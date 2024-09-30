<script lang="ts">
	import { isStarted, name, players } from '../../stores';
	import { code } from '../../stores';
	import HostPage from './Host/HostPage.svelte';
	import InvitedPage from './Player/InvitedPage.svelte';
	import Game from './Game.svelte';
	import websocket from '$lib/stores/websocket';

	const menu = {
		hostMenu: false,
		joinMenu: false
	};

	const unsubscribe = websocket.subscribe(ws => {
		if (ws.actionData) {
			const data = ws.actionData.data;
			switch (data.action) {
				case 'registerPlayer':
					players.set(data.players);
					$code = data.code;
					break;
				case 'registerHost':
					menu.hostMenu = true;
					menu.joinMenu = false;
					$code = data.code;
					$players.push($name);
					break;
				case 'startGame':
					menu.hostMenu = false;
					menu.joinMenu = false;
					$isStarted = true;
					break;
				case 'error' :
					console.error(ws.actionData.msg)
					break;
			}
		}
	});

	// Handle functions
	const handleHost = () => {
		if ($name.length === 0) return;
		registerPlayer('host');
	};

	const handleJoin = (event: any) => {
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
					name: $name
				};
				break;
			case 'player':
				data.action = 'registerPlayer';
				data.payload = {
					name: $name,
					code
				};
				break;
			default:
				return;
		}
		websocket.send(data);
	}

	function startGame() {
		const data = {
			action: 'startGame',
			payload: {
				code: $code
			}
		};

		websocket.send(data);
	}
</script>

<div>
	{#if menu.hostMenu}
		<HostPage on:back={() => handleBack()} on:start={() => startGame()}/>
	{:else if menu.joinMenu}
		<InvitedPage on:back={() => handleBack()} on:join={handleJoin} />
	{:else if $isStarted}
		<Game />
	{:else}
		<input bind:value={$name} placeholder="enter the name" />
		<h1>Choose</h1>
		<button on:click={() => handleHost()}>Host</button>
		<button on:click={() => handleJoinForm()}>Join</button>
	{/if}
</div>
