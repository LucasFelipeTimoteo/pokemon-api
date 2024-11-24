import { PokemonWeight } from "../../pokemonWeight";

describe("PokemonWeight", () => {
	// HAPPY PATH
	it("Should successfully return { weight: 60 } when [weight] is valid", () => {
		const pokemonWeight = new PokemonWeight(60);
		const expected = { weight: 60 };

		expect(pokemonWeight).toEqual(expected);
	});

	// UNHAPPY PATH
	it("Should throw an error for wrong type. When weight type is [string], throw with message [Invalid weight. It must be a number, but received type: string]", () => {
		const expectedErrorMessage =
			"Invalid weight. It must be a number, but received type: string";
		const invalidweight = "60" as unknown;
		const invalidPokemonWeight = () => {
			new PokemonWeight(invalidweight as number);
		};

		expect(invalidPokemonWeight).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid weight. It must be a positive number, but received: -1] for empty weight", () => {
		const expectedErrorMessage =
			"Invalid weight. It must be a positive number, but received: -1";
		const invalidPokemonWeight = () => {
			new PokemonWeight(-1);
		};

		expect(invalidPokemonWeight).toThrow(expectedErrorMessage);
	});
});
