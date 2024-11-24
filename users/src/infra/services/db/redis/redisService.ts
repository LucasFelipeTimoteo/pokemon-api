import { createClient } from "redis";
import type { logger } from "../../../../application/logger/logger";
import { appEnv } from "../../../../global/utils/env/appEnv/appEnv";

export const getRedisClient = async (logger: logger) => {
	const client = await createClient({ url: appEnv.redisUrl })
		.on("error", (err) => logger.info(`[Redis Client Error]: ${err}`))
		.connect();

	logger.info("Connected to Redis");

	return client;
};
