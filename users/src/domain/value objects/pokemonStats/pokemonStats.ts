import type { Stat } from "../../entities/pokemon/types/pokemon";
import { PokemonStatsError } from "./errors/pokemonStatsError/pokemonStatsError";

export class PokemonStats {
	constructor(public stats: Stat[]) {
		this.validateStats(stats);
	}

	validateStats(this: PokemonStats, stats: Stat[]): boolean {
		if (!Array.isArray(stats) || stats.length === 0) {
			throw new PokemonStatsError(
				"Invalid stats. It must be a non-empty array.",
			);
		}
		stats.forEach((stat) => {
			if (typeof stat.name !== "string") {
				throw new PokemonStatsError(
					`Invalid stat name. It must be a string, but received type: ${typeof stat.name}`,
				);
			}
			if (!stat.name) {
				throw new PokemonStatsError(
					`Invalid stat name. It must not be empty, but received ${stat.name}`,
				);
			}

			if (typeof stat.base_stat !== "number") {
				throw new PokemonStatsError(
					`Invalid stat base_stat. It must be a number, but received type: ${typeof stat.base_stat}`,
				);
			}

			if (stat.base_stat < 0) {
				throw new PokemonStatsError(
					`Invalid stat base_stat. It must not be a negative number, but received ${stat.base_stat}`,
				);
			}

			if (typeof stat.effort !== "number") {
				throw new PokemonStatsError(
					`Invalid stat effort. It must be a number, but received type: ${typeof stat.effort}`,
				);
			}

			if (stat.effort < 0) {
				throw new PokemonStatsError(
					`Invalid stat effort. It must not be a negative number, but received ${stat.effort}`,
				);
			}
		});
		return true;
	}
}
