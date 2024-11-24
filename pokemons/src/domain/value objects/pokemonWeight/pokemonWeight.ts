import { PokemonWeightError } from "./errors/pokemonWeight/pokemonWeightError";

export class PokemonWeight {
	constructor(public weight: number) {
		this.validateWeight(weight);
	}

	validateWeight(this: PokemonWeight, weight: number): boolean {
		if (typeof weight !== "number") {
			throw new PokemonWeightError(
				`Invalid weight. It must be a number, but received type: ${typeof weight}`,
			);
		}
		if (weight < 0) {
			throw new PokemonWeightError(
				`Invalid weight. It must be a positive number, but received: ${weight}`,
			);
		}
		return true;
	}
}
