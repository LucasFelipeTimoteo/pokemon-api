import type { CustomRedisClient } from "../../../../services/db/redis/types/RedisClientTypes";

export const redisDriverClientValidator = async (client: unknown) => {
	const typeCoersedClient = client as CustomRedisClient;

	const libname = (await typeCoersedClient.clientInfo()).libName;

	if (libname === "node-redis") {
		return typeCoersedClient;
	}

	return null;
};
