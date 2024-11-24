import { UsersController } from "../../../../../../adapters/controllers/users/usersController";
import { Aes256Cbc } from "../../../../../../application/crypto/simetric/aes/aes256Cbc/aes256cbc";
import { appEnv } from "../../../../../../global/utils/env/appEnv/appEnv";
import { HashPasswordBcrypt } from "../../../../../parsers/password/hashing/bcrypt/passwordHasherBcrypt";
import { pinoLogger } from "../../../../../pino/pinoLogger";
import { UsersRepositoryMongoose } from "../../../../../repository/mongoose/users/usersRepositoryMongoose";
import { UsersCacheRepositoryRedis } from "../../../../../repository/redis/users/usersCacheRepositoryRedis";
import { UsersModel } from "../../../../../services/db/mongoose/models/usersModel/usersModelMongoose";
import type { CustomRedisClient } from "../../../../../services/db/redis/types/RedisClientTypes";
import { JWTTokensByJsonWebTokenLib } from "../../../../../tokens/jwt/jsonWebTokenLib/JWTTokensByJsonWebTokenLib";
import { usersRouteHandlerExpress } from "../../../routehandlers/users/userRouteHandlerExpress";
import { UsersRouter } from "../../../routers/users/usersRouter";
import { ExpressApp } from "../../app";

export const Appfactory = (
	cacheClient: Promise<CustomRedisClient>,
	{
		logger = pinoLogger,
		usersModel = UsersModel(),
		passwordHasher = new HashPasswordBcrypt(),
		usersCacheRepository = new UsersCacheRepositoryRedis(cacheClient),
		usersRepository = new UsersRepositoryMongoose(usersModel, passwordHasher),
		jwtTokens = new JWTTokensByJsonWebTokenLib(),
		aes256cbc = new Aes256Cbc(appEnv.refreshTokenAESSecret),
		usersController = new UsersController(
			usersRepository,
			usersCacheRepository,
			logger,
			passwordHasher,
			jwtTokens,
			aes256cbc,
		),
		usersRouteHandler = new usersRouteHandlerExpress(usersController),
		usersRouter = new UsersRouter(usersRouteHandler),
	},
) => {
	const app = new ExpressApp(usersRouter, logger);

	return app;
};
