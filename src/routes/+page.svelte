<script lang="ts">
    import {onMount} from "svelte";
    let socket : WebSocket;

    // Function to send messages
    function sendMessage() {
        socket.send(message);
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
    <button on:click={() => sendMessage()}>Send</button>
    <div>{response}</div>
</div>