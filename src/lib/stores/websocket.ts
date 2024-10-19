import { writable } from "svelte/store";

const { subscribe, set } = writable({
    isConnected : false,
    actionData : null,
});

let socket : WebSocket;

if (typeof window !== 'undefined') {
    socket = new WebSocket('ws://localhost:8080');
    
    socket.addEventListener('open', () => {
        console.log('Connection opened');
        set({ isConnected: true, actionData: null });
    });
    
    socket.addEventListener('message', (event) => {
        console.log("message received")
        const actionData = JSON.parse(event.data.toString());
        set({ isConnected: true, actionData });
    });
    
    socket.addEventListener('close', () => {
        console.log('Connection closed');
        set({ isConnected: false, actionData: null });
    });
}



export default {
    subscribe,
    send: (message: any) => {
        socket.send(JSON.stringify(message));
    }
};