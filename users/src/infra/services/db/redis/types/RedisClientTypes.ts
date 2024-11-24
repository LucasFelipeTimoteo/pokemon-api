import type { getRedisClient } from "../redisService";

export type CustomRedisClient = Awaited<ReturnType<typeof getRedisClient>>;
