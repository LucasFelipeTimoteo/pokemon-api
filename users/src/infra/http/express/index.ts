import { pinoLogger } from "../../pino/pinoLogger";
import { MongooseService } from "../../services/db/mongoose/mongooseService";
import { getRedisClient } from "../../services/db/redis/redisService";
import { Appfactory } from "./app/utils/factories/appFactory";
import { ExpressEntryPoint } from "./entrypoint";

const mongooseClient = new MongooseService(pinoLogger).connect();
const redisClient = getRedisClient(pinoLogger);
const app = Appfactory(redisClient, {});

const expressEntryPoint = new ExpressEntryPoint(
	app,
	pinoLogger,
	mongooseClient,
	redisClient,
);

expressEntryPoint.listen();
