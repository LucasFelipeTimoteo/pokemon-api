import { pinoLogger } from "../../logger/pino/pinoLogger";
import { getRedisClient } from "../../services/db/redis/redisClient";
import { AppFactory } from "./app/utils/factories/appFactory";
import { ExpressEntryPoint } from "./entrypoint";

const redisClient = getRedisClient(pinoLogger);
const app = AppFactory({ cacheDatabaseClient: redisClient });
const entryPoint = new ExpressEntryPoint(app, redisClient, pinoLogger);

entryPoint.listen();
