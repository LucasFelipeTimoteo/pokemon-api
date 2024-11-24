export type EnvValues = {
	APP_LOCAL: string;
	APP_PORT: string;
	DOCUMENTATION_APP_PORT: string;
	NODE_ENV: string;
	CORS_WHITELIST: string;
	MONGO_DATABASE_NAME: string;
	MONGO_USERS_COLLECTION: string;
	MONGO_PORT: string;
	REDIS_TEST_DATABASE: string;
	REDIS_USERS_KEY_BASE: string;
	REDIS_USER_POKEMONS_LIST_KEY: string;
	REDIS_USER_REFRESH_TOKEN_KEY: string;
	REDIS_PORT: string;
	REFRESH_TOKEN_TTL_DAYS: string;
	ACCESS_TOKEN_TTL_MINUTES: string;
	SALT: string;
};

export type EnvSecrets = {
	ACCESS_TOKEN_JWT_SECRET: string;
	REFRESH_TOKEN_JWT_SECRET: string;
	REFRESH_TOKEN_AES_SECRET: string;
};

export type NodeEnvs = "production" | "development" | "test";
export type AppMachineType = "docker" | "local_machine";
