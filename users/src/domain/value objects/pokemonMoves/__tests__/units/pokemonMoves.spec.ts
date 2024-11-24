import type { Move } from "../../../../entities/pokemon/types/pokemon";
import { PokemonMoves } from "../../pokemonMoves";

describe("PokemonMoves", () => {
	// HAPPY PATH
	it("Should successfully return {moves: [{name: 'Programming with Typescript'}]} when [name] is valid", () => {
		const pokemonMoves = new PokemonMoves([
			{ name: "Programming with Typescript" },
		]);
		const expected = {
			moves: [{ name: "Programming with Typescript" }],
		};

		expect(pokemonMoves).toEqual(expected);
	});

	// //UNHAPPY PATH
	it("Should throw an error with message [Invalid moves. It must be a non-empty array] if [moves] is not an array", () => {
		const expectedErrorMessage = "Invalid moves. It must be a non-empty array";
		const invalidMoveName = { name: "not a valid move" } as unknown;
		const invalidPokemonMoves = () => {
			new PokemonMoves(invalidMoveName as { name: string }[]);
		};

		expect(invalidPokemonMoves).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid moves. It must be a non-empty array] if [moves] is an array with 0 length", () => {
		const expectedErrorMessage = "Invalid moves. It must be a non-empty array";
		const invalidMoveName = [] as unknown;
		const invalidPokemonMoves = () => {
			new PokemonMoves(invalidMoveName as { name: string }[]);
		};

		expect(invalidPokemonMoves).toThrow(expectedErrorMessage);
	});

	it("Should throw an error for wrong type. When [name] type is [number], throw with message [Invalid move name. It must be a string, but received type: number]", () => {
		const expectedErrorMessage =
			"Invalid move name. It must be a string, but received type: number";
		const invalidMoveName = [{ name: 123 }] as unknown;
		const invalidPokemonMoves = () => {
			new PokemonMoves(invalidMoveName as { name: string }[]);
		};

		expect(invalidPokemonMoves).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid move name. It must be a string, but received type: undefined] for empty [name]", () => {
		const expectedErrorMessage =
			"Invalid move name. It must be a string, but received type: undefined";
		const invalidPokemonMoves = () => {
			new PokemonMoves([{}] as Move[]);
		};

		expect(invalidPokemonMoves).toThrow(expectedErrorMessage);
	});
});
