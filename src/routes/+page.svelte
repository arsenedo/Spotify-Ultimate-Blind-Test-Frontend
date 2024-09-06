<script lang="ts">
    import {onMount} from "svelte";
    let socket : WebSocket;

    // Function to send messages
    function registerPlayer() {
        const data = {
            action : "registerPlayer",
            payload : message
        }
        socket.send(JSON.stringify(data));
        message = '';
    }

    let message = "";
    let response = "";

    const menu =  {
        hostMenu : false,
        joinMenu : false,
    }

    const handleHost = () => {
        menu.hostMenu = true;
        menu.joinMenu = false;
    }

    const handleJoin = () => {
        menu.hostMenu = false;
        menu.joinMenu = true;
    }

    const handleBack = () => {
        menu.hostMenu = false;
        menu.joinMenu = false;
    }

    onMount(() => {
        socket = new WebSocket("ws://localhost:8080");
        socket.addEventListener("open", () => {
            console.log("Connection opened");
        });

        socket.addEventListener("message", (event) => {
            response = event.data.toString();
        });
    })
</script>
<div>
    {#if menu.hostMenu}
        <div>Welcome to the host menu</div>
        <button on:click={() => handleBack()}>Back</button>
    {:else if menu.joinMenu}
        <div>Welcome to join menu</div>
        <button on:click={() => handleBack()}>Back</button>
    {:else}
        <h1>Choose</h1>
        <button on:click={() => handleHost()}>Host</button>
        <button on:click={() => handleJoin()}>Join</button>
    {/if}
    <h1>Real time chat</h1>
    <input bind:value={message}/>
    <button on:click={() => registerPlayer()}>Send</button>
    <div>{response}</div>
</div>