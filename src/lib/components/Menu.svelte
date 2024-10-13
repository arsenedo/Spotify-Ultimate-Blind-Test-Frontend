<script lang="ts">
	import { isStarted, name, players } from '../../stores';
	import { code } from '../../stores';
	import HostPage from './Host/HostPage.svelte';
	import InvitedPage from './Player/InvitedPage.svelte';
	import Game from './Game.svelte';
	import websocket from '$lib/stores/websocket';
	import spotifyLogo from '$lib/images/spotify_logo.png';

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

<div class="w-5/6 flex flex-col items-center justify-center gap-5 m-auto h-full">
	{#if menu.hostMenu}
		<HostPage on:back={() => handleBack()} on:start={() => startGame()}/>
	{:else if menu.joinMenu}
		<InvitedPage on:back={() => handleBack()} on:join={handleJoin} />
	{:else if $isStarted}
		<Game />
	{:else}
	<div class="flex justify-center items-center">
		<img src={spotifyLogo} alt="spotify_logo" class="w-2/3"/>
	</div>
	<div class="flex flex-col w-full gap-5">
		<input bind:value={$name} placeholder="enter the name" class="rounded-full h-10 text-center p-1 box-border text-white placeholder:text-neutral-400 bg-neutral-700 focus:ring focus:ring-spotifyGreen focus:outline-none"/>
		<div class="flex flex-col gap-2">
			<button on:click={() => handleHost()} class="h-12 bg-spotifyGreen rounded-full">Host</button>
			<button on:click={() => handleJoinForm()} class="h-12 border border-white bg-black text-white rounded-full">Join</button>
		</div>
	</div>
	{/if}
</div>
