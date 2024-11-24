import type {
	AppMachineType,
	EnvValues,
	NodeEnvs,
} from "../../../application/validation/env/appEnv/types/appEnvTypes";
import type { AppEnvValidator } from "../../../application/validation/env/appEnv/types/appEnvValidator";
import { protectInstance } from "../../../domain/utils/protectInstance/protectinstance";
import { dotenvEnvParser } from "../../../infra/parsers/dotenv/dotenvEnvparser";
import { appEnvValidatorZod } from "../../../infra/validators/env/zod/appEnvValidatorZod";

export class AppEnv {
	appLocal: AppMachineType;
	appPort: string;
	documentationAppPort: string;
	nodeEnv: NodeEnvs;
	corsWhitelist: string;
	redisTestdatabase: string;
	redisPokemonKeyBase: string;
	redisPokemonListKey: string;
	redisCacheTTLDays: string;
	redisPort: string;
	redisURL: string;

	constructor(
		private envValues: EnvValues,
		appEnvValidator: AppEnvValidator,
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
		this.redisTestdatabase = this.#numericStringValidation(
			this.envValues.REDIS_TEST_DATABASE,
			appEnvValidator,
		);
		this.redisPort = this.#numericStringValidation(
			this.envValues.REDIS_PORT,
			appEnvValidator,
		);
		this.redisURL = this.#getRedisUrl(
			this.appLocal,
			this.redisPort,
			appEnvValidator,
		);

		this.redisPokemonKeyBase = this.#stringValidation(
			this.envValues.REDIS_POKEMON_KEY_BASE,
			appEnvValidator,
		);
		this.redisPokemonListKey = this.#stringValidation(
			this.envValues.REDIS_POKEMON_LIST_KEY,
			appEnvValidator,
		);
		this.redisCacheTTLDays = this.#numericStringValidation(
			this.envValues.REDIS_CACHE_TTL_DAYS,
			appEnvValidator,
		);
	}

	getValidatedEnvValues() {
		const { envValues: _, ...validatedValues } = this;
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
}

const parsedEnvObj = dotenvEnvParser.parseEnvFileToObj(".env");

export const appEnv = new AppEnv(
	parsedEnvObj,
	appEnvValidatorZod,
).getValidatedEnvValues();
