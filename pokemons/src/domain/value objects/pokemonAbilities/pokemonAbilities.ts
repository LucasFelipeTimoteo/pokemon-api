import type { Ability } from "../../entities/pokemon/types/pokemon";
import { PokemonAbilitiesError } from "./errors/pokemonAbilitiesErrors/pokemonAbilitiesError";

export class PokemonAbilities {
	constructor(public abilities: Ability[]) {
		this.validateAbilities(abilities);
	}

	validateAbilities(this: PokemonAbilities, abilities: Ability[]): boolean {
		if (!Array.isArray(abilities) || abilities.length === 0) {
			throw new PokemonAbilitiesError(
				"Invalid abilities. It must be a non-empty array",
			);
		}
		abilities.forEach((ability) => {
			if (typeof ability.name !== "string") {
				throw new PokemonAbilitiesError(
					`Invalid ability name. It must be a string, but received type: ${typeof ability.name}`,
				);
			}

			if (!ability.name) {
				throw new PokemonAbilitiesError(
					`Invalid ability name. It name must not be empty, but received: ${ability.name}`,
				);
			}
		});
		return true;
	}
}
