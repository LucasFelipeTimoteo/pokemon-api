import type { Pokemon } from "../../../domain/entities/pokemon/types/pokemon";
import type {
	RawAbility,
	RawMove,
	RawPokemonDetails,
	RawStat,
	RawType,
} from "../../clients/http/pokemon/types/rawPokemonDetails";

class PokemonParser {
	parseRawPokemonDetailsToPokemon(rawPokemonDetails: RawPokemonDetails) {
		const parsedPokemonAbilities = this.#parsePokemonAbilities(
			rawPokemonDetails.abilities,
		);
		const parsedPokemonMoves = this.#parsePokemonMoves(rawPokemonDetails.moves);
		const parsedPokemonStats = this.#parsePokemonStats(rawPokemonDetails.stats);
		const parsedPokemonType = this.#parsePokemonType(rawPokemonDetails.types);

		const parsedPokemon: Pokemon = {
			pokemon_id: rawPokemonDetails.id,
			name: rawPokemonDetails.name,
			height: rawPokemonDetails.height,
			weight: rawPokemonDetails.weight,
			abilities: parsedPokemonAbilities,
			moves: parsedPokemonMoves,
			stats: parsedPokemonStats,
			types: parsedPokemonType,
		};

		return parsedPokemon;
	}

	#parsePokemonMoves(moves: RawMove[]) {
		const parsedPokemonMoves = moves.map((move) => ({
			name: move.move.name,
		}));

		return parsedPokemonMoves;
	}

	#parsePokemonAbilities(abilities: RawAbility[]) {
		const parsedPokemonAbilities = abilities.map((ability) => ({
			name: ability.ability.name,
		}));

		return parsedPokemonAbilities;
	}

	#parsePokemonStats(stats: RawStat[]) {
		const parsedPokemonStats = stats.map((stat) => ({
			name: stat.stat.name,
			effort: stat.effort,
			base_stat: stat.base_stat,
		}));

		return parsedPokemonStats;
	}

	#parsePokemonType(types: RawType[]) {
		const parsedPokemonType = types.map((type) => ({
			name: type.type.name,
		}));

		return parsedPokemonType;
	}
}

export const pokemonParser = new PokemonParser();
