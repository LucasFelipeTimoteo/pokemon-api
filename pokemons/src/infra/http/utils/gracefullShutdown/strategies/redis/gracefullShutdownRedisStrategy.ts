import type { CustomRedisClient } from "../../../../../services/db/redis/types/RedisClientTypes";
import type { GracefullShutdownHandlerStrategyType } from "../../types/gracefullShutdownHandlerStrategy";

export class GracefullShutdownRedisStrategy
	implements GracefullShutdownHandlerStrategyType
{
	constructor(private redisClient: CustomRedisClient) {}

	async exec() {
		this.redisClient.disconnect();

		return true;
	}
}
