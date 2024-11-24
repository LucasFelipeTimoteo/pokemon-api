import type {
	AppMachineType,
	EnvSecrets,
	EnvValues,
	NodeEnvs,
} from "../../../../application/validation/env/appEnv/types/appEnvTypes";
import type { AppEnvValidator } from "../../../../application/validation/env/appEnv/types/appEnvValidator";
import { protectInstance } from "../../../../domain/utils/protectInstance/protectinstance";
import { dotenvEnvParser } from "../../../../infra/parsers/dotenv/dotenvEnvparser";
import { appEnvValidatorZod } from "../../../../infra/validators/env/zod/appEnvValidatorZod";

export class AppEnv {
	appLocal: AppMachineType;
	appPort: string;
	documentationAppPort: string;
	nodeEnv: NodeEnvs;
	corsWhitelist: string;
	mongoDatabaseName: string;
	mongoUsersCollection: string;
	mongoPort: string;
	mongoUrl: string;
	redisTestDatabase: string;
	redisUsersKeyBase: string;
	redisUserPokemonsListKey: string;
	redisUserRefreshTokenKey: string;
	redisPort: string;
	redisUrl: string;
	salt: string;
	accessTokenJwtSecret: string;
	refreshTokenTTLDays: string;
	accessTokenTTLMinutes: string;
	refreshTokenAESSecret: string;
	refreshTokenJwtSecret: string;

	constructor(
		appEnvValidator: AppEnvValidator,
		public envValues: EnvValues,
		public envSecrets: EnvSecrets,
	) {
		this.appLocal = this.#appLocalValidation(
			this.envValues.APP_LOCAL,
			appEnvValidator,
		);
		this.nodeEnv = this.#nodeEnvValidation(
			this.envValues.NODE_ENV,
			appEnvValidator,
		);
		this.appPort = this.#numericStringValidation(
			this.envValues.APP_PORT,
			appEnvValidator,
		);
		this.corsWhitelist = this.#stringValidation(
			this.envValues.CORS_WHITELIST,
			appEnvValidator,
		);
		this.documentationAppPort = this.#numericStringValidation(
			this.envValues.DOCUMENTATION_APP_PORT,
			appEnvValidator,
		);

		this.mongoDatabaseName = this.#stringValidation(
			this.envValues.MONGO_DATABASE_NAME,
			appEnvValidator,
		);
		this.mongoUsersCollection = this.#stringValidation(
			this.envValues.MONGO_USERS_COLLECTION,
			appEnvValidator,
		);
		this.mongoPort = this.#numericStringValidation(
			this.envValues.MONGO_PORT,
			appEnvValidator,
		);
		this.mongoUrl = this.#getMongoUrl(
			this.appLocal,
			this.mongoPort,
			appEnvValidator,
		);

		this.redisTestDatabase = this.#numericStringValidation(
			this.envValues.REDIS_TEST_DATABASE,
			appEnvValidator,
		);
		this.redisUsersKeyBase = this.#stringValidation(
			this.envValues.REDIS_USERS_KEY_BASE,
			appEnvValidator,
		);
		this.redisUserPokemonsListKey = this.#stringValidation(
			this.envValues.REDIS_USER_POKEMONS_LIST_KEY,
			appEnvValidator,
		);

		this.redisUserRefreshTokenKey = this.#stringValidation(
			this.envValues.REDIS_USER_REFRESH_TOKEN_KEY,
			appEnvValidator,
		);

		this.refreshTokenTTLDays = this.#numericStringValidation(
			this.envValues.REFRESH_TOKEN_TTL_DAYS,
			appEnvValidator,
		);

		this.accessTokenTTLMinutes = this.#numericStringValidation(
			this.envValues.ACCESS_TOKEN_TTL_MINUTES,
			appEnvValidator,
		);

		this.redisPort = this.#numericStringValidation(
			this.envValues.REDIS_PORT,
			appEnvValidator,
		);

		this.redisUrl = this.#getRedisUrl(
			this.appLocal,
			this.redisPort,
			appEnvValidator,
		);

		this.salt = this.#numericStringValidation(
			this.envValues.SALT,
			appEnvValidator,
		);

		const secrets = this.#getSecretEnvs();
		this.accessTokenJwtSecret = this.#stringValidation(
			secrets.ACCESS_TOKEN_JWT_SECRET,
			appEnvValidator,
		);

		this.refreshTokenAESSecret = this.#stringValidation(
			secrets.REFRESH_TOKEN_AES_SECRET,
			appEnvValidator,
		);

		this.refreshTokenJwtSecret = this.#stringValidation(
			secrets.REFRESH_TOKEN_JWT_SECRET,
			appEnvValidator,
		);
	}

	getValidatedEnvValues() {
		const { envSecrets: _1, envValues: _2, ...validatedValues } = this;
		protectInstance(validatedValues, false);

		return validatedValues;
	}

	#stringValidation(envVar: unknown, appEnvValidator: AppEnvValidator): string {
		return appEnvValidator.stringValidation(envVar);
	}

	#numericStringValidation(
		envVar: unknown,
		appEnvValidator: AppEnvValidator,
	): string {
		return appEnvValidator.numericStringValidation(envVar);
	}

	#appLocalValidation(
		machineLocalEnv: unknown,
		appEnvValidator: AppEnvValidator,
	): AppMachineType {
		return appEnvValidator.appLocalValidation(machineLocalEnv);
	}

	#nodeEnvValidation(
		nodeEnv: unknown,
		appEnvValidator: AppEnvValidator,
	): NodeEnvs {
		return appEnvValidator.nodeEnvValidation(nodeEnv);
	}

	#getMongoUrl(
		appLocal: AppMachineType,
		port: string,
		validator: AppEnvValidator,
	) {
		const urlProtocol = "mongodb";
		const urlDomain = appLocal === "docker" ? "mongo" : "127.0.0.1";
		const url = `${urlProtocol}://${urlDomain}:${port}`;
		this.#stringValidation(url, validator);

		return url;
	}

	#getRedisUrl(
		appLocal: AppMachineType,
		port: string,
		validator: AppEnvValidator,
	) {
		const urlProtocol = "redis";
		const urlDomain = appLocal === "docker" ? "redis" : "127.0.0.1";
		const url = `${urlProtocol}://${urlDomain}:${port}`;
		this.#stringValidation(url, validator);

		return url;
	}

	#getSecretEnvs() {
		return {
			ACCESS_TOKEN_JWT_SECRET: this.envSecrets.ACCESS_TOKEN_JWT_SECRET,
			REFRESH_TOKEN_JWT_SECRET: this.envSecrets.REFRESH_TOKEN_JWT_SECRET,
			REFRESH_TOKEN_AES_SECRET: this.envSecrets.REFRESH_TOKEN_AES_SECRET,
		};
	}
}

// it Is not a problem to use type casting because it will be validated
const parsedEnvObj = dotenvEnvParser.parseEnvFileToObj(".env") as EnvValues;
const parsedSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
	"secrets.env",
	process.env.APP_ENV,
) as EnvSecrets;

export const appEnv = new AppEnv(
	appEnvValidatorZod,
	parsedEnvObj,
	parsedSecretsObj,
).getValidatedEnvValues();
