import { writable } from 'svelte/store';

const initialState = {
    name: '',
    states: {
        gameDataPicked: false,
        ready: false
    }
}

function createPlayer() {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		setName: (newName) => update((n) => ({ ...n, name: newName })),
        setState: (newState) => update((n) => ({ 
            ...n, 
            states: { 
                ...n.states, 
                ...newState // Spread the newState correctly
            } 
        })),
        reset: set(initialState)
	};
}

export const playerStore = createPlayer();
