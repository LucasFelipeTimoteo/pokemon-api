import { PokemonIdError } from "./errors/pokemonIdError/pokemonIdError";

export class PokemonIdEntity {
	constructor(public pokemon_id: number) {
		this.validatePokemonId(pokemon_id);
	}

	validatePokemonId(this: PokemonIdEntity, pokemon_id: number): boolean {
		if (typeof pokemon_id !== "number") {
			throw new PokemonIdError(
				`Invalid pokemon_id. It must be a number, but received type: ${typeof pokemon_id}`,
			);
		}

		if (pokemon_id <= 0) {
			throw new PokemonIdError(
				`Invalid pokemon_id. It must be a number greather than 0, but received: ${pokemon_id}`,
			);
		}
		return true;
	}
}
