import { PokemonHeight } from "../../pokemonHeight";

describe("PokemonHeight", () => {
	// HAPPY PATH
	it("Should successfully return { height: 60 } when [height] is valid", () => {
		const pokemonHeight = new PokemonHeight(60);
		const expected = { height: 60 };

		expect(pokemonHeight).toEqual(expected);
	});

	// UNHAPPY PATH
	it("Should throw an error for wrong type. When height type is [string], throw with message [Invalid height. It must be a number, but received type: string]", () => {
		const expectedErrorMessage =
			"Invalid height. It must be a number, but received type: string";
		const invalidHeight = "60" as unknown;
		const invalidPokemonHeight = () => {
			new PokemonHeight(invalidHeight as number);
		};

		expect(invalidPokemonHeight).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid height. It must be a positive number, but received: 0] for empty Height", () => {
		const expectedErrorMessage =
			"Invalid height. It must be a positive number, but received: 0";
		const invalidPokemonHeight = () => {
			new PokemonHeight(0);
		};

		expect(invalidPokemonHeight).toThrow(expectedErrorMessage);
	});
});
