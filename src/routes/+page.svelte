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
    <h1>Real time chat</h1>
    <input bind:value={message}/>
    <button on:click={() => registerPlayer()}>Send</button>
    <div>{response}</div>
</div>