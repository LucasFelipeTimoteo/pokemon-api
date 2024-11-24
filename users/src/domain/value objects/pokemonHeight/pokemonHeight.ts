import { PokemonHeightError } from "./errors/pokemonHeight/pokemonHeightError";

export class PokemonHeight {
	constructor(public height: number) {
		this.validateHeight(height);
	}

	validateHeight(this: PokemonHeight, height: number): boolean {
		if (typeof height !== "number") {
			throw new PokemonHeightError(
				`Invalid height. It must be a number, but received type: ${typeof height}`,
			);
		}
		if (height < 1) {
			throw new PokemonHeightError(
				`Invalid height. It must be a positive number, but received: ${height}`,
			);
		}
		return true;
	}
}
