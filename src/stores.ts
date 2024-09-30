import { readable, writable } from "svelte/store";

export const name = writable("");
export const code = writable("");
export const players = writable<string[]>([]);
export const isStarted = writable(false);
export const allPickedGameData = writable(false);
export const minPlayers = readable(2);
export const minItems = readable(2);
export const maxItems = readable(10);
export const gameData = writable([]);