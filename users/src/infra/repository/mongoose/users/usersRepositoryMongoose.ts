import { HttpResponseStatuses } from "../../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import { ApiError } from "../../../../application/errors/api/apiError";
import type { PasswordHasher } from "../../../../application/parsers/password/hasing/passwordHasher";
import type {
	LoginUserId,
	UsersRepository,
} from "../../../../application/repository/usersRepository";
import type { Pokemon } from "../../../../domain/entities/pokemon/types/pokemon";
import type { SafeUser } from "../../../../domain/entities/safeUser/types/safeUser";
import type { User } from "../../../../domain/entities/user/types/user";
import { appEnv } from "../../../../global/utils/env/appEnv/appEnv";
import type { UsersModelType } from "../../../services/db/mongoose/models/usersModel/usersModelMongoose";

export class UsersRepositoryMongoose implements UsersRepository {
	constructor(
		private usersModel: UsersModelType,
		private passwordHasher: PasswordHasher,
	) {}

	async createUser(user: User) {
		try {
			const alreadyExistUsername = await this.usersModel.findOne({
				username: user.username,
			});

			if (alreadyExistUsername) {
				throw new ApiError(
					"Invalid username. Username already exists",
					HttpResponseStatuses.badRequest,
					true,
				);
			}

			const rawMongooseCreatedUser = await this.usersModel.create({
				username: user.username,
				age: user.age,
				password: user.password,
				pokemons: [],
			});

			const {
				_id: userId,
				username,
				age,
				pokemons,
			} = rawMongooseCreatedUser.toObject();
			const newUserPOJO: Required<SafeUser> = {
				username,
				age,
				pokemons,
				userId: userId.toString(),
			};

			return newUserPOJO;
		} catch (error) {
			if ((error as Error).message.includes("duplicate key error")) {
				throw new ApiError(
					"Invalid username. Username already exists",
					HttpResponseStatuses.badRequest,
					true,
				);
			}

			throw error;
		}
	}

	async editUser(
		userId: string,
		userEdition: Partial<SafeUser>,
	): Promise<SafeUser | null> {
		try {
			const user = await this.usersModel.findById(userId, { password: 0 });

			if (!user) {
				return null;
			}

			const rawMongooseEditedUser = await user.set(userEdition).save();
			const { _id, username, age, pokemons } = rawMongooseEditedUser.toObject();
			const newUserPOJO: Required<SafeUser> = {
				username,
				age,
				pokemons,
				userId: _id.toString(),
			};

			return newUserPOJO;
		} catch (error) {
			if ((error as Error).message.includes("duplicate key error")) {
				throw new ApiError(
					"Invalid username. Username already exists",
					HttpResponseStatuses.badRequest,
					true,
				);
			}

			throw error;
		}
	}

	async appendPokemonToUser(
		id: string,
		pokemons: Pokemon[],
	): Promise<SafeUser | null> {
		const user = await this.usersModel.findById(id);
		if (!user) {
			return null;
		}

		user.pokemons.push(...pokemons);
		const rawUserWithNewuPokemon = await user.save();
		const {
			_id,
			username,
			age,
			pokemons: newPokemonList,
		} = rawUserWithNewuPokemon.toObject();
		const userWithnewPokemonsPOJO: SafeUser = {
			username,
			age,
			pokemons: newPokemonList,
			userId: _id.toString(),
		};

		return userWithnewPokemonsPOJO;
	}

	async showUserPokemons(userId: string): Promise<Pokemon[]> {
		const user = await this.usersModel.findById(userId);
		if (!user) {
			throw new ApiError(
				`Cannot find an user with provided userId: ${userId}`,
				HttpResponseStatuses.notFound,
				true,
			);
		}
		const userPokemons = user.pokemons;

		return userPokemons;
	}

	async removeUserPokemon(userId: string, pokemonId: number): Promise<number> {
		const user = await this.usersModel.findById(userId);
		if (!user) {
			throw new ApiError(
				`Cannot find an user with provided userId: ${userId}`,
				HttpResponseStatuses.notFound,
				true,
			);
		}

		const selectedPokemonIndex = user.pokemons.findIndex(
			(pokemon) => pokemon.pokemon_id === pokemonId,
		);

		if (selectedPokemonIndex === -1) {
			throw new ApiError(
				`Cannot find a pokemon with provided pokemonId: ${pokemonId} in the user ${userId}`,
				HttpResponseStatuses.notFound,
				true,
			);
		}

		const removedPokemon = user.pokemons.splice(selectedPokemonIndex, 1);
		const removedPokemonId = removedPokemon[0].pokemon_id;
		await user.save();

		return removedPokemonId;
	}

	async editUserPassword(
		userId: string,
		newPassword: string,
		currentPassword: string,
		passwordHasher: PasswordHasher,
	): Promise<boolean> {
		const user = await this.usersModel.findById(userId);

		if (!user) {
			throw new ApiError(
				`invalid userId. Cannot find an user with userId: ${userId}`,
				HttpResponseStatuses.notFound,
				true,
			);
		}

		const isPasswordCorrect = await passwordHasher.compare(
			currentPassword,
			user.password,
		);
		if (!isPasswordCorrect) {
			return false;
		}

		const salt = await passwordHasher.genSalt(Number(appEnv.salt));
		const newPasswordHashed = await passwordHasher.hashAsync(newPassword, salt);
		user.password = newPasswordHashed;
		await user.save();
		return true;
	}

	async login(username: string, password: string): Promise<LoginUserId | null> {
		const mongooseUser = await this.usersModel.findOne({ username });

		if (
			!mongooseUser ||
			!(await this.passwordHasher.compare(password, mongooseUser.password))
		) {
			return null;
		}

		const userId: LoginUserId = { userId: mongooseUser._id.toString() };
		return userId;
	}
}
