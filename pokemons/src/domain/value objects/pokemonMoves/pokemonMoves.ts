import type { Move } from "../../entities/pokemon/types/pokemon";
import { PokemonMovesError } from "./errors/pokemonMovesError/pokemonMovesError";

export class PokemonMoves {
	constructor(public moves: Move[]) {
		this.validateMoves(moves);
	}

	validateMoves(this: PokemonMoves, moves: Move[]): boolean {
		if (!Array.isArray(moves) || moves.length === 0) {
			throw new PokemonMovesError(
				"Invalid moves. It must be a non-empty array.",
			);
		}
		moves.forEach((move) => {
			if (typeof move.name !== "string") {
				throw new PokemonMovesError(
					`Invalid move name. It must be a string, but received type: ${typeof move.name}`,
				);
			}
			if (!move.name) {
				throw new PokemonMovesError(
					`Invalid move name. It must not be empty, but received: ${move.name}`,
				);
			}
		});
		return true;
	}
}
