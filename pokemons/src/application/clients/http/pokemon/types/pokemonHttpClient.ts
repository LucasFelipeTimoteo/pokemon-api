import type { PokemonValidatorResponse } from "../../../../validation/pokemon/pokemonValidator";
import type { RawPokemonDetails } from "./rawPokemonDetails";

export interface PokemonHttpClient {
	getOne(
		pokemonId: number,
	): Promise<PokemonValidatorResponse<RawPokemonDetails, unknown>>;
	getAll(): Promise<PokemonValidatorResponse<RawPokemonDetails, unknown>[]>;
}
