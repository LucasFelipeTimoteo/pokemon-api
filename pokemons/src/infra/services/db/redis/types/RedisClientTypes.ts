import type { getRedisClient } from "../redisClient";

export type CustomRedisClient = Awaited<ReturnType<typeof getRedisClient>>;
