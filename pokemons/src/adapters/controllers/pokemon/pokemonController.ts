import type { PokemonHttpClient } from "../../../application/clients/http/pokemon/types/pokemonHttpClient";
import type { logger } from "../../../application/logger/logger";
import type { PokemonChacheRepository } from "../../../application/repository/pokemonCache/pokemonCacheRepository";
import { GetAllPokemonsCase } from "../../../application/useCases/cases/getAllPokemons/getAllPokemonsCase";
import { GetOnePokemonCase } from "../../../application/useCases/cases/getOnePokemon/getOnePokemonCase";
import type { Pokemon } from "../../../domain/entities/pokemon/types/pokemon";
import {
	type HttpResponse,
	httpResponsePresenter,
} from "../../presenters/http/response/httpResponsePresenter";

export class PokemonController {
	constructor(
		private pokemonHttpClient: PokemonHttpClient,
		private pokemonCacheClientRepository: PokemonChacheRepository,
		private logger: logger,
	) {}

	async getAll(): Promise<HttpResponse<Pokemon[]>> {
		const getAllPokemonsCase = new GetAllPokemonsCase(
			this.pokemonHttpClient,
			this.pokemonCacheClientRepository,
			this.logger,
		);
		const pokemons = await getAllPokemonsCase.getAll();

		return httpResponsePresenter.ok(pokemons);
	}

	async getOne(pokemonId: number): Promise<HttpResponse<Pokemon>> {
		const getOnePokemonCase = new GetOnePokemonCase(
			this.pokemonHttpClient,
			this.pokemonCacheClientRepository,
			this.logger,
		);
		const pokemon = await getOnePokemonCase.getOne(pokemonId);

		return httpResponsePresenter.ok(pokemon);
	}
}
