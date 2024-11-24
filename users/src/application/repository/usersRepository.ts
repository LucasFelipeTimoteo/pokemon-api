import type { Pokemon } from "../../domain/entities/pokemon/types/pokemon";
import type { SafeUser } from "../../domain/entities/safeUser/types/safeUser";
import type { User } from "../../domain/entities/user/types/user";
import type { PasswordHasher } from "../parsers/password/hasing/passwordHasher";

export type LoginUserId = Required<Pick<SafeUser, "userId">>;

export interface UsersRepository {
	createUser(user: User): Promise<Required<SafeUser>>;
	editUser(
		userId: string,
		userEdition: Partial<SafeUser>,
	): Promise<SafeUser | null>;
	appendPokemonToUser(
		userId: string,
		pokemons: Pokemon[],
	): Promise<SafeUser | null>;
	showUserPokemons(userId: string): Promise<Pokemon[]>;
	removeUserPokemon(userId: string, pokemonId: number): Promise<number>;
	editUserPassword(
		userId: string,
		newPassword: string,
		currentPassword: string,
		passwordHasher: PasswordHasher,
	): Promise<boolean>;

	login(username: string, hashedPassword: string): Promise<LoginUserId | null>;
}
