import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { CustomRedisClient } from "../../../../services/db/redis/types/RedisClientTypes";

export type EntrypointCacheDatabaseClients = Promise<CustomRedisClient>;
export type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
