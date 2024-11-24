import { PokemonName } from "../../pokemonName";

describe("PokemonName", () => {
	// HAPPY PATH
	it("Should successfully return { name: 'Pikachu' } when [name] is valid", () => {
		const pokemonName = new PokemonName("Pikachu");
		const expected = { name: "Pikachu" };

		expect(pokemonName).toEqual(expected);
	});

	// UNHAPPY PATH
	it("Should throw an error for wrong type. When name type is [number], throw with message [Invalid name. It must be a string, but received type: number]", () => {
		const expectedErrorMessage =
			"Invalid name. It must be a string, but received type: number";
		const invalidName = 123 as unknown;
		const invalidPokemonName = () => {
			new PokemonName(invalidName as string);
		};

		expect(invalidPokemonName).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid name. It must not be empty, but received: ] for empty name", () => {
		const expectedErrorMessage =
			"Invalid name. It must not be empty, but received: ";
		const invalidPokemonName = () => {
			new PokemonName("");
		};

		expect(invalidPokemonName).toThrow(expectedErrorMessage);
	});
});
