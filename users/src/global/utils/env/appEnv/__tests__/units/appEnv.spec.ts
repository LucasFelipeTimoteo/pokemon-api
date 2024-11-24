import type {
	EnvSecrets,
	EnvValues,
} from "../../../../../../application/validation/env/appEnv/types/appEnvTypes";
import {
	AppEnv,
	appEnv as env,
} from "../../../../../../global/utils/env/appEnv/appEnv";
import type { AppEnvType } from "../../../../../../global/utils/env/appEnv/types/appEnvType";
import { dotenvEnvParser } from "../../../../../../infra/parsers/dotenv/dotenvEnvparser";
import { appEnvValidatorZod } from "../../../../../../infra/validators/env/zod/appEnvValidatorZod";
import { getNonEnumerableProps } from "../../../getNonEnumerableProps/getNonEnumerableProps";

const testEnvFilePath = "./src/global/utils/env/appEnv/__tests__/fake.env";
const testEnvSecretsFilePath =
	"./src/global/utils/env/appEnv/__tests__/fake_secrets.env";

let validExpectedEnv: AppEnvType;

beforeEach(() => {
	validExpectedEnv = {
		appLocal: "local_machine",
		nodeEnv: "test",
		appPort: "3000",
		corsWhitelist: "http://my-origin.com, *",
		documentationAppPort: "4000",
		mongoDatabaseName: "usersService",
		mongoUsersCollection: "users",
		mongoPort: "27017",
		mongoUrl: "mongodb://127.0.0.1:27017",
		redisTestDatabase: "2",
		redisUsersKeyBase: "users",
		redisUserPokemonsListKey: "userPokemonsList",
		redisPort: "6379",
		redisUrl: "redis://127.0.0.1:6379",
		salt: "10",
		accessTokenJwtSecret: "87HDNWEPOF2HBKJLJHBT6tB6iuon82uhnuyn7Y8Iom88!",
		refreshTokenAESSecret:
			"<SBjsjHSJSKllssSÇÇSSIS-9yHbsbsKkksNNNBSS¨%$EDSNMLllLKKJS6ss5sgxssgizalgs",
		refreshTokenJwtSecret: "NCBNbx66b3!!%%MMjbs8askdhSj4i$R8s6hnsjKDAsjsjbuYv",
		redisUserRefreshTokenKey: "userRefreshToken",
		refreshTokenTTLDays: "180",
		accessTokenTTLMinutes: "60",
	};
});

