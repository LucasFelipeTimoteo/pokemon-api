import type { Express } from "express";
import request from "supertest";
import { ApiError } from "../../src/application/errors/api/apiError";
import pokemon from "../../src/global/fixtures/pokemon/pokemon.json";
import pokemonList from "../../src/global/fixtures/pokemon/pokemonList.json";
import rawPokemonDetails from "../../src/global/fixtures/pokemon/rawPokemonDetails.json";
import { RedisSeeds } from "../../src/global/utils/tests/seeds/redisSeeds";
import { AppFactory } from "../../src/infra/http/express/app/utils/factories/appFactory";
import { pinoLogger } from "../../src/infra/logger/pino/pinoLogger";
import { getRedisClient } from "../../src/infra/services/db/redis/redisClient";
import { PokemonAxiosHttpClient } from "../../src/infra/services/httpRequests/axios/PokemonAxiosHttpClient";

jest.mock("../../src/infra/services/httpRequests/axios/PokemonAxiosHttpClient");
const MockedPokemonAxiosHttpClient = jest.mocked(PokemonAxiosHttpClient);
MockedPokemonAxiosHttpClient.prototype.getOne.mockResolvedValue({
	success: true,
	data: rawPokemonDetails,
});

MockedPokemonAxiosHttpClient.prototype.getAll.mockResolvedValue([
	{
		success: true,
		data: rawPokemonDetails,
	},
	{
		success: true,
		data: rawPokemonDetails,
	},
]);

let app: Express;
const redisClientPromise = getRedisClient(pinoLogger);
let redisClient: Awaited<typeof redisClientPromise>;

beforeEach(async () => {
	const appFactory = AppFactory({ cacheDatabaseClient: redisClientPromise });
	app = appFactory.exec();
	redisClient = await redisClientPromise;
	const seeds = new RedisSeeds(redisClient);
	await seeds.exec();
});

afterAll(async () => {
	redisClient.disconnect();
});

describe("healthcheck", () => {
	it("Should return status [200] with message [OK] from request on healthcheck endpoint", async () => {
		await request(app).get("/health").expect(200).expect("OK");
	});
});

describe("Get one pokemon", () => {
	// HAPPY PATH
	it("Should return the correct pokemon from cache based on [id] provided with status [200] and header [Content-Type: application/json; charset=utf-8]", async () => {
		await request(app)
			.get(`/pokemons/${pokemon.pokemon_id}`)
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(200)
			.expect(pokemon);

		expect(
			MockedPokemonAxiosHttpClient.prototype.getOne,
		).not.toHaveBeenCalled();
	});

	it("Should return the correct pokemon from API (mocked) based on [id] provided with status [200] and header [Content-Type: application/json; charset=utf-8]", async () => {
		await redisClient.flushDb();
		await request(app)
			.get(`/pokemons/${rawPokemonDetails.id}`)
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(200)
			.expect(pokemon);

		expect(MockedPokemonAxiosHttpClient.prototype.getOne).toHaveBeenCalled();
	});

	// UNHAPPY PATH

	it("Shoud return [status: 400] and {message: 'ApiError: Pokemon id should be greather than 0. Received: -39'} if provided [pokemonId] is less than or equal 0 like -39", async () => {
		await request(app).get("/pokemons/-39").expect(400).expect({
			message: "ApiError: Pokemon id should be greather than 0. Received: -39",
		});
	});

	it("Shoud return [status:400] and an error object {message: 'ApiError: Pokemon id should be greather than 0. Received: 0'} if provided [pokemonId] is less than or equal 0 like 0", async () => {
		await request(app).get("/pokemons/0").expect(400).expect({
			message: "ApiError: Pokemon id should be greather than 0. Received: 0",
		});
	});

	it("Shoud return [status:404] and an error object {message: 'ApiError: Cannot find a pokemon with provided id. Received [id: 999999999999]'} if provided [pokemonId] is valid, but do not match any pokemon, like value 999999999999}", async () => {
		MockedPokemonAxiosHttpClient.prototype.getOne.mockRejectedValue(
			new ApiError(
				"Cannot find a pokemon with provided id. Received [id: 999999999999]",
				404
			),
		);

		await request(app).get("/pokemons/999999999999").expect(404).expect({
			message:
				"ApiError: Cannot find a pokemon with provided id. Received [id: 999999999999]",
		});
	});
});

describe("Get pokemon list", () => {
	// Happy path
	it("Should return the correct pokemonList from cache with status [200] and header [Content-Type: application/json; charset=utf-8]", async () => {
		await request(app)
			.get("/pokemons")
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(200)
			.expect(pokemonList);

		expect(
			MockedPokemonAxiosHttpClient.prototype.getAll,
		).not.toHaveBeenCalled();
	});

	it("Should return the correct pokemonList from API (mocked) with status [200] and header [Content-Type: application/json; charset=utf-8]", async () => {
		await redisClient.flushDb();

		await request(app)
			.get("/pokemons")
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(200)
			.expect([pokemon, pokemon]);

		expect(MockedPokemonAxiosHttpClient.prototype.getAll).toHaveBeenCalled();
	});

	// Unhappy path
	it('Should return and error object from API (mocked) with value { message: "API Validation error. Cannot process the request" } if [getAll] have and [Error] object', async () => {
		await redisClient.flushDb();
		MockedPokemonAxiosHttpClient.prototype.getAll.mockResolvedValue([
			{ success: false, error: Error("some error") },
		]);
		await request(app)
			.get("/pokemons")
			.expect(500)
			.expect({ message: "API Validation error. Cannot process the request" });

		expect(MockedPokemonAxiosHttpClient.prototype.getAll).toHaveBeenCalled();
	});
});
