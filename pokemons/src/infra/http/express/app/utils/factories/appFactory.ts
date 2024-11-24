import { PokemonController } from "../../../../../../adapters/controllers/pokemon/pokemonController";
import { pinoLogger } from "../../../../../logger/pino/pinoLogger";
import { PokemonCacheRedisRepository } from "../../../../../repository/pokemonCache/redis/pokemonCacheRedisRepository";
import { PokemonAxiosHttpClient } from "../../../../../services/httpRequests/axios/PokemonAxiosHttpClient";
import { zodPokemonValidator } from "../../../../../validators/pokemon/zod/zodPokemonValidator";
import { PokemonRouteHandlersExpress } from "../../../routeHandlers/pokemon/pokemonRouteHandlersExpress";
import { PokemonRouter } from "../../../routers/pokemon/pokemonRouter";
import { ExpressApp } from "../../app";
import type { AppFactoryOptions } from "./types/appFactoryContructorOptions";

export const AppFactory = ({
	cacheDatabaseClient,
	logger = pinoLogger,
	pokemonValidator = zodPokemonValidator,
	pokemonHttpClient = new PokemonAxiosHttpClient(pokemonValidator, logger),

	pokemonCacheClientRepository = new PokemonCacheRedisRepository(
		cacheDatabaseClient,
		pokemonValidator,
		logger,
	),

	pokemonController = new PokemonController(
		pokemonHttpClient,
		pokemonCacheClientRepository,
		logger,
	),

	pokemonRouteHandlers = new PokemonRouteHandlersExpress(pokemonController),
	pokemonRouter = new PokemonRouter(pokemonRouteHandlers),
}: AppFactoryOptions) => {
	const app = new ExpressApp(pokemonRouter, logger);

	return app;
};
