import type {
	AppMachineType,
	EnvValues,
	NodeEnvs,
} from "../../types/appEnvType";
import type { AppEnvValidator } from "../../types/appEnvValidator";
import { appEnvValidatorZod } from "../appEnvValidatorZod/appEnvValidatorZod";
import { dotenvEnvParser } from "../dotenvParser/dotenvParser";
import { protectInstance } from "../protectInstance/protectInstance";

export class AppEnv {
	appLocal: AppMachineType;
	appPort: string;
	documentationAppPort: string;
	nodeEnv: NodeEnvs;
	corsWhitelist: string;
	rateLimitTimeMinutes: string;
	rateLimitMaxRequests: string;
	JWTAuthSecret: string;
	pokemonServicePort: string;
	pokemonServiceHost: string;
	pokemonServiceNetworkName: string;
	usersServicePort: string;
	usersServiceHost: string;
	usersServiceNetworkName: string;

	constructor(
		public envValues: EnvValues,
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
		this.rateLimitTimeMinutes = this.#numericStringValidation(
			this.envValues.RATE_LIMIT_TIME_MINUTES,
			appEnvValidator,
		);
		this.rateLimitMaxRequests = this.#numericStringValidation(
			this.envValues.RATE_LIMIT_MAX_REQUESTS,
			appEnvValidator,
		);
		this.JWTAuthSecret = this.#stringValidation(
			this.envValues.JWT_AUTH_SECRET,
			appEnvValidator,
		);
		this.pokemonServicePort = this.#numericStringValidation(
			this.envValues.POKEMON_SERVICE_PORT,
			appEnvValidator,
		);
		this.pokemonServiceNetworkName = this.#stringValidation(
			this.envValues.POKEMON_SERVICE_NETWORK_NAME,
			appEnvValidator,
		);
		this.usersServicePort = this.#numericStringValidation(
			this.envValues.USERS_SERVICE_PORT,
			appEnvValidator,
		);
		this.usersServiceNetworkName = this.#stringValidation(
			this.envValues.USERS_SERVICE_NETWORK_NAME,
			appEnvValidator,
		);
		this.usersServiceHost =
			this.appLocal === "docker" ? this.usersServiceNetworkName : "localhost";
		this.pokemonServiceHost =
			this.appLocal === "docker" ? this.pokemonServiceNetworkName : "localhost";
	}

	getValidatedEnvValues() {
		const { envValues: _2, ...validatedValues } = this;
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
}

// it Is not a problem to use type casting because it will be validated
const parsedEnvObj = dotenvEnvParser.parseEnvFileToObj(".env") as EnvValues;

export const appEnv = new AppEnv(
	parsedEnvObj,
	appEnvValidatorZod,
).getValidatedEnvValues();

export type AppEnvType = typeof appEnv;
