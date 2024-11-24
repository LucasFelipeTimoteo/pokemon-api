import { HttpResponseStatuses } from "../../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import { PokemonEntity } from "../../../../domain/entities/pokemon/pokemonEntity";
import type { PokemonHttpClient } from "../../../clients/http/pokemon/types/pokemonHttpClient";
import { ApiError } from "../../../errors/api/apiError";
import { ApiValidationError } from "../../../errors/apiValidation/apiValidationError";
import { ServerError } from "../../../errors/server/serverError";
import type { logger } from "../../../logger/logger";
import { pokemonParser } from "../../../parsers/pokemon/pokemonParser";
import type { PokemonChacheRepository } from "../../../repository/pokemonCache/pokemonCacheRepository";

export class GetOnePokemonCase {
	constructor(
		private pokemonHttpClient: PokemonHttpClient,
		private pokemonCacheClientRepository: PokemonChacheRepository,
		private logger: logger,
	) {}

	async getOne(pokemonId: number) {
		if (pokemonId < 1) {
			throw new ApiError(
				`Pokemon id should be greather than 0. Received: ${pokemonId}`,
				HttpResponseStatuses.badRequest,
				true,
			);
		}
		const cachedPokemon = await this.#getPokemonCache(pokemonId);

		if (cachedPokemon) {
			this.logger.debug("Returning cached pokemons in [getOne] use case");
			return cachedPokemon;
		}

		this.logger.debug(
			"Unable to get pokemon from cache. Trying to fetch it from api",
		);

		const unvalidatedRawPokemonDetails =
			await this.pokemonHttpClient.getOne(pokemonId);

		if (!unvalidatedRawPokemonDetails.success) {
			throw new ApiValidationError(
				JSON.stringify(unvalidatedRawPokemonDetails.error),
			);
		}

		const rawPokemonDetails = unvalidatedRawPokemonDetails.data;
		const { pokemon_id, name, height, weight, abilities, moves, types, stats } =
			pokemonParser.parseRawPokemonDetailsToPokemon(rawPokemonDetails);

		const pokemon = new PokemonEntity(
			pokemon_id,
			name,
			height,
			weight,
			abilities,
			moves,
			types,
			stats,
		);

		const savingResult =
			await this.pokemonCacheClientRepository.saveOne(pokemon);
		if (typeof savingResult !== "boolean") {
			throw new ApiValidationError(JSON.stringify(savingResult));
		}

		if (!savingResult) {
			throw new ServerError(
				"Database error. Cannot save on cache database client",
			);
		}

		return pokemon;
	}

	async #getPokemonCache(pokemonId: number) {
		const isCached =
			await this.pokemonCacheClientRepository.pokemonExists(pokemonId);
		if (!isCached) {
			return null;
		}
		const cachedPokemon =
			await this.pokemonCacheClientRepository.getPokemon(pokemonId);

		return cachedPokemon;
	}
}
