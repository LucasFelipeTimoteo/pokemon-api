import type { Pokemon } from "../../domain/entities/pokemon/types/pokemon";

export interface UsersCacheRepository {
	isUserPokemonscached(userId: string): Promise<boolean>;
	saveUserPokemons(userId: string, pokemons: Pokemon[]): Promise<boolean>;
	showUserPokemons(userId: string): Promise<Pokemon[] | null>;
	saveRefreshToken(
		userId: string,
		refreshToken: string,
		cachedays: number,
	): Promise<boolean>;
	refreshTokenIsValid(userId: string, refreshToken: string): Promise<boolean>;
}
