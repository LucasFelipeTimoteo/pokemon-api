import type { Pokemon } from "../../pokemon/types/pokemon";

export interface User {
	username: string;
	age: number;
	userId?: string;
	pokemons: Pokemon[];
	password: string;
}
