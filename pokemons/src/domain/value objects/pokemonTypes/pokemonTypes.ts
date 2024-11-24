import type { Type } from "../../entities/pokemon/types/pokemon";
import { PokemonTypesError } from "./errors/pokemonTypesError/pokemonTypesError";

export class PokemonTypes {
	constructor(public types: Type[]) {
		this.validateTypes(types);
	}

	validateTypes(this: PokemonTypes, types: Type[]): boolean {
		if (!Array.isArray(types) || types.length === 0) {
			throw new PokemonTypesError(
				"Invalid types. It must be a non-empty array.",
			);
		}
		types.forEach((type) => {
			if (typeof type.name !== "string") {
				throw new PokemonTypesError(
					`Invalid type name. It must be a string, but received type: ${typeof type.name}`,
				);
			}
			if (!type.name) {
				throw new PokemonTypesError(
					`Invalid type name. It must not be empty, but received: ${type.name}`,
				);
			}
		});
		return true;
	}
}
