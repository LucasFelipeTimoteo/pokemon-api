import type { Request } from "express";
import type { CreateUserCaseUserParam } from "../../../../../../application/useCases/createUser/types/userParam/createUserCaseUserParam";
import type { Pokemon } from "../../../../../../domain/entities/pokemon/types/pokemon";
import type { SafeUser } from "../../../../../../domain/entities/safeUser/types/safeUser";

export interface CreateUserExpressRequest extends Request {
	body: CreateUserCaseUserParam;
}
export interface EditUserExpressRequest extends Request {
	body: {
		userId: string;
		userEdition: Partial<SafeUser>;
	};
}

export interface AppendPokemonsToUserExpressRequest extends Request {
	body: {
		userId: string;
		pokemons: Pokemon[];
	};
}

export interface GenericUserIdParamExpressRequest extends Request {
	params: {
		userId: string;
	};
}

export interface RemoveUserPokemonExpressRequest extends Request {
	params: {
		userId: string;
		pokemonId: string;
	};
}

export interface EditUserPasswordExpressRequest {
	body: {
		userId: string;
		currentPassword: string;
		newPassword: string;
	};
}

export interface AccessTokenRefreshExpressRequest {
	body: {
		expiredToken: string;
		refreshToken: string;
	};
}

export interface LoginExpressRequest {
	body: {
		username: string;
		password: string;
	};
}
