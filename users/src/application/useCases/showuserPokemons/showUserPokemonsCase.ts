import { ServerError } from "../../errors/server/serverError";
import type { logger } from "../../logger/logger";
import type { UsersCacheRepository } from "../../repository/usersCacheRepository";
import type { UsersRepository } from "../../repository/usersRepository";

export class showUserPokemonsCase {
	constructor(
		private logger: logger,
		private usersRepository: UsersRepository,
		private usersCacheRepository: UsersCacheRepository,
	) {}

	async show(userId: string) {
		const hasCache = await this.#isUserPokemonCached(userId);
		if (hasCache) {
			const cachedUserPokemons = await this.#getUserPokemonFromcache(userId);
			this.logger.debug("returning user pokemons from cache");
			return cachedUserPokemons;
		}

		this.logger.debug(
			"cannot get user pokemons from cache. triyng to get from database",
		);
		const userPokemons = await this.usersRepository.showUserPokemons(userId);
		this.logger.debug("Successfully find users and get pokemons from database");

		return userPokemons;
	}

	async #getUserPokemonFromcache(userId: string) {
		const userPokemons =
			await this.usersCacheRepository.showUserPokemons(userId);

		if (!userPokemons) {
			throw new ServerError(
				`in this point, redis userPokemon key is supposed to have something, but recived: ${userPokemons}`,
			);
		}

		return userPokemons;
	}

	async #isUserPokemonCached(userId: string) {
		const isCached =
			await this.usersCacheRepository.isUserPokemonscached(userId);

		return isCached;
	}
}
