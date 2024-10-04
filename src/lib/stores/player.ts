import { writable } from 'svelte/store';

const initialState = {
    name: '',
    states: {
        gameDataPicked: false,
        ready: false
    },
    score: 0,
    prevScore : 0
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
        updateScore: (points) => update((n) => {
            return {...n, prevScore: n.score, score: n.score+points}
        }),
        reset: set(initialState)
	};
}

export const playerStore = createPlayer();
