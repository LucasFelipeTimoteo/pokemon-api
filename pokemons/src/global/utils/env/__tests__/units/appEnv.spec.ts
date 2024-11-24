import { dotenvEnvParser } from "../../../../../infra/parsers/dotenv/dotenvEnvparser";
import { appEnvValidatorZod } from "../../../../../infra/validators/env/zod/appEnvValidatorZod";
import { AppEnv } from "../../appEnv";
import type { AppEnvType } from "../../types/appEnvTypes";

const testEnvFilePath = "./src/global/utils/env/__tests__/fake.env";
let validExpectedEnv: AppEnvType;

beforeEach(() => {
	validExpectedEnv = {
		appLocal: "local_machine",
		nodeEnv: "test",
		appPort: "9999",
		corsWhitelist: "http://my-origin.com, *",
		documentationAppPort: "4001",
		redisTestdatabase: "2",
		redisURL: "redis://127.0.0.1:6379",
		redisPokemonKeyBase: "pokemon",
		redisPokemonListKey: "pokemonList",
		redisCacheTTLDays: "60",
		redisPort: "6379",
	};
});

describe("AppEnv", () => {
	//HAPPY PATH
	it("Should be an object with all correct data if given a valid object", async () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath);
		const appEnv = new AppEnv(envObj, appEnvValidatorZod);

		expect(appEnv).toMatchObject(validExpectedEnv);
	});

	it("Should be an object with all correct data if given a valid object and [APP_LOCAL] is [local_machine]", async () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		const appEnv = new AppEnv(envObj, appEnvValidatorZod);

		expect(appEnv).toMatchObject(validExpectedEnv);
	});

	it("Should be an object with all correct data if given a valid object and [APP_LOCAL] is [docker]", async () => {
		const expectedValidEnvWithAppLocalDocker = {
			...validExpectedEnv,
			appLocal: "docker",
			redisURL: "redis://redis:6379",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any; // type casting necessary to prevent type errors
		envObj.APP_LOCAL = "docker";
		const appEnv = new AppEnv(envObj, appEnvValidatorZod);

		expect(appEnv).toMatchObject(expectedValidEnvWithAppLocalDocker);
	});

	it("Should be an object with all correct data if given a valid object and [NODE_ENV] is [test]", async () => {
		const validExpectedEnvWithNodeEnvTest = {
			...validExpectedEnv,
			nodeEnv: "test",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "test";
		const appEnv = new AppEnv(envObj, appEnvValidatorZod);

		expect(appEnv).toMatchObject(validExpectedEnvWithNodeEnvTest);
	});

	it("Should be an object with all correct data if given a valid object and [NODE_ENV] is [development]", async () => {
		const validExpectedEnvWithNodeEnvTest = {
			...validExpectedEnv,
			nodeEnv: "development",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "development";
		const appEnv = new AppEnv(envObj, appEnvValidatorZod);

		expect(appEnv).toMatchObject(validExpectedEnvWithNodeEnvTest);
	});

	it("Should be an object with all correct data if given a valid object and [NODE_ENV] is [production]", async () => {
		const validExpectedEnvWithNodeEnvTest = {
			...validExpectedEnv,
			nodeEnv: "production",
		};

		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "production";
		const appEnv = new AppEnv(envObj, appEnvValidatorZod);

		expect(appEnv).toMatchObject(validExpectedEnvWithNodeEnvTest);
	});

	// 	// UNHAPPY PATH
	it("Should throw an errow if [APP_PORT] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_PORT = 1222;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [APP_PORT] is a string that is not numeric", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_PORT = "some non numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [APP_PORT] is a string that is not numeric", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_PORT = "some non numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [APP_LOCAL] is a string that is not [docker] or [local_machine]", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.APP_LOCAL = "not a valid value";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [DOCUMENTATION_APP_PORT] is a string that is not numeric", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.DOCUMENTATION_APP_PORT = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [NODE_ENV] is not [production], [development] or [test]", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.NODE_ENV = "not a valid value";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [CORS_WHITELIST] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.CORS_WHITELIST = 12334;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [REDIS_TEST_DATABASE] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_TEST_DATABASE = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [REDIS_PORT] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_PORT = 122312;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [REDIS_POKEMON_KEY_BASE] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_POKEMON_KEY_BASE = 122312;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [REDIS_POKEMON_LIST_KEY] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_POKEMON_LIST_KEY = 122312;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [REDIS_CACHE_TTL_DAYS] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.REDIS_CACHE_TTL_DAYS = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});
});
