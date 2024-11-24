import type { Pokemon } from "../../../domain/entities/pokemon/types/pokemon";
import type { RawPokemonDetails } from "../../clients/http/pokemon/types/rawPokemonDetails";
import type { RawPokemons } from "../../clients/http/pokemon/types/rawPokemons";

export type PokemonValidatorResponseSuccess<T> = {
	success: true;
	data: T;
};
export type PokemonValidatorResponseError<E> = {
	success: false;
	error: E;
};

export type PokemonValidatorResponse<T, E> =
	| PokemonValidatorResponseSuccess<T>
	| PokemonValidatorResponseError<E>;

export interface PokemonValidator<ErrorType> {
	rawPokemonDetails(
		rawPokemonFromApi: unknown,
	): PokemonValidatorResponse<RawPokemonDetails, ErrorType>;

	rawPokemons(
		rawPokemonsFromApi: unknown,
	): PokemonValidatorResponse<RawPokemons, ErrorType>;

	pokemon(
		unvalidatedPokemon: unknown,
	): PokemonValidatorResponse<Pokemon, ErrorType>;
}
