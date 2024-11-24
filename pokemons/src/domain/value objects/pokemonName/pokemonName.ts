import { PokemonNameError } from "./errors/pokemonNameErrors/pokemonNameErrors";

export class PokemonName {
	constructor(public name: string) {
		this.validateName(name);
	}

	validateName(this: PokemonName, name: string): boolean {
		if (typeof name !== "string") {
			throw new PokemonNameError(
				`Invalid name. It must be a string, but received type: ${typeof name}`,
			);
		}
		if (!name) {
			throw new PokemonNameError(
				`Invalid name. It must not be empty, but received: ${name}`,
			);
		}
		return true;
	}
}
