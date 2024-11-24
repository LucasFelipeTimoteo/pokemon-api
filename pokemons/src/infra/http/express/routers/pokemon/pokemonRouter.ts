import { Router } from "express";
import type { PokemonRouteHandlersExpress } from "../../routeHandlers/pokemon/pokemonRouteHandlersExpress";

export class PokemonRouter {
	baseRoutePath = "/pokemons";

	constructor(private pokemonRouteHandlers: PokemonRouteHandlersExpress) {
		this.#autoBindMethods(this.pokemonRouteHandlers);
	}

	exec() {
		const router = Router();

		router.get(
			`${this.baseRoutePath}`,
			this.pokemonRouteHandlers.getAllPokemons,
		);
		router.get(
			`${this.baseRoutePath}/:id`,
			this.pokemonRouteHandlers.getOnePokemon,
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
