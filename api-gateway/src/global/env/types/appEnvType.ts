export type EnvValues = {
	APP_LOCAL: string;
	APP_PORT: string;
	DOCUMENTATION_APP_PORT: string;
	NODE_ENV: string;
	CORS_WHITELIST: string;
	REDIS_TEST_DATABASE: string;
	REDIS_POKEMON_KEY_BASE: string;
	REDIS_POKEMON_LIST_KEY: string;
	REDIS_CACHE_TTL_DAYS: string;
	REDIS_PORT: string;
	RATE_LIMIT_TIME_MINUTES: string;
	RATE_LIMIT_MAX_REQUESTS: string;
	JWT_AUTH_SECRET: string;
	POKEMON_SERVICE_PORT: string;
	POKEMON_SERVICE_NETWORK_NAME: string;
	USERS_SERVICE_PORT: string;
	USERS_SERVICE_NETWORK_NAME: string;
};

export type NodeEnvs = "production" | "development" | "test";
export type AppMachineType = "docker" | "local_machine";
