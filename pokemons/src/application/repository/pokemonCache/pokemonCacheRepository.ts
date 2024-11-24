import type { Pokemon } from "../../../domain/entities/pokemon/types/pokemon";
import type { PokemonValidatorResponseError } from "../../validation/pokemon/pokemonValidator";

export interface PokemonChacheRepository {
	saveList(
		pokemonList: Pokemon[],
	): Promise<boolean | PokemonValidatorResponseError<unknown>[]>;
	saveOne(
		pokemon: Pokemon,
	): Promise<boolean | PokemonValidatorResponseError<unknown>>;

	pokemonExists(pokemonId: number): Promise<boolean>;
	getPokemon(pokemonId: number): Promise<Pokemon | null>;
	pokemonListExists(): Promise<boolean>;
	getPokemonList(): Promise<Pokemon[] | null>;
}
