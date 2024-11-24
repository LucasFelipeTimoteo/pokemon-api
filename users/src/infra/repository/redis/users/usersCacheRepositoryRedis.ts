import { Aes256Cbc } from "../../../../application/crypto/simetric/aes/aes256Cbc/aes256cbc";
import { ServerError } from "../../../../application/errors/server/serverError";
import type { UsersCacheRepository } from "../../../../application/repository/usersCacheRepository";
import { PokemonEntity } from "../../../../domain/entities/pokemon/pokemonEntity";
import type { Pokemon } from "../../../../domain/entities/pokemon/types/pokemon";
import { appEnv } from "../../../../global/utils/env/appEnv/appEnv";
import type { CustomRedisClient } from "../../../services/db/redis/types/RedisClientTypes";

export class UsersCacheRepositoryRedis implements UsersCacheRepository {
	constructor(private redisClient: Promise<CustomRedisClient>) {}

	async isUserPokemonscached(userId: string): Promise<boolean> {
		const redis = await this.redisClient;
		const isCached = await redis.EXISTS(
			`${appEnv.redisUserPokemonsListKey}:${userId}`,
		);

		return !!isCached;
	}

	async showUserPokemons(userId: string): Promise<Pokemon[] | null> {
		const redis = await this.redisClient;
		const userPokemonsResponse = await redis.GET(
			`${appEnv.redisUserPokemonsListKey}:${userId}`,
		);

		if (!userPokemonsResponse) {
			return null;
		}

		const jsonRawPokemons = JSON.parse(userPokemonsResponse);
		if (!Array.isArray(jsonRawPokemons)) {
			throw new ServerError(
				`User Pokemons retrieved from cache have an invalid format. Expected to be an array, but it is not. Received: ${jsonRawPokemons}`,
			);
		}
		const validatedPokemons = (jsonRawPokemons as Pokemon[]).map(
			(pokemon) =>
				new PokemonEntity(
					pokemon.pokemon_id,
					pokemon.name,
					pokemon.height,
					pokemon.weight,
					pokemon.abilities,
					pokemon.moves,
					pokemon.types,
					pokemon.stats,
				),
		);

		return validatedPokemons;
	}

	async saveUserPokemons(
		userId: string,
		pokemons: Pokemon[],
	): Promise<boolean> {
		const redis = await this.redisClient;
		const jsonPokemons = JSON.stringify(pokemons);
		const success = await redis.SET(
			`${appEnv.redisUserPokemonsListKey}:${userId}`,
			jsonPokemons,
		);

		return !!success;
	}

	async saveRefreshToken(
		userId: string,
		encryptedRefreshToken: string,
		cacheDays: number,
	): Promise<boolean> {
		const keyName = `${appEnv.redisUserRefreshTokenKey}:${userId}`;
		const redis = await this.redisClient;

		const success = await redis.SET(keyName, encryptedRefreshToken, {
			EX: cacheDays,
		});

		return !!success;
	}

	async refreshTokenIsValid(
		userId: string,
		refreshToken: string,
	): Promise<boolean> {
		const aes256Cbc = new Aes256Cbc(appEnv.refreshTokenAESSecret);
		const redis = await this.redisClient;
		const storedRefreshToken = await redis.get(
			`${appEnv.redisUserRefreshTokenKey}:${userId}`,
		);

		if (!storedRefreshToken) {
			return false;
		}

		const decryptedStoredRefreshToken =
			aes256Cbc.decryptData(storedRefreshToken);
		const isRefreshTokenValid = decryptedStoredRefreshToken === refreshToken;

		return isRefreshTokenValid;
	}
}
