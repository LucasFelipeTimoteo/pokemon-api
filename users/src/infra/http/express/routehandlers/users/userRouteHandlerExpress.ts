import type { NextFunction, Response } from "express";
import type { UsersController } from "../../../../../adapters/controllers/users/usersController";
import type {
	AccessTokenRefreshExpressRequest,
	AppendPokemonsToUserExpressRequest,
	CreateUserExpressRequest,
	EditUserExpressRequest,
	EditUserPasswordExpressRequest,
	GenericUserIdParamExpressRequest,
	LoginExpressRequest,
	RemoveUserPokemonExpressRequest,
} from "./types/customExpressRequests";

export class usersRouteHandlerExpress {
	constructor(private UsersController: UsersController) {}

	async createUser(
		this: usersRouteHandlerExpress,
		req: CreateUserExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { age, username, password } = req.body;
			const createduserResponseData = await this.UsersController.createUser({
				age,
				username,
				password,
			});

			return res
				.status(createduserResponseData.status)
				.json(createduserResponseData.body);
		} catch (error) {
			next(error);
		}
	}

	async editUser(
		this: usersRouteHandlerExpress,
		req: EditUserExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { userId, userEdition } = req.body;
			const editedUserReponsedata = await this.UsersController.editUser(
				userId,
				userEdition,
			);
			return res
				.status(editedUserReponsedata.status)
				.json(editedUserReponsedata.body);
		} catch (error) {
			next(error);
		}
	}

	async appendPokemonsToUser(
		this: usersRouteHandlerExpress,
		req: AppendPokemonsToUserExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { userId, pokemons } = req.body;

			const userWithAppendedPokemonsResponseData =
				await this.UsersController.appendPokemonToUser(userId, pokemons);

			return res
				.status(userWithAppendedPokemonsResponseData.status)
				.json(userWithAppendedPokemonsResponseData.body);
		} catch (error) {
			next(error);
		}
	}

	async showUserPokemons(
		this: usersRouteHandlerExpress,
		req: GenericUserIdParamExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { userId } = req.params;
			const userPokemonsResponseData =
				await this.UsersController.showUserPokemons(userId);

			return res
				.status(userPokemonsResponseData.status)
				.json(userPokemonsResponseData.body);
		} catch (error) {
			next(error);
		}
	}

	async removeUserPokemon(
		this: usersRouteHandlerExpress,
		req: RemoveUserPokemonExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { pokemonId, userId } = req.params;
			const removedPokemonIdResponseData =
				await this.UsersController.removeUserPokemon(userId, pokemonId);

			return res
				.status(removedPokemonIdResponseData.status)
				.json(removedPokemonIdResponseData.body);
		} catch (error) {
			next(error);
		}
	}

	async editUserPassword(
		this: usersRouteHandlerExpress,
		req: EditUserPasswordExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { userId, currentPassword, newPassword } = req.body;

			const editedUserPasswordResponsedata =
				await this.UsersController.editUserPassword(
					userId,
					currentPassword,
					newPassword,
				);

			return res
				.status(editedUserPasswordResponsedata.status)
				.json(editedUserPasswordResponsedata.body);
		} catch (error) {
			next(error);
		}
	}

	async accesstokenRefresh(
		this: usersRouteHandlerExpress,
		req: AccessTokenRefreshExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { expiredToken, refreshToken } = req.body;
			const accessTokenRefreshResponseData =
				await this.UsersController.accessTokenRefresh(
					expiredToken,
					refreshToken,
				);

			return res
				.status(accessTokenRefreshResponseData.status)
				.json(accessTokenRefreshResponseData.body);
		} catch (error) {
			next(error);
		}
	}

	async login(
		this: usersRouteHandlerExpress,
		req: LoginExpressRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { username, password } = req.body;

			const loginResponseData = await this.UsersController.login(
				username,
				password,
			);

			return res.status(loginResponseData.status).json(loginResponseData.body);
		} catch (error) {
			next(error);
		}
	}
}
