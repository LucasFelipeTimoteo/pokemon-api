import { PokemonEntity } from "../../../../domain/entities/pokemon/pokemonEntity";
import type { Pokemon } from "../../../../domain/entities/pokemon/types/pokemon";
import type { PokemonHttpClient } from "../../../clients/http/pokemon/types/pokemonHttpClient";
import { ApiValidationError } from "../../../errors/apiValidation/apiValidationError";
import { ServerError } from "../../../errors/server/serverError";
import type { logger } from "../../../logger/logger";
import { pokemonParser } from "../../../parsers/pokemon/pokemonParser";
import type { PokemonChacheRepository } from "../../../repository/pokemonCache/pokemonCacheRepository";

export class GetAllPokemonsCase {
	constructor(
		private pokemonHttpClient: PokemonHttpClient,
		private pokemonCacheClientRepository: PokemonChacheRepository,
		private logger: logger,
	) {}

	async getAll() {
		const cachedPokemonList = await this.#getPokemonListCache();

		if (cachedPokemonList) {
			this.logger.debug("Returning cached pokemons in [getAll] use case");
			return cachedPokemonList;
		}

		this.logger.debug(
			"Unable to get pokemons from cache. Trying to fetch it from api",
		);

		const unvalidatedRawPokemonDetailsResponseList =
			await this.pokemonHttpClient.getAll();
		const pokemonList: Pokemon[] = [];

		for (const rawPokemonDetails of unvalidatedRawPokemonDetailsResponseList) {
			if (!rawPokemonDetails.success) {
				throw new ApiValidationError(JSON.stringify(rawPokemonDetails.error));
			}

			const {
				pokemon_id,
				name,
				height,
				weight,
				abilities,
				moves,
				types,
				stats,
			} = pokemonParser.parseRawPokemonDetailsToPokemon(rawPokemonDetails.data);

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

			pokemonList.push(pokemon);
		}

		const savingResult =
			await this.pokemonCacheClientRepository.saveList(pokemonList);

		if (typeof savingResult !== "boolean") {
			throw new ApiValidationError(JSON.stringify(savingResult));
		}

		if (!savingResult) {
			throw new ServerError(
				"Database error. Cannot save on cache database client",
			);
		}

		return pokemonList;
	}

	async #getPokemonListCache() {
		const isCached =
			await this.pokemonCacheClientRepository.pokemonListExists();
		if (!isCached) {
			return null;
		}
		const cachedPokemonList =
			await this.pokemonCacheClientRepository.getPokemonList();

		return cachedPokemonList;
	}
}
