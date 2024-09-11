import { writable } from "svelte/store";

export const name = writable("");
export const code = writable("");
export const players = writable<string[]>([]);