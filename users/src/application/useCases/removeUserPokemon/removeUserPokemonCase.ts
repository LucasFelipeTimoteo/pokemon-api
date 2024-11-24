import type { logger } from "../../logger/logger";
import type { UsersCacheRepository } from "../../repository/usersCacheRepository";
import type { UsersRepository } from "../../repository/usersRepository";

export class RemoveUserPokemonCase {
	constructor(
		private logger: logger,
		private usersRepository: UsersRepository,
		private usersCacheRepository: UsersCacheRepository,
	) {}

	async remove(userId: string, pokemonId: number) {
		const removedPokemonId = await this.usersRepository.removeUserPokemon(
			userId,
			pokemonId,
		);

		this.logger.debug(
			`Successfully removed pokemon ${pokemonId} from user ${userId}`,
		);

		const newUserPokemons = await this.usersRepository.showUserPokemons(userId);
		const wasDeleted = await this.usersCacheRepository.saveUserPokemons(
			userId,
			newUserPokemons,
		);
		if (wasDeleted) {
			this.logger.debug(
				`Seccessfully update users pokemon cache after delete pokemon with id ${pokemonId} from user ${userId}`,
			);
		}

		return removedPokemonId;
	}
}
