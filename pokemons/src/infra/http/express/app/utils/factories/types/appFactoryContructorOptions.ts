import type { PokemonController } from "../../../../../../../adapters/controllers/pokemon/pokemonController";
import type { logger } from "../../../../../../../application/logger/logger";
import type { PokemonChacheRepository } from "../../../../../../../application/repository/pokemonCache/pokemonCacheRepository";
import type { PokemonValidator } from "../../../../../../../application/validation/pokemon/pokemonValidator";
import type { CustomRedisClient } from "../../../../../../services/db/redis/types/RedisClientTypes";
import type { PokemonAxiosHttpClient } from "../../../../../../services/httpRequests/axios/PokemonAxiosHttpClient";
import type { PokemonRouteHandlersExpress } from "../../../../routeHandlers/pokemon/pokemonRouteHandlersExpress";
import type { PokemonRouter } from "../../../../routers/pokemon/pokemonRouter";

export type AppFactoryOptions = {
	cacheDatabaseClient: Promise<CustomRedisClient>;
	logger?: logger;
	pokemonCacheClientRepository?: PokemonChacheRepository;
	pokemonValidator?: PokemonValidator<unknown>;
	pokemonHttpClient?: PokemonAxiosHttpClient;
	pokemonController?: PokemonController;
	pokemonRouteHandlers?: PokemonRouteHandlersExpress;
	pokemonRouter?: PokemonRouter;
};
