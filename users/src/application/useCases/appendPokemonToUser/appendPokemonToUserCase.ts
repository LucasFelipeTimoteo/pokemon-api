import { HttpResponseStatuses } from "../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import type { Pokemon } from "../../../domain/entities/pokemon/types/pokemon";
import { ApiError } from "../../errors/api/apiError";
import type { logger } from "../../logger/logger";
import type { UsersCacheRepository } from "../../repository/usersCacheRepository";
import type { UsersRepository } from "../../repository/usersRepository";

export class AppendPokemonToUserCase {
	constructor(
		private usersRepository: UsersRepository,
		private userCacherepository: UsersCacheRepository,
		private logger: logger,
	) {}

	async append(userId: string, pokemons: Pokemon[]) {
		const userWithAppendedPokemon =
			await this.usersRepository.appendPokemonToUser(userId, pokemons);

		this.logger.debug("Successfully appended pokemons to user");

		if (!userWithAppendedPokemon) {
			throw new ApiError(
				`invalid userId. Cannot find an user with userId: ${userId}`,
				HttpResponseStatuses.notFound,
				true,
			);
		}

		await this.#cacheUserPokemons(userId, userWithAppendedPokemon.pokemons);
		this.logger.debug("Save user pokemons on cache");
		return userWithAppendedPokemon;
	}

	async #cacheUserPokemons(userId: string, pokemons: Pokemon[]) {
		this.userCacherepository.saveUserPokemons(userId, pokemons);
	}
}
