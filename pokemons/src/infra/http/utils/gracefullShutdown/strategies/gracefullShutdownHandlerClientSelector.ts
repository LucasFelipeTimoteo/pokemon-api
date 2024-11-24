import type { CustomRedisClient } from "../../../../services/db/redis/types/RedisClientTypes";
import { redisDriverClientValidator } from "../../../../validators/clients/redis/redisDriver/redisDriverClientValidator";
import type { GracefullShutdownHandlerStrategyType } from "../types/gracefullShutdownHandlerStrategy";
import { GracefullShutdownRedisStrategy } from "./redis/gracefullShutdownRedisStrategy";

type gracefullShutdownHandlerClientSelectorClientNames = "redis";
type gracefullShutdownHandlerClientSelectorClients = CustomRedisClient;

export const gracefullShutdownHandlerClientSelector = async (
	clientName: gracefullShutdownHandlerClientSelectorClientNames,
	client: gracefullShutdownHandlerClientSelectorClients,
) => {
	let strategyHandler: GracefullShutdownHandlerStrategyType;
	const errorMessage = `Incorrect client type. [client] is incomplatible with provided [clientName: ${clientName}]`;

	switch (clientName) {
		case "redis": {
			const validatedClient = await redisDriverClientValidator(client);
			if (!validatedClient) {
				throw Error(errorMessage);
			}
			strategyHandler = new GracefullShutdownRedisStrategy(validatedClient);
			break;
		}
	}

	return strategyHandler;
};
