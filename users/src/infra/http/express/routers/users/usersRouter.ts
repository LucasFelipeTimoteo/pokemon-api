import { Router } from "express";
import type { usersRouteHandlerExpress } from "../../routehandlers/users/userRouteHandlerExpress";

export class UsersRouter {
	baseRoutePath = "/users";

	constructor(private userRoutehandler: usersRouteHandlerExpress) {
		this.#autoBindMethods(this.userRoutehandler);
	}

	exec() {
		const router = Router();
		router.post(`${this.baseRoutePath}`, this.userRoutehandler.createUser);

		router.patch(`${this.baseRoutePath}`, this.userRoutehandler.editUser);

		router.post(`${this.baseRoutePath}/login`, this.userRoutehandler.login);

		router.patch(
			`${this.baseRoutePath}/password`,
			this.userRoutehandler.editUserPassword,
		);

		router.post(
			`${this.baseRoutePath}/pokemons`,
			this.userRoutehandler.appendPokemonsToUser,
		);

		router.get(
			`${this.baseRoutePath}/pokemons/:userId`,
			this.userRoutehandler.showUserPokemons,
		);

		router.delete(
			`${this.baseRoutePath}/pokemons/:userId/:pokemonId`,
			this.userRoutehandler.removeUserPokemon,
		);

		router.post(
			`${this.baseRoutePath}/token/refresh`,
			this.userRoutehandler.accesstokenRefresh,
		);
		return router;
	}

	/* biome-ignore lint/suspicious/noExplicitAny: */
	#autoBindMethods(instance: any): void {
		const prototype = Object.getPrototypeOf(instance);
		Object.getOwnPropertyNames(prototype)
			.filter((prop) => typeof instance[prop] === "function")
			.forEach((method) => {
				instance[method] = instance[method].bind(instance);
			});
	}
}
