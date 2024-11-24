import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { MongooseClient } from "../../../../services/db/mongoose/types/mongooseTypes";
import type { CustomRedisClient } from "../../../../services/db/redis/types/RedisClientTypes";

export type EntrypointDatabaseClients = Promise<MongooseClient>;
export type EntrypointCacheDatabaseClients = Promise<CustomRedisClient>;
export type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