describe("AppEnv", () => {
	//HAPPY PATH
	it("Should be an object with all correct data if given a valid object", async () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(
			testEnvFilePath,
		) as EnvValues;

		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		const appEnv = new AppEnv(
			appEnvValidatorZod,
			envObj,
			envSecretsObj,
		).getValidatedEnvValues();

		expect(getNonEnumerableProps(appEnv)).toEqual(validExpectedEnv);
	});

	it("Should be an object with all correct data if given a valid object and [APP_LOCAL] is [local_machine]", async () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(
			testEnvFilePath,
		) as EnvValues;

		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		const appEnv = new AppEnv(
			appEnvValidatorZod,
			envObj,
			envSecretsObj,
		).getValidatedEnvValues();

		expect(getNonEnumerableProps(appEnv)).toEqual(validExpectedEnv);
	});

	it("Should be an object with all correct data if given a valid object and [APP_LOCAL] is [docker]", async () => {
		const expectedValidEnvWithAppLocalDocker = {
			...validExpectedEnv,
			appLocal: "docker",
			mongoUrl: "mongodb://mongo:27017",
			redisUrl: "redis://redis:6379",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(
			testEnvFilePath,
		) as EnvValues;

		envObj.APP_LOCAL = "docker";

		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		const appEnv = new AppEnv(
			appEnvValidatorZod,
			envObj,
			envSecretsObj,
		).getValidatedEnvValues();

		expect(getNonEnumerableProps(appEnv)).toEqual(
			expectedValidEnvWithAppLocalDocker,
		);
	});

	it("Should be an object with all correct data if given a valid object and [NODE_ENV] is [test]", async () => {
		const validExpectedEnvWithNodeEnvTest = {
			...validExpectedEnv,
			nodeEnv: "test",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "test";

		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		const appEnv = new AppEnv(
			appEnvValidatorZod,
			envObj,
			envSecretsObj,
		).getValidatedEnvValues();

		expect(getNonEnumerableProps(appEnv)).toEqual(
			validExpectedEnvWithNodeEnvTest,
		);
	});

	it("Should be an object with all correct data if given a valid object and [NODE_ENV] is [development]", async () => {
		const validExpectedEnvWithNodeEnvTest = {
			...validExpectedEnv,
			nodeEnv: "development",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "development";

		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		const appEnv = new AppEnv(
			appEnvValidatorZod,
			envObj,
			envSecretsObj,
		).getValidatedEnvValues();

		expect(getNonEnumerableProps(appEnv)).toEqual(
			validExpectedEnvWithNodeEnvTest,
		);
	});

	it("Should be an object with all correct data if given a valid object and [NODE_ENV] is [production]", async () => {
		const validExpectedEnvWithNodeEnvTest = {
			...validExpectedEnv,
			nodeEnv: "production",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "production";

		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		const appEnv = new AppEnv(
			appEnvValidatorZod,
			envObj,
			envSecretsObj,
		).getValidatedEnvValues();

		expect(getNonEnumerableProps(appEnv)).toEqual(
			validExpectedEnvWithNodeEnvTest,
		);
	});

	// // UNHAPPY PATH
	it("Should throw an errow if [APP_PORT] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_PORT = 1222;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [APP_PORT] is a string that is not numeric", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_PORT = "some non numeric string";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [APP_PORT] is a string that is not numeric", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_PORT = "some non numeric string";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [APP_LOCAL] is a string that is not [docker] or [local_machine]", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_LOCAL = "not a valid value";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [DOCUMENTATION_APP_PORT] is a string that is not numeric", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.DOCUMENTATION_APP_PORT = "not a numeric string";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [NODE_ENV] is not [production], [development] or [test]", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "not a valid value";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [CORS_WHITELIST] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.CORS_WHITELIST = 12334;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [MONGO_DATABASE_NAME] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.MONGO_DATABASE_NAME = 12334;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [MONGO_USERS_COLLECTION] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.MONGO_USERS_COLLECTION = 12334;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [MONGO_PORT] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.MONGO_PORT = 12334;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REDIS_TEST_DATABASE] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_TEST_DATABASE = "not a numeric string";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REDIS_USERS_KEY_BASE] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_USERS_KEY_BASE = 1234;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REDIS_USER_POKEMONS_LIST_KEY] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_USER_POKEMONS_LIST_KEY = 1234;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REDIS_PORT] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_PORT = 1234;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REDIS_USER_REFRESH_TOKEN_KEY] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_USER_REFRESH_TOKEN_KEY = 1234;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
			false,
		) as EnvSecrets;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [ACCESS_TOKEN_JWT_SECRET] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
		) as any;

		envSecretsObj.ACCESS_TOKEN_JWT_SECRET = 1234;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REFRESH_TOKEN_JWT_SECRET] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
		) as any;

		envSecretsObj.REFRESH_TOKEN_JWT_SECRET = 1234;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [REFRESH_TOKEN_AES_SECRET] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
		) as any;

		envSecretsObj.REFRESH_TOKEN_AES_SECRET = 1234;

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});

	it("Should throw an errow if [ACCESS_TOKEN_TTL_MINUTES] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.ACCESS_TOKEN_TTL_MINUTES = "not a numeric string";
		const envSecretsObj = dotenvEnvParser.parseEnvSecretsToObj(
			testEnvSecretsFilePath,
			env.appLocal,
		) as any;

		envSecretsObj.ACCESS_TOKEN_TTL_MINUTES = "minutes";

		expect(() =>
			new AppEnv(
				appEnvValidatorZod,
				envObj,
				envSecretsObj,
			).getValidatedEnvValues(),
		).toThrow();
	});
});
