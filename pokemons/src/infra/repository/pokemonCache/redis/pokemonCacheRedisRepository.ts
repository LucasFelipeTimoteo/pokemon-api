import type { logger } from "../../../../application/logger/logger";
import type { PokemonChacheRepository } from "../../../../application/repository/pokemonCache/pokemonCacheRepository";
import type {
	PokemonValidator,
	PokemonValidatorResponseError,
} from "../../../../application/validation/pokemon/pokemonValidator";
import type { Pokemon } from "../../../../domain/entities/pokemon/types/pokemon";

import { appEnv } from "../../../../global/utils/env/appEnv";
import type { CustomRedisClient } from "../../../services/db/redis/types/RedisClientTypes";

export class PokemonCacheRedisRepository implements PokemonChacheRepository {
	pokemonListKey = appEnv.redisPokemonListKey;
	pokemonBaseKeyName = appEnv.redisPokemonKeyBase;
	cacheTTLSecounds = Number(appEnv.redisCacheTTLDays) * 24 * 60 * 60;

	constructor(
		private redisClient: Promise<CustomRedisClient>,
		private pokemonValidator: PokemonValidator<unknown>,
		private logger: logger,
	) {}

	async saveList(pokemonList: Pokemon[]) {
		const invalidPokemonList: PokemonValidatorResponseError<unknown>[] = [];
		for (const pokemon of pokemonList) {
			const validatedPokemonList = this.pokemonValidator.pokemon(pokemon);

			if (!validatedPokemonList.success) {
				invalidPokemonList.push(validatedPokemonList);
			}
		}

		if (invalidPokemonList.length > 0) {
			this.logger.debug(
				"Cannot save pokemons data on cache because it is invalid",
			);
			return invalidPokemonList;
		}

		const JSONPokemonList = JSON.stringify(pokemonList);
		const redis = await this.redisClient;
		const savingResult = await redis.SET(this.pokemonListKey, JSONPokemonList, {
			EX: this.cacheTTLSecounds,
		});
		const wasSaved = !!savingResult;

		if (wasSaved) {
			this.logger.debug("Successfully saved pokemons on cache");
		} else {
			this.logger.debug(
				"Cache client unable to save pokemons on cache for some reason",
			);
		}

		return wasSaved;
	}

	async saveOne(pokemon: Pokemon) {
		const validatedPokemon = this.pokemonValidator.pokemon(pokemon);

		if (!validatedPokemon.success) {
			this.logger.debug(
				"Cannot save pokemon data on cache because it is invalid",
			);
			return validatedPokemon;
		}

		const JSONPokemon = JSON.stringify(pokemon);
		const redis = await this.redisClient;
		const savingResult = await redis.SET(
			`${this.pokemonBaseKeyName}:${pokemon.pokemon_id}`,
			JSONPokemon,
			{ EX: this.cacheTTLSecounds },
		);
		const wasSaved = !!savingResult;

		if (wasSaved) {
			this.logger.debug("Successfully saved pokemon on cache");
		} else {
			this.logger.debug(
				"Cache client unable to save pokemon on cache for some reason",
			);
		}

		return wasSaved;
	}

	async pokemonExists(pokemonId: number) {
		const redis = await this.redisClient;
		const existingNumber = await redis.EXISTS(
			`${this.pokemonBaseKeyName}:${pokemonId}`,
		);
		const isCached = !!existingNumber;

		return isCached;
	}

	async getPokemon(pokemonId: number) {
		const redis = await this.redisClient;
		const JSONPokemon = await redis.GET(
			`${this.pokemonBaseKeyName}:${pokemonId}`,
		);

		if (!JSONPokemon) {
			return null;
		}

		const unvalidatedPokemon = JSON.parse(JSONPokemon);
		const validatedPokemon = this.pokemonValidator.pokemon(unvalidatedPokemon);

		if (!validatedPokemon.success) {
			await redis.DEL(`${this.pokemonBaseKeyName}:${pokemonId}`);
			return null;
		}

		const pokemon = validatedPokemon.data;

		return pokemon;
	}

	async pokemonListExists() {
		const redis = await this.redisClient;
		const existingNumber = await redis.EXISTS(this.pokemonListKey);
		const isCached = !!existingNumber;

		return isCached;
	}

	async getPokemonList() {
		const redis = await this.redisClient;
		const JSONPokemonList = await redis.GET(this.pokemonListKey);
		if (!JSONPokemonList) {
			return null;
		}

		const pokemonList = JSON.parse(JSONPokemonList);

		// for performance reasons, full validation was not used. Validate only 0 and -1 index elements is sufficient to ensure data correctness
		if (!this.#pokemonListEdgesValidationTypeGuard(pokemonList)) {
			return null;
		}

		return pokemonList;
	}

	#pokemonListEdgesValidationTypeGuard(
		pokemonList: unknown[],
	): pokemonList is Pokemon[] {
		const firstAndLastPokemonsFromList = [
			pokemonList[0],
			pokemonList[pokemonList.length - 1],
		];
		const isValidPokemons = firstAndLastPokemonsFromList.every(
			(pokemon) => this.pokemonValidator.pokemon(pokemon).success,
		);

		return isValidPokemons;
	}
}
