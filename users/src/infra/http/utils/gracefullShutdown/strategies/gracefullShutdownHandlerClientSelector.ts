import type { MongooseClient } from "../../../../services/db/mongoose/types/mongooseTypes";
import type { CustomRedisClient } from "../../../../services/db/redis/types/RedisClientTypes";
import type { GracefullShutdownHandlerStrategyType } from "../types/gracefullShutdownHandlerStrategy";
import { GracefullShutdownMongooseStrategy } from "./mongoose/gracefullShutdownMongooseStrategy";
import { GracefullShutdownRedisStrategy } from "./redis/gracefullShutdownRedisStrategy";

type gracefullShutdownHandlerClientSelectorClientNames = "mongoose" | "redis";
type gracefullShutdownHandlerClientSelectorClients =
	| MongooseClient
	| CustomRedisClient;

export const gracefullShutdownHandlerClientSelector = async (
	clientName: gracefullShutdownHandlerClientSelectorClientNames,
	client: gracefullShutdownHandlerClientSelectorClients,
) => {
	let strategyHandler: GracefullShutdownHandlerStrategyType;
	switch (clientName) {
		case "mongoose": {
			strategyHandler = new GracefullShutdownMongooseStrategy(
				client as MongooseClient,
			);
			break;
		}
		case "redis": {
			strategyHandler = new GracefullShutdownRedisStrategy(
				client as CustomRedisClient,
			);
			break;
		}
	}

	return strategyHandler;
};
