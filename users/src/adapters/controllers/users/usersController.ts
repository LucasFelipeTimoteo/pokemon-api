import type { Aes256Cbc } from "../../../application/crypto/simetric/aes/aes256Cbc/aes256cbc";
import type { logger } from "../../../application/logger/logger";
import type { PasswordHasher } from "../../../application/parsers/password/hasing/passwordHasher";
import type { UsersCacheRepository } from "../../../application/repository/usersCacheRepository";
import type { UsersRepository } from "../../../application/repository/usersRepository";
import type { JWTTokens } from "../../../application/tokens/jwt/JWTTokens";
import { AccessTokenRefreshCase } from "../../../application/useCases/accessTokenRefresh/accessTokenRefreshCase";
import { AppendPokemonToUserCase } from "../../../application/useCases/appendPokemonToUser/appendPokemonToUserCase";
import { CreateUserCase } from "../../../application/useCases/createUser/createUserCase";
import type { CreateUserCaseUserParam } from "../../../application/useCases/createUser/types/userParam/createUserCaseUserParam";
import { EditUserCase } from "../../../application/useCases/editUser/editUserCase";
import { EditUserPasswordCase } from "../../../application/useCases/editUserPassword/editUserPasswordCase";
import { LoginCase } from "../../../application/useCases/login/loginCase";
import { RemoveUserPokemonCase } from "../../../application/useCases/removeUserPokemon/removeUserPokemonCase";
import { showUserPokemonsCase } from "../../../application/useCases/showuserPokemons/showUserPokemonsCase";
import { PokemonEntity } from "../../../domain/entities/pokemon/pokemonEntity";
import type { Pokemon } from "../../../domain/entities/pokemon/types/pokemon";
import { PokemonIdEntity } from "../../../domain/entities/pokemonId/pokemonIdEntity";
import type { SafeUser } from "../../../domain/entities/safeUser/types/safeUser";
import { UserEntity } from "../../../domain/entities/user/userEntity";
import { UserIdEntity } from "../../../domain/entities/userId/userIdEntity";
import { UserAge } from "../../../domain/value objects/userAge/userAge";
import { UserName } from "../../../domain/value objects/userName/userName";
import { UserPassword } from "../../../domain/value objects/userPassword/userPassword";
import {
	type HttpResponse,
	httpResponsePresenter,
} from "../../presenters/http/response/httpResponsePresenter";

export class UsersController {
	constructor(
		private usersRepository: UsersRepository,
		private usersCacheRepository: UsersCacheRepository,
		private logger: logger,
		private passwordHasher: PasswordHasher,
		private JWTTokens: JWTTokens,
		private aes256Cbc: Aes256Cbc,
	) {}

	async createUser(
		user: CreateUserCaseUserParam,
	): Promise<HttpResponse<{ accessToken: string }>> {
		const validatedUser = new UserEntity(
			user.username,
			user.age,
			user.password,
		);

		const createUserCase = new CreateUserCase(
			this.usersRepository,
			this.usersCacheRepository,
			this.logger,
			this.passwordHasher,
			this.JWTTokens,
			this.aes256Cbc,
		);
		const userTokens = await createUserCase.create(validatedUser);

		return httpResponsePresenter.created(userTokens);
	}

	async editUser(
		userId: string,
		userEdition: Partial<SafeUser>,
	): Promise<HttpResponse<SafeUser>> {
		const validatedUserEdition: Partial<SafeUser> = {
			...((userEdition.age || userEdition.age === 0) && {
				age: new UserAge(userEdition.age).age,
			}),

			...(userEdition.username && {
				username: new UserName(userEdition.username).username,
			}),

			...(userEdition.pokemons && {
				pokemons: userEdition.pokemons.map(
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
				),
			}),
		};
		const editUserCase = new EditUserCase(this.usersRepository);
		const editedUser = await editUserCase.edit(userId, validatedUserEdition);

		return httpResponsePresenter.ok(editedUser);
	}

	async appendPokemonToUser(
		userId: string,
		pokemons: Pokemon[],
	): Promise<HttpResponse<SafeUser | null>> {
		const validatedPokemons = pokemons.map(
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
		const appendPokemonToUserCase = new AppendPokemonToUserCase(
			this.usersRepository,
			this.usersCacheRepository,
			this.logger,
		);
		const userWithAppendedPokemons = await appendPokemonToUserCase.append(
			userId,
			validatedPokemons,
		);

		return httpResponsePresenter.ok(userWithAppendedPokemons);
	}

	async showUserPokemons(userId: string): Promise<HttpResponse<Pokemon[]>> {
		const validatedUserId = new UserIdEntity(userId).userId;
		const showUserPokemonCase = new showUserPokemonsCase(
			this.logger,
			this.usersRepository,
			this.usersCacheRepository,
		);
		const userPokemons = await showUserPokemonCase.show(validatedUserId);

		return httpResponsePresenter.ok(userPokemons);
	}

	async removeUserPokemon(
		userId: string,
		pokemonId: string,
	): Promise<HttpResponse<{ removedPokemonId: number }>> {
		const validatedPokemonid = new PokemonIdEntity(Number(pokemonId))
			.pokemon_id;

		const removeUserPokemonCase = new RemoveUserPokemonCase(
			this.logger,
			this.usersRepository,
			this.usersCacheRepository,
		);
		const removedPokemonId = await removeUserPokemonCase.remove(
			userId,
			validatedPokemonid,
		);

		return httpResponsePresenter.ok({ removedPokemonId });
	}

	async editUserPassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	): Promise<HttpResponse<{ message: string }>> {
		const validatedUserId = new UserIdEntity(userId).userId;
		const validatedCurrentPassword = new UserPassword(currentPassword).password;
		const validatedNewPassword = new UserPassword(newPassword).password;

		const editUserPasswordCase = new EditUserPasswordCase(
			this.usersRepository,
			this.logger,
			this.passwordHasher,
		);
		const userIdOfEditedUser = await editUserPasswordCase.editPassword(
			validatedUserId,
			validatedCurrentPassword,
			validatedNewPassword,
		);

		return httpResponsePresenter.ok({
			message: `Sucessfully changed password for user: ${userIdOfEditedUser}`,
		});
	}

	async accessTokenRefresh(
		expiredAccessToken: string,
		refreshToken: string,
	): Promise<HttpResponse<{ newAccessToken: string }>> {
		const accessTokenRefreshCase = new AccessTokenRefreshCase(
			this.usersCacheRepository,
			this.logger,
			this.JWTTokens,
		);
		const newAccessToken = await accessTokenRefreshCase.refresh(
			expiredAccessToken,
			refreshToken,
		);

		return httpResponsePresenter.ok({ newAccessToken });
	}

	async login(
		username: string,
		password: string,
	): Promise<HttpResponse<{ accessToken: string; refreshToken: string }>> {
		const validatedUsername = new UserName(username).username;
		const validatedPassword = new UserPassword(password).password;

		const loginCase = new LoginCase(
			this.usersRepository,
			this.usersCacheRepository,
			this.logger,
			this.JWTTokens,
			this.aes256Cbc,
		);
		const usersTokens = await loginCase.login(
			validatedUsername,
			validatedPassword,
		);
		return httpResponsePresenter.ok(usersTokens);
	}
}
