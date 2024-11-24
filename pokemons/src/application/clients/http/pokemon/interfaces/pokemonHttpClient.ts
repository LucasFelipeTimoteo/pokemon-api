import type { PokemonValidatorResponse } from "../../../../validation/pokemon/pokemonValidator";
import type { RawPokemonDetails } from "../types/rawPokemonDetails";

export interface PokemonHttpClient {
	getOne(
		pokemonId: number,
	): Promise<PokemonValidatorResponse<RawPokemonDetails, unknown>>;
	getAll(): Promise<PokemonValidatorResponse<RawPokemonDetails, unknown>[]>;
}
