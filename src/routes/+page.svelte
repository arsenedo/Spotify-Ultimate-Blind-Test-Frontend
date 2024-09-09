<script lang="ts">
	import HostPage from '$lib/components/Host/HostPage.svelte';
	import { onMount } from 'svelte';
	let socket: WebSocket;
	let name = '';
    let code = '';

    const menu = {
		hostMenu: false,
		joinMenu: false
	};

	/**
	 * Registers a player
	 * @param type defines if a player is a host (default = player)
	 */
	function registerPlayer(type = 'player') {
        const data = {
            action : "",
            payload : {}
        }

		switch (type) {
			case 'host':
				code = generateCode();
				data.action = "registerHost";
                data.payload = {
                    code,
                    name
                };
				break;
			case 'player':
                data.action = "registerPlayer";
                data.payload = {
                    name
                }
			default:
                return;
		}
		socket.send(JSON.stringify(data));
	}

    // Handle functions
	const handleHost = () => {
		if (name.length === 0) return;
		registerPlayer('host');
		menu.hostMenu = true;
		menu.joinMenu = false;
	};

	const handleJoin = () => {
		if (name.length === 0) return;
		registerPlayer();
		menu.hostMenu = false;
		menu.joinMenu = true;
	};

	const handleBack = () => {
		menu.hostMenu = false;
		menu.joinMenu = false;
	};
    // End handle functions

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
	<h1>Real time chat</h1>
	<input bind:value={name} placeholder="enter the name" />
	{#if menu.hostMenu}
		<HostPage on:back={() => handleBack()} code={code}/>
	{:else if menu.joinMenu}
		<div>Welcome to join menu</div>
		<button on:click={() => handleBack()}>Back</button>
	{:else}
		<h1>Choose</h1>
		<button on:click={() => handleHost()}>Host</button>
		<button on:click={() => handleJoin()}>Join</button>
	{/if}
</div>
