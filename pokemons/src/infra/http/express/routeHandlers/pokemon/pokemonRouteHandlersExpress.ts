import type { NextFunction, Request, Response } from "express";
import type { PokemonController } from "../../../../../adapters/controllers/pokemon/pokemonController";

export class PokemonRouteHandlersExpress {
	constructor(private pokemonController: PokemonController) {}

	async getOnePokemon(
		this: PokemonRouteHandlersExpress,
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const pokemonId = Number(req.params.id);
			const pokemonResponseData =
				await this.pokemonController.getOne(pokemonId);

			return res
				.status(pokemonResponseData.status)
				.json(pokemonResponseData.body);
		} catch (error) {
			next(error);
		}
	}

	async getAllPokemons(
		this: PokemonRouteHandlersExpress,
		_: unknown,
		res: Response,
		next: NextFunction,
	) {
		try {
			const pokemonListResponseData = await this.pokemonController.getAll();

			return res
				.status(pokemonListResponseData.status)
				.json(pokemonListResponseData.body);
		} catch (error) {
			next(error);
		}
	}
}
