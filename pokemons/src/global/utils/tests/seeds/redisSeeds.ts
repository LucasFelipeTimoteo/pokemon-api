import type { CustomRedisClient } from "../../../../infra/services/db/redis/types/RedisClientTypes";
import pokemon from "../../../fixtures/pokemon/pokemon.json";
import pokemonList from "../../../fixtures/pokemon/pokemonList.json";
import { appEnv } from "../../../utils/env/appEnv";

export class RedisSeeds {
	pokemonKey = `${appEnv.redisPokemonKeyBase}:${pokemon.pokemon_id}`;

	constructor(
		private redisClient: CustomRedisClient,
		private redisTestDatabase?: number,
	) {}

	async exec() {
		await this.redisClient.SELECT(
			this.redisTestDatabase || Number(appEnv.redisTestdatabase),
		);
		await this.redisClient.FLUSHDB();

		await Promise.all([this.execPokemon(), this.execPokemonList()]);
	}

	async execPokemon() {
		return await this.redisClient.SET(this.pokemonKey, JSON.stringify(pokemon));
	}

	async execPokemonList() {
		return await this.redisClient.SET(
			appEnv.redisPokemonListKey,
			JSON.stringify(pokemonList),
		);
	}
}
