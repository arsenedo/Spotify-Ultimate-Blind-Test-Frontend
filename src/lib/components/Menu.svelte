<script lang="ts">
	import { onMount } from "svelte";
    import { name } from "../../stores";
    import { code } from "../../stores";
	import HostPage from "./Host/HostPage.svelte";
	import InvitedPage from "./Player/InvitedPage.svelte";

    let socket: WebSocket;

	const menu = {
		hostMenu: false,
		joinMenu: false
	};

	// Handle functions
	const handleHost = () => {
		if ($name.length === 0) return;
		registerPlayer('host');
		menu.hostMenu = true;
		menu.joinMenu = false;
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
				code = generateCode();
				data.action = 'registerHost';
				data.payload = {
					code,
					name
				};
				break;
			case 'player':
				data.action = 'registerPlayer';
				data.payload = {
					name,
					code
				};
			default:
				return;
		}
		socket.send(JSON.stringify(data));
	}

	// Utils
	const generateCode = () => {
		const numbers = 5;
		let code = '';
		for (let i = 0; i < numbers; i++) {
			if (i === 0) {
				code += Math.floor(Math.random() * 9) + 1;
				continue;
			}
			code += Math.floor(Math.random() * 10);
		}
		return code;
	};
	// End utils

	onMount(() => {
		socket = new WebSocket('ws://localhost:8080');
		socket.addEventListener('open', () => {
			console.log('Connection opened');
		});

		socket.addEventListener('message', (event) => {
			console.log(event.data.toString());
		});
	});
</script>

<div>
    <div>{$name}</div>
	<input bind:value={$name} placeholder="enter the name" />
	{#if menu.hostMenu}
		<HostPage on:back={() => handleBack()}/>
	{:else if menu.joinMenu}
		<InvitedPage on:back={() => handleBack()} on:join={handleJoin} />
	{:else}
		<h1>Choose</h1>
		<button on:click={() => handleHost()}>Host</button>
		<button on:click={() => handleJoinForm()}>Join</button>
	{/if}
</div>
