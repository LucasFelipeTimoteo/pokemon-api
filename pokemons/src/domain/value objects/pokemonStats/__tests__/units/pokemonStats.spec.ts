import type { Stat } from "../../../../entities/pokemon/types/pokemon";
import { PokemonStats } from "../../pokemonStats";

describe("PokemonStats", () => {
	// HAPPY PATH
	it("Should successfully return {type: ....} when [...] is valid", () => {
		const pokemonStats = new PokemonStats([
			{ name: "Typescript", base_stat: 23, effort: 2 },
		]);
		const expected = {
			stats: [{ name: "Typescript", base_stat: 23, effort: 2 }],
		};

		expect(pokemonStats).toEqual(expected);
	});

	// //UNHAPPY PATH
	it("Should throw an error with message [Invalid stats. It must be a non-empty array] if [stats] is not an array", () => {
		const expectedErrorMessage = "Invalid stats. It must be a non-empty array";
		const invalidStat = { name: "not a valid type" } as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid stats. It must be a non-empty array] if [stats] is an array with 0 length", () => {
		const expectedErrorMessage = "Invalid stats. It must be a non-empty array";
		const invalidStat = [] as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error for wrong stats type. When [name] type is [number], throw with message [Invalid stat name. It must be a string, but received type: number]", () => {
		const expectedErrorMessage =
			"Invalid stat name. It must be a string, but received type: number";
		const invalidStat = [{ name: 123 }] as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid stat name. It must be a string, but received type: undefined] for empty [name]", () => {
		const expectedErrorMessage =
			"Invalid stat name. It must be a string, but received type: undefined";
		const invalidPokemonStats = () => {
			new PokemonStats([{}] as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error for wrong stats type. When [base_stat] type is [string], throw with message [Invalid stat base_stat. It must be a number, but received type: string]", () => {
		const expectedErrorMessage =
			"Invalid stat base_stat. It must be a number, but received type: string";
		const invalidStat = [
			{ name: "my stat", base_stat: "invalid", effort: 1 },
		] as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid stat base_stat. It must not be a negative number, but received -2] for negative [base_stat]", () => {
		const expectedErrorMessage =
			"Invalid stat base_stat. It must not be a negative number, but received -2";
		const invalidStat = [
			{ name: "my stat", base_stat: -2, effort: 1 },
		] as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error for wrong stats type. When [effort] type is [string], throw with message [Invalid stat effort. It must be a number, but received type: string]", () => {
		const expectedErrorMessage =
			"Invalid stat effort. It must be a number, but received type: string";
		const invalidStat = [
			{ name: "my stat", base_stat: 1, effort: "invalid" },
		] as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid stat effort. It must not be a negative number, but received -2] for negative [effort]", () => {
		const expectedErrorMessage =
			"Invalid stat effort. It must not be a negative number, but received -2";
		const invalidStat = [
			{ name: "my stat", base_stat: 1, effort: -2 },
		] as unknown;
		const invalidPokemonStats = () => {
			new PokemonStats(invalidStat as Stat[]);
		};

		expect(invalidPokemonStats).toThrow(expectedErrorMessage);
	});
});
