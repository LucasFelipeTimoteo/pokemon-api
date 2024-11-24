import { AppEnv, type AppEnvType } from "../../utils/appEnv/appEnv";
import { appEnvValidatorZod } from "../../utils/appEnvValidatorZod/appEnvValidatorZod";
import { dotenvEnvParser } from "../../utils/dotenvParser/dotenvParser";

const testEnvFilePath = "./src/global/env/__tests__/fake.env";
let validExpectedEnv: AppEnvType;

beforeEach(() => {
	validExpectedEnv = {
		appLocal: "local_machine",
		nodeEnv: "test",
		appPort: "9999",
		corsWhitelist: "http://my-origin.com, *",
		documentationAppPort: "9000",
		rateLimitTimeMinutes: "10",
		rateLimitMaxRequests: "100",
		JWTAuthSecret: "87HDNWEPOF2HBKJLJHBT6tB6iuon82uhnuyn7Y8Iom88!",
		pokemonServicePort: "3001",
		pokemonServiceNetworkName: "pokemon-service",
		usersServicePort: "3000",
		usersServiceNetworkName: "users-service",
		usersServiceHost: "localhost",
		pokemonServiceHost: "localhost",
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
			pokemonServiceHost: "pokemon-service",
			usersServiceHost: "users-service",
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

	it("Should throw an errow if [RATE_LIMIT_TIME_MINUTES] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.RATE_LIMIT_TIME_MINUTES = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [RATE_LIMIT_MAX_REQUESTS] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.RATE_LIMIT_MAX_REQUESTS = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [JWT_AUTH_SECRET] is not string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.JWT_AUTH_SECRET = 123;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [POKEMON_SERVICE_NETWORK_NAME] is not string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.POKEMON_SERVICE_NETWORK_NAME = 123;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [POKEMON_SERVICE_PORT] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.POKEMON_SERVICE_PORT = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [USERS_SERVICE_PORT] is not a numeric string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.USERS_SERVICE_PORT = "not a numeric string";
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});

	it("Should throw an errow if [USERS_SERVICE_NETWORK_NAME] is not a string", () => {
		const envObj = dotenvEnvParser.parseEnvFileToObj(testEnvFilePath) as any;
		envObj.USERS_SERVICE_NETWORK_NAME = 123;
		expect(() => new AppEnv(envObj, appEnvValidatorZod)).toThrow();
	});
});
